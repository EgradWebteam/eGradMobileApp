import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import NextScreen from "./screens/NextScreen";
import { createStackNavigator } from "@react-navigation/stack";
import  QuestionBankHomePage  from "./questionBank/QuestionBankHomePage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import QuestionBankPage from "./questionBank/QuestionBankPage";
const Stack = createStackNavigator();
export default function App() {
 
  // const getNavigationState = async () => {
  //   try {
  //     const state = await AsyncStorage.getItem('@navigation_state');
  //     return state ? JSON.parse(state) : undefined;
  //   } catch (e) {
  //     console.error('Failed to load navigation state:', e);
  //     return undefined;
  //   }
  // };
  // useEffect(() => {
  //   const loadState = async () => {
  //     const savedState = await getNavigationState();
  //     setNavigationState(savedState);
  //     setIsReady(true);  // Ensure state is loaded before rendering
  //   };

  //   loadState();
  // }, []);
  
  // const saveNavigationState = async (state) => {
  //   try {
  //     await AsyncStorage.setItem('@navigation_state', JSON.stringify(state));
  //   } catch (e) {
  //     console.error('Failed to save navigation state:', e);
  //   }
  // };

  // useEffect(() => {
  //   setIsReady(true); // Make sure the app is ready before rendering the navigation
  // }, []);

  // if (!isReady) {
  //   return null; // Or loading spinner
  // }


  return (
    <NavigationContainer style={styles.container}
    // onStateChange={(state) => saveNavigationState(state)} 
      // initialState={getNavigationState()}
    >
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Next" component={NextScreen} />
        <Stack.Screen
          name="QuestionBankHomePage"
          component={QuestionBankHomePage}
        />
        <Stack.Screen name='QuestionBankPage' component={QuestionBankPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 40,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
});
