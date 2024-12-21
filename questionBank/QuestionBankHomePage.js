import React from "react";
import { View,Text,ScrollView,TouchableOpacity,Image } from "react-native";
import downloadsStyles from "../styles/downloadsStyles";
// import { Link } from "expo-router";
import { Link } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons"; 
import { Button } from "react-native-web";
// import { useNavigation } from "expo-router";
import { useNavigation } from "@react-navigation/native";
export default QuestionBankHomePage = () => {
    const navigation=useNavigation();
    const navigateToQB=()=>{
        console.log("in funciton")
    }
  return (
    
    <ScrollView contentContainerStyle={downloadsStyles.container}>
        <View style={downloadsStyles.qBankImgDiv}>
          <View style={downloadsStyles.imagePC}>
            <Image
              style={downloadsStyles.image}
              source={require("../assets/QuestionBankImages/qbImage-removebg-preview.png")}
            />
          </View>
          <Text style={downloadsStyles.headding}>
            Online Question Bank for UG Exams{" "}
          </Text>
        </View>

        <View style={downloadsStyles.subContainer}>
          <View style={downloadsStyles.examDiv}>
            < TouchableOpacity onPress={()=>navigation.navigate('QuestionBankPage',{id:1})}>
            <Text>
            JEE(Mains)</Text></TouchableOpacity>
            <Icon
              name="arrow-forward"
              size={20}
              color="white"
              style={downloadsStyles.icon}
            />
          </View>
          <View style={downloadsStyles.examDiv}>
            <TouchableOpacity
              style={downloadsStyles.examText}
              onPress={() => navigateToQB(2)}
            >
              <Text>
              JEE (Advanced)
              </Text>
            </TouchableOpacity>
            <Icon
              name="arrow-forward"
              size={20}
              color="white"
              style={downloadsStyles.icon}
            />
          </View>
          <View style={downloadsStyles.examDiv}>
            <TouchableOpacity style={downloadsStyles.examText}>
            <Text>
              NEET
              </Text>
            </TouchableOpacity>
            <Icon
              name="arrow-forward"
              size={20}
              color="white"
              style={downloadsStyles.icon}
            />
          </View>
          <View style={downloadsStyles.examDiv}>
            <TouchableOpacity style={downloadsStyles.examText}>
            <Text>
              AP-EAPCET
              </Text>
            </TouchableOpacity>
            <Icon
              name="arrow-forward"
              size={20}
              color="white"
              style={downloadsStyles.icon}
            />
          </View>
          <View style={downloadsStyles.examDiv}>
            <TouchableOpacity style={downloadsStyles.examText}>
            <Text>
              TS-EAMCET
              </Text>
            </TouchableOpacity>
            <Icon
              name="arrow-forward"
              size={20}
              color="white"
              style={downloadsStyles.icon}
            />
          </View>
          <View style={downloadsStyles.examDiv}>
            <TouchableOpacity style={downloadsStyles.examText}>
            <Text>
              KCET
              </Text>
            </TouchableOpacity>
            <Icon
              name="arrow-forward"
              size={20}
              color="white"
              style={downloadsStyles.icon}
            />
          </View>
          <View style={downloadsStyles.examDiv}>
            <TouchableOpacity style={downloadsStyles.examText}>
            <Text>
              MHCET
              </Text>
            </TouchableOpacity>
            <Icon
              name="arrow-forward"
              size={20}
              color="white"
              style={downloadsStyles.icon}
            />
          </View>
          <View style={downloadsStyles.examDiv}>
            <TouchableOpacity style={downloadsStyles.examText}>
            <Text>
              WBJEE{" "}
              </Text>
            </TouchableOpacity>
            <Icon
              name="arrow-forward"
              size={20}
              color="white"
              style={downloadsStyles.icon}
            />
          </View>
        </View>
      </ScrollView>
  );
};
