import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { fontSize, spacing } from '../constants/dimensions'
import { colors } from '../constants/colors'

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.headdingDiv}>
                <Text style={styles.headLine}>Weclome to eGRADTutor</Text>
                <View style={styles.tutoringDiv}>
                    <Text style={styles.tutoringHeadLine}>...tutoring by GRAD's from IIT's/IISc</Text>
                </View>
            </View>
        </View>
    )
}

export default HomeScreen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        width: "100%",
        // borderWidth: 3,
        // borderColor: "red",
    },
    headdingDiv:{
        width:"100%",
        height:150,
        alignItems:"center",
        justifyContent:"center",
        position:"relative",
        backgroundColor:"#00222c",
    },
    headLine: {
        fontSize: fontSize.xl,
        color:"white",
    },
    tutoringHeadLine:{
        color:colors.white,
    },
    tutoringDiv:{
        position:"absolute",
        left:150,
        top:99,
    },

})