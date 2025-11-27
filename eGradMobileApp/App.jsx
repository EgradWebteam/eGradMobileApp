import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './src/screen/HomeScreen';
import { LoginScreen } from './src/screen/LoginScreen';
import { RegisterationPage } from './src/screen/RegisterationPage';
import { QBScreen } from './src/screen/QBScreen';
import TermsAndConditions from './src/screen/TermsAndConditions';

import { StudentDashboard } from './src/screen/StudentDashboardScreens/StudentDashboard';
import StudentReportMain from './src/components/StudentReportMain';
import TestScreen from "./src/screen/TestScreen";
import ExamInstructionsScreen from "./src/screen/ExamInstructionsScreen";
import GeneralInstructionsScreen from './src/screen/GeneralInstructionsScreen';
import StudyMaterial from './src/components/StudyMaterial';
import PracticeScreen from './src/screen/PracticeScreen';
import PracticeInstruction from './src/screen/PracticeInstruction';
import FooterTermsAndConditions from "./src/screen/FooterTermsAndConditions.jsx";
import FooterPrivacyPolicy from "./src/screen/FooterPrivacyPolicy.jsx";
import FooterRefundPolicy from "./src/screen/FooterRefundPolicy.jsx";
import StudentProvider from './src/hooks/StudentContext';
import { SessionProvider } from './src/hooks/SessionContext';
import { backEndUrl } from "./src/apiConfig";

const navigationRef = createNavigationContainerRef();
const Stack = createNativeStackNavigator();

// Navigate anywhere
export const navigateTo = (name, params) => {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name, params }],
    });
  }
};

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null); // null = loading

  const verifySession = async (sessionId) => {
    try {
      const response = await fetch(`${backEndUrl}/login/verifySession`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Error verifying session:', error);
      return false;
    }
  };

  const determineInitialRoute = async () => {
    try {
      const keys = ['accessToken', 'decryptedId', 'sessionId', 'userId', 'studentData'];
      const values = await AsyncStorage.multiGet(keys);
      const hasAllKeys = values.every(([_, value]) => value !== null && value !== '');

      if (hasAllKeys) {
        const sessionId = values.find(([key]) => key === 'sessionId')[1];
        const sessionValid = await verifySession(sessionId);
        if (sessionValid) {
          setInitialRoute('studentDashboard');
        } else {
          await AsyncStorage.clear();
          Alert.alert('Session Expired', 'You have been logged out.');
          setInitialRoute('login');
        }
      } else {
        await AsyncStorage.clear();
        setInitialRoute('Home');
      }
    } catch (err) {
      await AsyncStorage.clear();
      console.error('Error checking student data:', err);
      setInitialRoute('Home'); // fallback route if anything fails
    }
  };

  useEffect(() => {
    determineInitialRoute();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3399cc" />
      </View>
    );
  }

  return (
    <StudentProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }}
        >

          {/* Public Screens */}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="login" component={LoginScreen} />
          <Stack.Screen name="register" component={RegisterationPage} />
          <Stack.Screen name="QBScreen" component={QBScreen} />
          <Stack.Screen name="TermsAndConditions" component={FooterTermsAndConditions} />
 <Stack.Screen name="PrivacyPolicy" component={FooterPrivacyPolicy} />
  <Stack.Screen name="RefundPolicy" component={FooterRefundPolicy} />


          {/* Private Screens wrapped with SessionProvider */}
          <Stack.Screen name="studentDashboard">
            {() => (
              <SessionProvider>
                <StudentDashboard />
              </SessionProvider>
            )}
          </Stack.Screen>

          <Stack.Screen name="StudentReport">
            {() => (
              <SessionProvider>
                <StudentReportMain />
              </SessionProvider>
            )}
          </Stack.Screen>

          <Stack.Screen name="ExamInstructions">
            {() => (
              <SessionProvider>
                <ExamInstructionsScreen />
              </SessionProvider>
            )}
          </Stack.Screen>

          <Stack.Screen name="GeneralInstructions">
            {() => (
              <SessionProvider>
                <GeneralInstructionsScreen />
              </SessionProvider>
            )}
          </Stack.Screen>

          <Stack.Screen name="StudyMaterial">
            {() => (
              <SessionProvider>
                <StudyMaterial />
              </SessionProvider>
            )}
          </Stack.Screen>

          <Stack.Screen name="TestScreen">
            {() => (
              <SessionProvider>
                <TestScreen />
              </SessionProvider>
            )}
          </Stack.Screen>

          <Stack.Screen name="PracticeScreen">
            {() => (
              <SessionProvider>
                <PracticeScreen />
              </SessionProvider>
            )}
          </Stack.Screen>

          <Stack.Screen name="PracticeInstruction">
            {() => (
              <SessionProvider>
                <PracticeInstruction />
              </SessionProvider>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>

      <Toast />
    </StudentProvider>
  );
};

export default App;
