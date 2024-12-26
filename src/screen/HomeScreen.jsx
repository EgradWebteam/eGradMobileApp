import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { fontSize, spacing } from '../constants/dimensions'
import { colors } from '../constants/colors'

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.headdingDiv}>
                <Image source={require('../images/capImg.png')}
                    style={[styles.capImg, styles.boxShadow]}
                />
                <Text style={styles.headLine}>Weclome to eGRADTutor</Text>
                <View style={styles.tutoringDiv}>
                    <Text style={styles.tutoringHeadLine}>...tutoring by GRAD's from IIT's/IISc</Text>
                </View>
            </View>
        <View style={styles.qbBtnContainer}>
            <TouchableOpacity>
                <Text >
                    Go to QuestionBank Page.
                </Text>
            </TouchableOpacity>
        </View>
        </View>
    )
}

export default HomeScreen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "start",
        width: "100%",
        // borderWidth: 3,
        // borderColor: "red",
    },
    headdingDiv: {
        width: "100%",
        height: 250,
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
        backgroundColor: "#00222c",
        padding: 40
    },
    headLine: {
        fontSize: fontSize.xl,
        color: "white",
        paddingTop: 20,
        fontWeight: "bold",

    },
    tutoringHeadLine: {
        color: colors.white,
        fontWeight: "bold",

    },
    tutoringDiv: {
        position: "absolute",
        left: "33%",
        top: "115%",

    },
    capImg: {
        width: 200,
        height: 100,
        resizeMode: "contain",
        backgroundColor: "white",
    },
    boxShadow: {
        shadowColor: 'black', 
        shadowOffset: { width: 6, height: 10 }, // Apply shadow offset for iOS
        shadowOpacity: 0.6, // Apply shadow opacity for iOS
        shadowRadius: 5, // Apply shadow radius for iOS
        elevation: 10, // Apply elevation for Android
    },
    qbBtnContainer:{
        // flex:1,
        alignItems:"center",
        justifyContent:"center",
        width:"100%",
        height:100,
        // borderWidth: 3,
        // borderColor: "red",
    },

    
})