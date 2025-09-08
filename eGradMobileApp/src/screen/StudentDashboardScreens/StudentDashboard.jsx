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

 import { backEndUrl, frontEndUrl,backEndPort } from "../../apiConfig";
// import LoadingSpinner from '../../ContextFolder/LoadingSpinner';
// import { closeTestWindowIfOpen } from '../../ContextFolder/windowManager';
import StudentDashboardHeader from '../../components/StudentDashboardHeader';
import StudentDashboardLeftSidebar from '../../components/StudentDashboardLeftSidebar';

// Dummy components to simulate lazy-loaded
import StudentDashboardHome from '../../components/StudentDashboardHome';
import StudentDashboardMyCourses from '../../components/StudentDashboardMyCourses';
import StudentDashboardBuyCourses from '../../components/StudentDashboardBuyCourses';
import StudentDashboardBookMarks from '../../components/StudentDashboardBookMarks';
import StudentDashboardMyResults from '../../components/StudentDashboardMyResults';
import StudentDashboard_AccountSettings from '../../components/StudentDashboard_AccountSettings';

export const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeSubSection, setActiveSubSection] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [portalData, setPortalData] = useState({
    portalId: null,
    logoText: 'eGRADTutor',
    logoImg: null,
  });

  const navigation = useNavigation();
  const logoutHandledRef = useRef(false);

  const [studentData, setStudentData] = useState(null);

  const loadStudentData = async () => {
    const data = await AsyncStorage.getItem('studentData');
    setStudentData(JSON.parse(data));
  };
  console.log(studentData);
  const handleLogout = async () => {
    try {
      await fetch(`${backEndUrl}/login/studentLogout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: await AsyncStorage.getItem('sessionId') }),
      });

      await AsyncStorage.clear();
      // closeTestWindowIfOpen();
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginPage' }],
      });
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  const fetchPortalData = async () => {
    try {
      const response = await fetch(`${frontEndUrl}:${backEndPort}/navbar/get-logo`, {
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

  useEffect(() => {
    loadStudentData();
    fetchPortalData();
    setIsLoading(false);
  }, []);

  // Auto-logout on inactivity (AppState-based)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background') {
        handleLogout();
      }
    });
    return () => subscription.remove();
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <StudentDashboardHome
            studentName={studentData?.userDetails?.candidate_name}
            portalId={portalData.portalId}
            logoText={portalData.logoText}
            handleSectionChange={setActiveSection}
          />
        );
      case 'myCourses':
        return <StudentDashboardMyCourses studentId={studentData?.userDetails?.student_registration_id} />;
      case 'buyCourses':
        return <StudentDashboardBuyCourses studentId={studentData?.userDetails?.student_registration_id} />;
      case 'results':
        return <StudentDashboardMyResults studentId={studentData?.userDetails?.student_registration_id} />;
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

  // if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <StudentDashboardHeader
        userData={studentData?.userDetails}
        logoSrc={portalData.logoImg}
        setActiveSection={setActiveSection}
      />

      <View style={styles.body}>
        <StudentDashboardLeftSidebar
          activeSection={activeSection}
          handleSectionChange={setActiveSection}
        />
        <ScrollView contentContainerStyle={styles.contentArea}>{renderSection()}</ScrollView>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  body: {
    flexDirection: 'row',
    flex: 1,
  },
  contentArea: {
    flexGrow: 1,
    padding: 16,
  },
});
