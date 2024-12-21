import { StyleSheet } from "react-native";
export default StyleSheet.create({
    container:{
        // backgroundColor:"red",
        width:"80%",
        margin:"auto",
        marginTop:"20px",
        display:1,
        flexWrap:"wrap",
        flexDirection:"row",
        gap:"2rem",
        padding:"2rem",
        boxShadow:" rgba(0, 0, 0, 0.35) 0px 5px 15px",
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:"white",
        flex:1,
        flexGrow: 1,
        


    },
    containerWithHeadding:{
        display:1,
        flexDirection:"column",
        
    },
    subContainer:{
        padding:"2rem",
        width:"100%",
        display:1,
        flexWrap:"wrap",
        flexDirection:"row",
        gap:"2rem",
        alignItems:"center",
        justifyContent:"start",

    },  
    examText:{
        color:"white",
        fontSize:"20px",
        fontSize: 20,
        flex: 1,  // Take available space to ensure text is centered
        textAlign: 'center', 
    },
    icon:{
        marginTop: "6px",
    },
    examDiv:{
        height:"auto",
        display:1,
        alignItems:"center",
        justifyContent:"center",
        boxShadow:" rgba(0, 0, 0, 0.1) 0px 4px 12px",
        width:"150px",
        backgroundColor:"rgba(42, 159, 227, 0.86)",
        color:"white",
        flexDirection:"row",
        gap: 10, 
        padding:10

    },
    qBankImgDiv:{
        display:1,
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"column-reverse",
    },
    headding:{
        fontSize:"20px",
        fontWeight:"700",

    },
    imagePC:{
        width:"200px",
        height:"200px"
    },
    image:{
        height:"100%",
        width:"100%",
    }
})