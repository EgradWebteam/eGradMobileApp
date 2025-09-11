import React, { createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { backEndUrl, frontEndUrl,backEndPort } from "../apiConfig";
// import { closeTestWindowIfOpen } from '../../../ContextFolder/windowManager';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const navigation = useNavigation();

  const validateSession = async () => {
    const sessionId = await AsyncStorage.getItem('sessionId');
    if (!sessionId) return;

    try {
      const response = await fetch(`${backEndUrl}/login/verifySession`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();

      if (!data.success) {
        Alert.alert(
          'Session Expired',
          'You have been logged out due to login from another device or tab.'
        );
        await clearSessionAndNavigate();
        return false;
      }

      return true;
    } catch (err) {
      console.error('Session check failed', err);
      return false;
    }
  };

  const validateSessionWithoutNavigation = async () => {
    const sessionId = await AsyncStorage.getItem('sessionId');
    const adminRole = await AsyncStorage.getItem('adminRole');

    if (adminRole === 'admin') {
      return true;
    }

    if (!sessionId) {
      return false;
    }

    try {
      const response = await fetch(`${backEndUrl}/login/verifySession`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        console.error('Non-200 response:', response.status);
        return false;
      }

      const data = await response.json();

      if (typeof data.success !== 'boolean') {
        console.warn('Unexpected response format:', data);
        return false;
      }

      if (!data.success) {
        Alert.alert(
          'Session Expired',
          'You have been logged out due to login from another device or tab.'
        );
        await clearSession(); // no navigation
        return false;
      }

      return true;
    } catch (err) {
      console.error('Session check failed due to fetch error:', err);
      return false;
    }
  };

  const clearSessionAndNavigate = async () => {
    await clearSession();
    // closeTestWindowIfOpen();
    navigation.reset({
      index: 0,
      routes: [{ name: 'login' }],
    });
  };

  const clearSession = async () => {
    await AsyncStorage.multiRemove([
      'decryptedId',
      'accessToken',
      'sessionId',
      'userId',
      'studentData',
      'OTS_FormattedTime',
      'studentDashboardState'
    ]);
  };

  return (
    <SessionContext.Provider value={{ validateSession, validateSessionWithoutNavigation }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
