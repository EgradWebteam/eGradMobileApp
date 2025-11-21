import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { backEndUrl, frontEndUrl,backEndPort } from "../apiConfig";
import defaultImage from '../images/studentimage.png';
import headerImage from '../images/EGTLogoExamHeaderCompressed.png';
// import { closeTestWindowIfOpen } from '../hooks/windowManager';
import { useSession } from '../hooks/SessionContext';
import { styles } from '../styles/StudentDashboardStyles';
import AsyncStorage from "@react-native-async-storage/async-storage";
const StudentDashboardHeader = ({
  userData,
  setActiveSection,
  setActiveSubSection,
  logoSrc,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const { validateSession } = useSession() || {};

  const studentProfile = userData?.uploaded_photo;

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

  const handleProfileClick = async () => {
    const isValid = await validateSession();
    if (!isValid) return;
    setActiveSection('account');
    setActiveSubSection('profile');
    setModalVisible(false);
  };

  const handlePasswordClick = async () => {
    const isValid = await validateSession();
    if (!isValid) return;
    setActiveSection('account');
    setActiveSubSection('password');
    setModalVisible(false);
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <Image
          source={logoSrc ? { uri: logoSrc } : headerImage}
          style={styles.logo}
          resizeMode="contain"
          onError={() => {}}
        />
      </View>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.profileContainer}
      >
        <Image
          source={
            studentProfile ? { uri: studentProfile } : defaultImage
          }
          style={styles.profileImage}
          resizeMode="cover"
          onError={() => {}}
        />
      </TouchableOpacity>

      {/* Modal for profile actions */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={handleProfileClick}>
              <Text style={styles.modalItem}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePasswordClick}>
              <Text style={styles.modalItem}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default StudentDashboardHeader;


