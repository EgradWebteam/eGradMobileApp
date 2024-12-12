import {
    View,
    Text,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
  } from "react-native";
  import { useState } from "react";
  import { Stack, useRouter } from "expo-router";
  
  import styles from './components/Header/HeaderStyles'
  const Home = () => {
    const router = useRouter();
    const [showText, setShowText] = useState(false);
    const toggleVisibility = () => {
      setShowText(!showText);
    };
  
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "pink" }}>
        <Stack.Screen
          options={{
            headerStyle: { backgroundColor: "blue" },
            headerShadowVisible: false,
          }}
        />
        <Text>Home vnaaa</Text>
        <View style={styles.container}>
          <TouchableOpacity onPress={toggleVisibility}>
            <Text>Click Me</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>Second Btn</Text>
          </TouchableOpacity>
        </View>
        {showText && <Text>This is the text below the btn!!!!!!!!</Text>}
          <TouchableOpacity onPress={()=>router.push('/profile')}>
            <Text>Go to Profile</Text>
          </TouchableOpacity>
      </SafeAreaView>
    );
  };
  export default Home;
  
// app.js/index.js-> this is the main root page
// app/home.js-> this should be /home page
