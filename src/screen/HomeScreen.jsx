import React from 'react'
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native'
import { homeScreenStyles } from '../styles/HomeScreenStyles'
const { width } = Dimensions.get('window')
const HomeScreen = (props) => {
    console.log(props, "these r props");

    const isTablet = width > 768;
    return (
        <View style={homeScreenStyles.container}>
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
            </View>
        </View>
    )
}

export default HomeScreen
