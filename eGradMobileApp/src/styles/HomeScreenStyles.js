import { StyleSheet } from "react-native";
import { fontSize } from "../constants/dimensions";
import { colors } from "../constants/colors";

export const homeScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "start",
        width: "100%",
    },
    headdingDiv: {
        width: "100%",
        height: 250,
        alignItems: "center",
        backgroundColor: "#00222c",
        padding: 40,
        // borderWidth:4,
        // borderColor:"green",
    },
    headdingDivTablet: {
        flexDirection: "row",
        width: "100%",
        height: 250,
        flexDirection: 'row',
        alignItems: "center",
        backgroundColor: "#00222c",
        padding: 40,
        gap: 40,
        alignItems: "center",
        // borderWidth: 3,
        // borderColor: "red",
        justifyContent: "center",
    },
    headdingDivMobile: {
        flexDirection: "column",
        justifyContent: "flex-start",
        gap:10
    },
    headLine: {
        fontSize: fontSize.xl,
        color: "white",
        fontWeight: "bold",

    },
    tutoringHeadLine: {
        color: colors.white,
        fontWeight: "bold",
    },
    tutoringDiv: {
        position: "absolute",
    },
    tutoringHeadLineT:{
        // borderWidth:4,
        // borderColor:"green",
        left: "69%",
        top: "215%",
    },
    welcomeDiv:{
        position:"relative",
        // borderWidth:4,
        // borderColor:"green",
    },
    tutoringHeadLineM:{
        right:0,
        left:0,
        left: "33%",
        bottom:0,
        top: "180%",
        bottom:"-10%",
    },
    capImg: {
        width: 200,
        height: 100,
        resizeMode: "contain",
        backgroundColor: "white",
    },
    boxShadow: {
        shadowColor: 'black',
        shadowOffset: { width: 6, height: 10 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
        elevation: 10,
    },
    qbBtnContainer: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: 100,
    },
    qbBtn: {
        borderWidth: 2,
        borderColor: "#15aaeb",
        padding: 10,
        borderRadius: 20,
        backgroundColor: "#15aaeb",
    },
    qbBtnText: {
        color: "white",
        fontSize: fontSize.md,

    },
  

})