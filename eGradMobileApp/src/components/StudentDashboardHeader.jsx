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
import defaultImage from '../images/StudentImage.png';
import headerImage from '../images/EGTLogoExamHeaderCompressed.png';
// import { closeTestWindowIfOpen } from '../hooks/windowManager';
// import { useSession } from './hooks/SessionContext';

const StudentDashboardHeader = ({
  userData,
  setActiveSection,
  setActiveSubSection,
  logoSrc,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
//   const { validateSession } = useSession() || {};

  const studentProfile = userData?.uploaded_photo;

  const handleLogout = async () => {
    const sessionId = await AsyncStorage.getItem('sessionId');
    if (!sessionId) {
    //   closeTestWindowIfOpen();
      Alert.alert('Session Error', 'No session found. Please log in again.');
      navigation.navigate('LoginPage');
      return;
    }

    try {
      const response = await fetch(`${ backEndUrl}/login/studentLogout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.multiRemove([
          'decryptedId',
          'accessToken',
          'sessionId',
          'userId',
          'studentData',
          'navigationToken',
        ]);
        // closeTestWindowIfOpen();
        navigation.navigate('LoginPage');
      } else {
        Alert.alert('Logout Failed', data.message || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleProfileClick = async () => {
    // const isValid = await validateSession();
    // if (!isValid) return;
    setActiveSection('account');
    setActiveSubSection('profile');
    setModalVisible(false);
  };

  const handlePasswordClick = async () => {
    // const isValid = await validateSession();
    // if (!isValid) return;
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

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f1f1f1',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    width: 150,
    height: 40,
  },
  profileContainer: {
    padding: 5,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000060',
    justifyContent: 'flex-end',
    padding: 10,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
  },
  modalItem: {
    fontSize: 16,
    paddingVertical: 10,
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: '#d9534f',
    padding: 10,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    textAlign: 'center',
  },
});
