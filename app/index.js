import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet
} from "react-native";
import { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

const Home = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "pink" }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "blue" },
          headerShadowVisible: false,
        }}
      />
      <Text>Index page</Text>
      <Image style={indexPageStyles.image} source={require('./assets/splash-icon.png')}/>
      <StatusBar style="auto"/>
      <TouchableOpacity onPress={()=>router.push('/downloads')
      }>
        <Text style={{padding:6,border:"1px solid blue", width:"180px", borderRadius:"14px",paddingLeft:"10px",marginLeft:"20px"}}>Go to Downloads page</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
export default Home;

const indexPageStyles=StyleSheet.create({
  image:{
    height:"200px",
    width:200
  }
})