// In App.js in a new project

import * as React from 'react';
import { View, Text ,StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screen/HomeScreen';
import { QBScreen } from './src/screen/QBScreen';
import { LoginScreen } from './src/screen/LoginScreen';
const Stack=createNativeStackNavigator()
const App = () => {
  return (

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
      </Stack.Navigator>
    </NavigationContainer>
  )
}
export default App

