// In App.js in a new project

import * as React from 'react';
import { View, Text ,StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screen/HomeScreen';
const Stack=createNativeStackNavigator()
const App = () => {
  return (

    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' screenOptions={{
        headerShown:false,
      }}>
      <Stack.Screen name={"Home"} component={HomeScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
export default App

