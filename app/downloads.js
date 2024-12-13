import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, ScrollView, Text, TouchableOpacity } from "react-native";
import downloadsStyles from "./components/styles/downloadsStyles";
import Icon from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Link } from 'expo-router';


const Downloads = () => {
    const router=useRouter();
    const navigateToQB=(id)=>{
        console.log(id)
        console.log("In navigate to qb page");
        router.push(`/questionBank/${id}`);
    }

  return (

    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={downloadsStyles.container}>
        <View style={downloadsStyles.qBankImgDiv}>
          <View style={downloadsStyles.imagePC}>
            <Image
              style={downloadsStyles.image}
              source={require("./components/assets/QuestionBankImages/qbImage-removebg-preview.png")}
            />
          </View>
          <Text style={downloadsStyles.headding}>
            Online Question Bank for UG Exams{" "}
          </Text>
        </View>

        <View style={downloadsStyles.subContainer}>
          <View style={downloadsStyles.examDiv}>
            <TouchableOpacity style={downloadsStyles.examText} onPress={()=>navigateToQB(1)}>JEE(Mains)</TouchableOpacity>
            <Link href="/questionBank/1">View first user details</Link>
            <Icon
              name="arrow-forward"
              size={20}
              color="white"
              style={downloadsStyles.icon}
            />
          </View>
          <View style={downloadsStyles.examDiv}>
            <TouchableOpacity style={downloadsStyles.examText} onPress={()=>navigateToQB(2)}>JEE (Advanced)</TouchableOpacity>
            <Icon
              name="arrow-forward"
              size={20}
              color="white"
              style={downloadsStyles.icon}
            />
          </View>
          <View style={downloadsStyles.examDiv}>
            <TouchableOpacity style={downloadsStyles.examText} >NEET</TouchableOpacity>
            <Icon
              name="arrow-forward"
              size={20}
              color="white"
              style={downloadsStyles.icon}
            />
          </View>
          <View style={downloadsStyles.examDiv}>
            <TouchableOpacity style={downloadsStyles.examText}>AP-EAPCET</TouchableOpacity>
            <Icon
              name="arrow-forward"
              size={20}
              color="white"
              style={downloadsStyles.icon}
            />
          </View>
          <View style={downloadsStyles.examDiv}>
            <TouchableOpacity style={downloadsStyles.examText}>TS-EAMCET</TouchableOpacity>
            <Icon
              name="arrow-forward"
              size={20}
              color="white"
              style={downloadsStyles.icon}
            />
          </View>
          <View style={downloadsStyles.examDiv}>
            <TouchableOpacity style={downloadsStyles.examText}>KCET</TouchableOpacity>
            <Icon
              name="arrow-forward"
              size={20}
              color="white"
              style={downloadsStyles.icon}
            />
          </View>
          <View style={downloadsStyles.examDiv}>
            <TouchableOpacity style={downloadsStyles.examText}>MHCET</TouchableOpacity>
            <Icon
              name="arrow-forward"
              size={20}
              color="white"
              style={downloadsStyles.icon}
            />
          </View>
          <View style={downloadsStyles.examDiv}>
            <TouchableOpacity style={downloadsStyles.examText}>WBJEE </TouchableOpacity>
            <Icon
              name="arrow-forward"
              size={20}
              color="white"
              style={downloadsStyles.icon}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Downloads;
