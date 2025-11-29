import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  BackHandler,
  TouchableOpacity,
  Alert,
  AppState,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useStudent } from '../../hooks/StudentContext';
import { backEndUrl, frontEndUrl, backEndPort } from "../../apiConfig";
import StudentDashboardHeader from '../../components/StudentDashboardHeader';
import StudentDashboardBottomToolbar from '../../components/StudentDashboardBottomToolbar.jsx'; // New component
import { useSession } from '../../hooks/SessionContext';
// Dummy components to simulate lazy-loaded
import StudentDashboardHome from '../../components/StudentDashboardHome';
import StudentDashboardMyCourses from '../../components/StudentDashboardMyCourses';
import StudentDashboardBuyCourses from '../../components/StudentDashboardBuyCourses';
import StudentDashboardBookMarks from '../../components/StudentDashboardBookMarks';
import StudentDashboardMyResults from '../../components/StudentDashboardMyResults';
import StudentDashboard_AccountSettings from '../../components/StudentDashboard_AccountSettings';

import { ActivityIndicator } from 'react-native-paper';

export const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeSubSection, setActiveSubSection] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [portalData, setPortalData] = useState({
    portalId: null,
    logoText: 'eGRADTutor',
    logoImg: null,
  });
  const { studentData } = useStudent();
  const navigation = useNavigation();
  const logoutHandledRef = useRef(false);
  const { validateSession } = useSession();
  const [preselectedPortalId, setPreselectedPortalId] = useState(null);
const handleSectionChange = useCallback(async (section, portalId = null) => {
  const isValid = await validateSession();
  if (!isValid) return;

  setActiveSection(section);

  const state = { activeSection: section };

  if (portalId) {
    state.preselectedPortalId = portalId;
    setPreselectedPortalId(portalId);
  } else {
    setPreselectedPortalId(null);
  }

  await AsyncStorage.setItem("studentDashboardState", JSON.stringify(state)); // ✅ fix here
}, [validateSession]);

  useEffect(() => {
    const restoreDashboardState = async () => {
      try {
        const savedState = await AsyncStorage.getItem("studentDashboardState");
        if (savedState) {
          const { activeSection } = JSON.parse(savedState);
          setActiveSection(activeSection || "dashboard"); // restore or default
        } else {
          setActiveSection("dashboard");
        }
      } catch (err) {
        console.error("Failed to restore dashboard state:", err);
        setActiveSection("dashboard"); // fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortalData();
    restoreDashboardState();
  }, []);

  // const handleLogout = async () => {
  //   try {
  //     await fetch(`${backEndUrl}/login/studentLogout`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ sessionId: await AsyncStorage.getItem('sessionId') }),
  //     });

  //     await AsyncStorage.clear();
  //     // closeTestWindowIfOpen();
  //     navigation.reset({
  //       index: 0,
  //       routes: [{ name: 'login' }],
  //     });
  //   } catch (err) {
  //     console.error('Logout error', err);
  //   }
  // };
    const handleLogout = async () => {
console.log("Attempting logout...");

    const sessionId = await AsyncStorage.getItem('sessionId');
    console.log("Session ID:", sessionId);

    if (!sessionId) {
      await AsyncStorage.clear();
      Alert.alert('Session Error', 'No session found. Please log in again.');
      navigation.navigate('login');
      return;
    }

    try {
      console.log("hhhh");
      const response = await fetch(`${ backEndUrl}/login/studentLogout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();
     console.log("hffhhh");
      if (response.ok) {
         console.log("hffhhh44");
         await AsyncStorage.clear();
        // closeTestWindowIfOpen();
        navigation.navigate('login');
      } else {
        Alert.alert('Logout Failed', data.message || 'Logout failed');
            await AsyncStorage.clear();
        // closeTestWindowIfOpen();
        navigation.navigate('login');
      }
    } catch (error) {
      console.error('Logout Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
          await AsyncStorage.clear();
        // closeTestWindowIfOpen();
        navigation.navigate('login');
    }
  };

  const fetchPortalData = async () => {
    try {
      const response = await fetch(`${backEndUrl}/navbar/get-logo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: frontEndUrl }),
      });
      const data = await response.json();
      if (data.portalId) {
        setPortalData({
          portalId: data.portalId,
          logoText: data.instituteName || 'eGRADTutor',
          logoImg: data.logo,
        });
      }
    } catch (error) {
      console.error('Failed to fetch portal info:', error);
    }
  };

  console.log("Dashboard activeSection:", activeSection);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <StudentDashboardHome
            studentName={studentData?.userDetails?.candidate_name}
            portalId={portalData.portalId}
            logoText={portalData.logoText}
            handleSectionChange={handleSectionChange}
          />
        );
      case 'myCourses':
        return <StudentDashboardMyCourses studentId={studentData?.userDetails?.student_registration_id} userData={studentData?.userDetails} />;
      case 'buyCourses':
        return <StudentDashboardBuyCourses studentId={studentData?.userDetails?.student_registration_id} setActiveSection={setActiveSection} preselectedPortalId={preselectedPortalId} />;
      case 'results':
        return <StudentDashboardMyResults studentId={studentData?.userDetails?.student_registration_id} userData={studentData?.userDetails} />;
      case 'bookmarks':
        return <StudentDashboardBookMarks studentId={studentData?.userDetails?.student_registration_id} />;
      case 'account':
        return (
          <StudentDashboard_AccountSettings
            activeSubSection={activeSubSection}
            setActiveSubSection={setActiveSubSection}
            userData={studentData?.userDetails}
          />
        );
      default:
        return null;
    }
  };


//   useEffect(() => {
//   const onBackPress = () => {
//     Alert.alert(
//       "Logout Confirmation",
//       "Are you sure you want to logout?",
//       [
//         {
//           text: "No",
//           onPress: () => {},
//           style: "cancel"
//         },
//         {
//           text: "Yes",
//           onPress: () => {
//             handleLogout();  
//           }
//         }
//       ]
//     );

//     return true; // prevent default back action
//   };

//   BackHandler.addEventListener("hardwareBackPress", onBackPress);

//   return () => {
//     BackHandler.removeEventListener("hardwareBackPress", onBackPress);
//   };
// }, []);

useFocusEffect(
  useCallback(() => {
    const onBackPress = () => {
      Alert.alert(
        "Logout Confirmation",
        "Are you sure you want to logout?",
        [
          { text: "No", style: "cancel" },
          { text: "Yes", onPress: () => handleLogout() }
        ]
      );
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  }, [handleLogout])
);



  if (isLoading || !activeSection) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3399cc" />
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <StudentDashboardHeader
        userData={studentData?.userDetails}
        logoSrc={portalData.logoImg}
        setActiveSection={setActiveSection}
        setActiveSubSection={setActiveSubSection}
      />

      <View style={styles.body}>
        <ScrollView 
          style={styles.contentArea}
          contentContainerStyle={styles.contentContainer}
        >
          {renderSection()}
        </ScrollView>
      </View>

      {/* Bottom Toolbar */}
      <StudentDashboardBottomToolbar
        activeSection={activeSection}
        handleSectionChange={handleSectionChange}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   backgroundColor:"#fff",
  },
  body: {
    flex: 1,
  },
  contentArea: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 80, // Add padding to avoid content being hidden behind toolbar
  },
});