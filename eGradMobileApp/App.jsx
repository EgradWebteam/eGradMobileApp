// In App.js in a new project

import * as React from 'react';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screen/HomeScreen';
import { QBScreen } from './src/screen/QBScreen';
import { LoginScreen } from './src/screen/LoginScreen';
import { StudentDashboard } from './src/screen/StudentDashboardScreens/StudentDashboard';
const Stack=createNativeStackNavigator()
const App = () => {
  return (
<>
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' screenOptions={{
        headerShown:false,
      }}>
      <Stack.Screen name={'Home'} component={HomeScreen} 
      // options={{
      //   title:"HomeScreen",
      //   headerStyle:{
      //     backgroundColor:"orange",
      //   },statusBarBackgroundColor:"green"
      // }}
      />
      <Stack.Screen name={"login"} component={LoginScreen}/>
      <Stack.Screen name={'QBScreen'} component={QBScreen} />
      <Stack.Screen name={"studentDashboard"} component={StudentDashboard}/>
      </Stack.Navigator>
    </NavigationContainer>
    <Toast/>
    </>
  )
}
export default App

