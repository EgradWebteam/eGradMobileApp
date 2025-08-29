import { Text,View,Image,TouchableOpacity } from "react-native"
import QBStyles from "../styles/QBStyles";
import Icon from "react-native-vector-icons/Ionicons"; 

export const QBScreen=(props)=>{
    console.log(props,"these r props");
    return(
        <View contentContainerStyle={QBStyles.container}>
        <View style={QBStyles.qBankImgDiv}>
          <View style={QBStyles.imagePC}>
            <Image
              style={QBStyles.image}
              source={require("../assets/QBImages/onlineTeaching.png")}
            />
          </View>
          <Text style={QBStyles.headding}>
            Online Question Bank for UG Exams{" "}
          </Text>
          
        </View>

        <View style={QBStyles.subContainer}>
          <View style={QBStyles.examDiv}>
            < TouchableOpacity onPress={()=>navigation.navigate('QuestionBankPage',{id:1})}>
            <Text>
            JEE(Mains)</Text></TouchableOpacity>
            <Icon
              name="arrow-forward"
              size={20}
              color="white"
              style={QBStyles.icon}
            />
          </View>
          <View style={QBStyles.examDiv}>
            <TouchableOpacity
              style={QBStyles.examText}
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
              style={QBStyles.icon}
            />
          </View>
          <View style={QBStyles.examDiv}>
            <TouchableOpacity style={QBStyles.examText}>
            <Text>
              NEET
              </Text>
            </TouchableOpacity>
            <Icon
              name="arrow-forward"
              size={20}
              color="white"
              style={QBStyles.icon}
            />
          </View>
          <View style={QBStyles.examDiv}>
            <TouchableOpacity style={QBStyles.examText}>
            <Text>
              AP-EAPCET
              </Text>
            </TouchableOpacity>
            <Icon
              name="arrow-forward"
              size={20}
              color="white"
              style={QBStyles.icon}
            />
          </View>
          <View style={QBStyles.examDiv}>
            <TouchableOpacity style={QBStyles.examText}>
            <Text>
              TS-EAMCET
              </Text>
            </TouchableOpacity>
            <Icon
              name="arrow-forward"
              size={20}
              color="white"
              style={QBStyles.icon}
            />
          </View>
          <View style={QBStyles.examDiv}>
            <TouchableOpacity style={QBStyles.examText}>
            <Text>
              KCET
              </Text>
            </TouchableOpacity>
            <Icon
              name="arrow-forward"
              size={20}
              color="white"
              style={QBStyles.icon}
            />
          </View>
          <View style={QBStyles.examDiv}>
            <TouchableOpacity style={QBStyles.examText}>
            <Text>
              MHCET
              </Text>
            </TouchableOpacity>
            <Icon
              name="arrow-forward"
              size={20}
              color="white"
              style={QBStyles.icon}
            />
          </View>
          <View style={QBStyles.examDiv}>
            <TouchableOpacity style={QBStyles.examText}>
            <Text>
              WBJEE{" "}
              </Text>
            </TouchableOpacity>
            <Icon
              name="arrow-forward"
              size={20}
              color="white"
              style={QBStyles.icon}
            />
          </View>
        </View>
      </View>
    )







}