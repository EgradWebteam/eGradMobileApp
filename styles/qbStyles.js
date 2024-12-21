import { StyleSheet } from "react-native";
import { screenWidth } from "../screenUtils/ScreenUtils";

export default StyleSheet.create({
  scrollViewContainer:{
    flexGrow: 1, 
    paddingBottom: 20,
  },
  safeAreaViewInQB: {
    backgroundColor: "white",
    display:1,
    flex: 1,
    flexGrow: 1,
  },
  btnContainer: {
    display: "flex",
    flexDirection: "row",
    // border: "1px solid  #00000030",
    borderWidth: 1,
    gap: 20,
    marginLeft: 17,
    marginTop: "1rem",
    flexWrap: "wrap",
    flexGrow: 1,
  },
  subBtn: {
    padding: 20,
    // border: "2px solid green",
    borderWidth: 1,
    borderRadius: 8,
    flexWrap: "wrap",
  },
  questionOptionsContainer: {
    // border: "1px solid  #00000030",
    borderWidth: 1,
    display: "flex",
    flexDirection: "column",
    paddingLeft: 20,
    flex:1,

  },
  qImgContainer: {
    // display: "flex",
    flex:1,
    alignItems: "start",
    justifyContent: "start",
    height: 200,
    // width: 200,
    resizeMode: "contain",

    // maxWidth:screenWidth*0.5,
  },
  qImg: {
    // maxWidth:screenWidth*0.5,
    // height:200,
    // width:200
    height: 200,
    width: "100%",
    resizeMode: "contain",
  },
  // Image:{
  //   height: 200,
  //   width: "100%",
  //   resizeMode: "contain",
  // },
  optionImgContainer: {
    // maxWidth: "13%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "auto",
    // height: 200,
    width: 200,
    resizeMode: "contain",

  },
  optionImg: {
    // maxWidth: "100%",
    resizeMode: "contain",
    height: "100%",
    width: "100%",
  },
  optionIndexContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    marginBottom: 20,
  },
  optionIndex: {
    padding: 20,
    // border: "2px solid  #00000030",
    borderWidth: 1,

    borderRadius: 5,
    cursor: "pointer",
  },
  natiInputDiv: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    paddingLeft: 5,
  },
  natiSubmit: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    // border: "1px solid #00000030",
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: "green",
    color: "white",
  },
  natInput: {
    width: "40%",
    // border: "1px solid gray",
    borderWidth: 1,
    bordeRadius: 8,
    padding: 10,
  },
});
