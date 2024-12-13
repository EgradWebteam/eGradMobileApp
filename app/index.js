import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { Stack, useRouter } from "expo-router";

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

      <TouchableOpacity onPress={()=>router.push('/downloads')
      }>
        <Text style={{padding:6,border:"1px solid blue", width:"180px", borderRadius:"14px",paddingLeft:"10px",marginLeft:"20px"}}>Go to Downloads page</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
export default Home;

