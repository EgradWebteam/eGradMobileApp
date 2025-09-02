import * as React from 'react';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screen/HomeScreen';
import { QBScreen } from './src/screen/QBScreen';
import { LoginScreen } from './src/screen/LoginScreen';
import { RegisterationPage } from './src/screen/RegisterationPage';
import { StudentDashboard } from './src/screen/StudentDashboardScreens/StudentDashboard';
import StudentProvider from './src/hooks/StudentContext';
import {TestScreen}  from "./src/screen/TestScreen.jsx";
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <StudentProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="login" component={LoginScreen} />
          <Stack.Screen name="TestScreen" component={TestScreen} />
          <Stack.Screen name="register" component={RegisterationPage} />
          <Stack.Screen name="QBScreen" component={QBScreen} />
          <Stack.Screen name="studentDashboard" component={StudentDashboard} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </StudentProvider>
  );
};

export default App;
