import React,{useEffect} from 'react'
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native'
import { homeScreenStyles } from '../styles/HomeScreenStyles'
import Footer from '../components/Footer';
import { LoginHomeHeader } from '../components/LoginHomeHeader'
const { width } = Dimensions.get('window')
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
const HomeScreen = (props) => {
    // console.log(props, "these r props");
      // const navigation = useNavigation();
  // useEffect(() => {
  //   const checkStudentData = async () => {
  //     try {
  //       const keys = ['accessToken', 'decryptedId', 'sessionId', 'userId', 'studentData'];
  //       const values = await AsyncStorage.multiGet(keys);
  //       console.log(values);
  //       const hasAllKeys = values.every(([_, value]) => value !== null && value !== '');

  //       if (hasAllKeys) {
  //         // Navigate to Student Dashboard
  //         const userId = values.find(([key]) => key === 'userId')[1];
  //         console.log("Navigating to Student Dashboard with userId:", userId);
  //         navigation.reset({
  //           index: 0,
  //           routes: [{ name: 'studentDashboard', params: { userId } }],
  //         });
  //       } else {
  //         console.log('Missing some AsyncStorage keys. Stay on Home.');
  //       }
  //     } catch (error) {
  //       console.error('Error checking AsyncStorage:', error);
  //     }
  //   };

  //   checkStudentData();
  // }, []);
    const isTablet = width > 768;
    return (
        <>
        <LoginHomeHeader/>
        <View style={homeScreenStyles.container}>
            {/* <LandingHeader /> */}
            <View style={[homeScreenStyles.headdingDiv, isTablet ? homeScreenStyles.headdingDivTablet : homeScreenStyles.headdingDivMobile]}>
                <Image source={require('../images/capImg.png')}
                    style={[homeScreenStyles.capImg, homeScreenStyles.boxShadow]}
                />
                <View style={homeScreenStyles.welcomeDiv}>
                    <Text style={homeScreenStyles.headLine}>Weclome to eGRADTutor</Text>
                    <View style={[homeScreenStyles.tutoringDiv]}>
                        <Text style={[homeScreenStyles.tutoringHeadLine, isTablet ? homeScreenStyles.tutoringHeadLineT : homeScreenStyles.tutoringHeadLineM]}>...tutoring by GRAD's from IIT's/IISc</Text>
                    </View>
                </View>

            </View>
            <View style={homeScreenStyles.qbBtnContainer}>
                <TouchableOpacity style={homeScreenStyles.qbBtn} onPress={() => props.navigation.navigate('QBScreen', {
                    name: "VeenaRagi"
                })}>
                    <Text style={homeScreenStyles.qbBtnText} >
                        Go to QuestionBank Page
                    </Text>

                </TouchableOpacity>
                <TouchableOpacity  style={homeScreenStyles.qbBtn} onPress={()=>props.navigation.navigate("login")}>
                    <Text >
                        Login
                    </Text>
                </TouchableOpacity>
                   <TouchableOpacity  style={homeScreenStyles.qbBtn} onPress={()=>props.navigation.navigate("register")}>
                    <Text >
                        Register
                    </Text>
                </TouchableOpacity>
            </View>
            <Footer />
        </View>
        </>
    )
}

export default HomeScreen
