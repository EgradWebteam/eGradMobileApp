import  React , {useEffect} from 'react';
import Toast from 'react-native-toast-message';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screen/HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QBScreen } from './src/screen/QBScreen';
import { LoginScreen } from './src/screen/LoginScreen';
import { RegisterationPage } from './src/screen/RegisterationPage';
import { StudentDashboard } from './src/screen/StudentDashboardScreens/StudentDashboard';
import StudentReportMain from './src/components/StudentReportMain';
import StudentProvider from './src/hooks/StudentContext';
import TestScreen  from "./src/screen/TestScreen";
import ExamInstructionsScreen  from "./src/screen/ExamInstructionsScreen";
import GeneralInstructionsScreen from './src/screen/GeneralInstructionsScreen';
import TermsAndConditions from './src/screen/TermsAndConditions';
import StudyMaterial from './src/components/StudyMaterial';
import {
  
  ActivityIndicator,
  Alert,
  View
} from 'react-native';
import { backEndUrl, frontEndUrl,backEndPort } from "./src/apiConfig";
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';

const navigationRef = createNavigationContainerRef();

// Navigate anywhere
const navigateTo = (name, params) => {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name, params }],
    });
  }
};

const Stack = createNativeStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = React.useState(null); // null = still loading

const verifySession = async (sessionId) => {
  try {
    const response = await fetch(`${backEndUrl}/login/verifySession`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });

    const data = await response.json();
    return data.success === true; // make sure it always returns true/false
  } catch (error) {
    console.error('Error verifying session:', error);
    return false; // **important**: always return false on error
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
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="login" component={LoginScreen} />
          <Stack.Screen name="register" component={RegisterationPage} />
          <Stack.Screen name="QBScreen" component={QBScreen} />
          <Stack.Screen name="studentDashboard" component={StudentDashboard} />
          <Stack.Screen name="StudentReport" component={StudentReportMain} />
          <Stack.Screen name="ExamInstructions" component={ExamInstructionsScreen} />
          <Stack.Screen name="GeneralInstructions" component={GeneralInstructionsScreen} />
          <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
          <Stack.Screen name="StudyMaterial" component={StudyMaterial} />
          <Stack.Screen name="TestScreen" component={TestScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </StudentProvider>
  );
};


export default App;
