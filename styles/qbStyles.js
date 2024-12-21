import { StyleSheet } from "react-native";
export default StyleSheet.create({
  safeAreaViewInQB: {
    backgroundColor:"white",
    // display:1,
    flex:1,
    flexGrow:1,
  },
  btnContainer: {
    display: "flex",
    flexDirection: "row",
    border: "1px solid  #00000030",
    gap: 20,
    marginLeft: 17,
    marginTop: "1rem",
    flexWrap: "wrap",
    flexGrow:1,
  },
  subBtn: {
    padding: 20,
    border: "2px solid green",
    borderRadius: 8,
    flexWrap: "wrap",
  },
  questionOptionsContainer:{
    border:"1px solid  #00000030",
    display:"flex",
    flexDirection:"column",
    paddingLeft:"20px",
    
  },
  qImgContainer: {
    display: "flex",
    alignItems: "start",
    justifyContent: "center",
  },
  qImg: {
    maxWidth: "100%",
  },
  optionImgContainer: {
    maxWidth: "13%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    width: "auto",
    // border: 1px solid,
  },
  optionImg: {
    maxWidth: "100%",
    objectFit: "cover",
    // height: "100%",
  
  },
  optionIndexContainer: {
    display: "flex",
    flexDirection: "row",
    gap: "20px",
    marginBottom:"20px",
  },
  optionIndex: {
    padding: "20px",
    border: "2px solid  #00000030",
    borderRadius: "5px",
    cursor:"pointer",
  },
  natiInputDiv: {
    display: "flex",
    flexDirection: "row",
    gap:"20px",
    paddingLeft:"5px",
  },
  natiSubmit:{
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    border:"1px solid #00000030",
    borderRadius: "15px",
    backgroundColor:"green",
    color:"white",
  },
  natInput:{
    width: "40%",
    border: "1px solid gray",
    bordeRadius:"8px",
    padding:"10px",
  }
});
