import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  BackHandler,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from '../styles/OTSStyles.js';
import { Dimensions } from 'react-native';
import OTSHeader from "../components/OTSFolder/OTSHeader"; // Assume this is a RN component or replace with your header
import { Intstruction_content } from "../components/OTSFolder/Intstruction_content.js";
import adminCapImg from "../images/logoCap.jpeg"; // You may need to import these images differently in RN
import defaultImage from "../images/studentimage.png";
import { useStudent } from "../hooks/StudentContext";
// import { useSession } from "../../StudentDashboard/hooks/SessionContext";
import {encryptBatch,decryptBatch as decryptDataBatch,} from "../utils/CryptoUtils";

const GeneralInstructions = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { testId, studentId, courseId } = route.params || {};

//   const { validateSessionWithoutNavigation } = useSession();
  const { studentData } = useStudent();

  const [realTestId, setRealTestId] = useState("");
  const [realStudentId, setRealStudentId] = useState("");
  const [realCourseId, setRealCourseId] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const logoutHandledRef = useRef(false);

  const userData = studentData?.userDetails;
  const studentName = userData?.candidate_name;
  const studentProfile = userData?.uploaded_photo;

  const adminRole = AsyncStorage.getItem("adminRole"); // AsyncStorage returns Promise, will handle below
  const [isAdmin, setIsAdmin] = useState(false);
const backgroundImages = {
  AnswerdBtnCls: require('../images/Answered.png'),
  NotAnsweredBtnCls: require('../images/NotAnswered.png'),
  MarkedForReview: require('../images/MarkedForReview.png'),
  AnsMarkedForReview: require('../images/AnsMarkedForReview.png'),
  NotVisitedBehaviourBtns: require('../images/Visited.png'),
};
  // Load adminRole from AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem("adminRole").then((role) => {
      setIsAdmin(role === "admin");
    });
  }, []);
useEffect(() => {
  const onBackPress = async() => {
     const userId = await AsyncStorage.getItem('userId');
    Alert.alert(
      "Exit General Instructions",
      "Are you sure you want to exit the General Instructions?",
      [
        {
          text: "No",
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'studentDashboard', params: { userId } }],
            });
          }
        }
      ]
    );
    return true; // Block the default behavior
  };
  BackHandler.addEventListener("hardwareBackPress", onBackPress);
  return () => {
    BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  };
}, []);
  // Decrypt params on mount
  useEffect(() => {
    const decryptParams = async () => {
      try {
        const encryptedParams = [decodeURIComponent(testId)];
        if (studentId) {
          encryptedParams.push(decodeURIComponent(studentId));
          encryptedParams.push(decodeURIComponent(courseId));
        }

        const decryptedValues = await decryptDataBatch(encryptedParams);

        if (!decryptedValues || decryptedValues.length === 0) {
          navigation.navigate("Error");
          return;
        }

        setRealTestId(decryptedValues[0]);
        if (studentId) {
          setRealStudentId(decryptedValues[1]);
          setRealCourseId(decryptedValues[2]);
        }

        setIsDecrypting(false);
      } catch (error) {
        console.error("Batch decryption error:", error);
        navigation.navigate("Error");
      }
    };

    decryptParams();
  }, [testId, studentId, courseId, navigation]);

  const handleNextClick = async () => {
    // const isValid = await validateSessionWithoutNavigation();
    // if (isValid) {
      setIsSaving(true);
      try {
        // await AsyncStorage.setItem("navigationToken", "valid");

        const payload = studentId
          ? [realTestId, realStudentId, realCourseId]
          : [realTestId];
        const encryptedArray = await encryptBatch(payload);

        const encryptedTestId = encodeURIComponent(encryptedArray[0]);
        const encryptedCourseId = encodeURIComponent(encryptedArray[2]);

        if (studentId) {
          const encryptedStudentId = encodeURIComponent(encryptedArray[1]);
          navigation.navigate("ExamInstructions", {
            testId: encryptedTestId,
            studentId: encryptedStudentId,
            courseId: encryptedCourseId,
          });
        } else {
          navigation.navigate("ExamInstructions", {
            testId: encryptedTestId,
          });
        }
      } catch (error) {
        console.error("Encryption failed:", error);
        navigation.navigate("Error");
      } finally {
        setIsSaving(false);
      }
    // } else {
    //   Alert.alert("Session invalid", "Your session has expired", [
    //     { text: "OK", onPress: () => null },
    //   ]);
    // }
  };

  if (isDecrypting) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.containergi}>
      <OTSHeader />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.instructionContainer}>
          <Text style={styles.heading}>Instructions</Text>
          <Text style={styles.subHeading}>
            {Intstruction_content[0].Intstruction_content_text_center}
          </Text>

          <View style={styles.instructionSection}>
            <Text style={styles.subHeadingSecondary}>
              {Intstruction_content[0].Intstruction_content_text_subheading_1}
            </Text>

            <View style={styles.listItem}>
              <Text style={styles.listItemText}>
                Please note: If you open any other window, switch tabs, or
                minimize this window during the exam, it will be automatically
                terminated. Be careful while taking the exam!
              </Text>
            </View>

            <View style={styles.listItem}>
              <Text style={styles.listItemText}>
                {Intstruction_content[0].Intstruction_content_points_1}
              </Text>
            </View>

            <View style={styles.listItem}>
              <Text style={styles.listItemText}>
                {Intstruction_content[0].Intstruction_content_points_2}
              </Text>
            </View>

            <View style={styles.listItem}>
              <Text style={styles.listItemText}>
                {Intstruction_content[0].Intstruction_content_points_3}
              </Text>
            </View>

            {/* The "table of buttons" */}
            <View style={styles.tableOfButtons}>
              {[
                 {
                   number: 1,
                   text: Intstruction_content[0].Intstruction_content_points_p1,
                   image: backgroundImages.NotVisitedBehaviourBtns,
                   textStyle: styles.questionBtnText,
                 },
                 {
                   number: 3,
                   text: Intstruction_content[0].Intstruction_content_points_p2,
                   image: backgroundImages.NotAnsweredBtnCls,
                   textStyle: [styles.questionBtnText, styles.whiteText],
                 },
                 {
                   number: 5,
                   text: Intstruction_content[0].Intstruction_content_points_p3,
                   image: backgroundImages.AnswerdBtnCls,
                   textStyle: [styles.questionBtnText, styles.whiteText],
                 },
                 {
                   number: 7,
                   text: Intstruction_content[0].Intstruction_content_points_p4,
                   image: backgroundImages.MarkedForReview,
                   textStyle: [styles.questionBtnText, styles.whiteText],
                 },
                 {
                   number: 9,
                   text: Intstruction_content[0].Intstruction_content_points_p5,
                   image: backgroundImages.AnsMarkedForReview,
                   textStyle: [styles.questionBtnText, styles.whiteText],
                 },
               ].map((item, index) => (
                 <View key={index} style={styles.row}>
                   <ImageBackground
                     source={item.image}
                     style={{ width: 45, height: 45, justifyContent: 'center', alignItems: 'center' }}
                     imageStyle={{ resizeMode: 'contain' }}
                   >
                     <Text style={item.textStyle}>{item.number}</Text>
                   </ImageBackground>
                   <Text style={styles.statusText}>{item.text}</Text>
                 </View>
               ))}
             
            </View>

            <View style={styles.listItem}>
              <Text style={styles.listItemText}>
                {Intstruction_content[0].Intstruction_content_points_p}
              </Text>
            </View>

            {/* Repeat similarly for other instruction sections */}

            <Text style={styles.subHeadingSecondary}>
              {Intstruction_content[0].Intstruction_content_text_subheading_2}
            </Text>
            <View style={styles.listItem}>
              <Text>{Intstruction_content[0].Intstruction_content_points_4}</Text>
              <View style={{ paddingLeft: 15 }}>
                <Text>- {Intstruction_content[0].Intstruction_content_points_4_a}</Text>
                <Text>- {Intstruction_content[0].Intstruction_content_points_4_b}</Text>
                <Text>- {Intstruction_content[0].Intstruction_content_points_4_c}</Text>
              </View>
            </View>
            <View style={styles.listItem}>
              <Text>
                {Intstruction_content[0].Intstruction_content_points_5}{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {Intstruction_content[0].span_1}
                </Text>{" "}
                {Intstruction_content[0].Intstruction_content_points_5__}
              </Text>
            </View>

            {/* Add other instruction points similarly */}

            <Text style={styles.subHeadingSecondary}>
              {Intstruction_content[0].Intstruction_content_text_subheading_3}
            </Text>
            <View style={styles.listItem}>
              <Text>{Intstruction_content[0].Intstruction_content_points_6}</Text>
              <View style={{ paddingLeft: 15 }}>
                <Text>- {Intstruction_content[0].Intstruction_content_points_6_a}</Text>
                <Text>- {Intstruction_content[0].Intstruction_content_points_6_b}</Text>
                <Text>
                  - {Intstruction_content[0].Intstruction_content_points_6_c}{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {Intstruction_content[0].span_2}
                  </Text>
                </Text>
                <Text>
                  - {Intstruction_content[0].Intstruction_content_points_6_d}{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {Intstruction_content[0].span_3}
                  </Text>{" "}
                  {Intstruction_content[0].Intstruction_content_points_6_d__}
                </Text>
                <Text>- {Intstruction_content[0].Intstruction_content_points_6_e}</Text>
              </View>
            </View>

            <View style={styles.listItem}>
              <Text>
                {Intstruction_content[0].Intstruction_content_points_7}{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {Intstruction_content[0].span_4}
                </Text>{" "}
                {Intstruction_content[0].Intstruction_content_points_7__}
              </Text>
            </View>

            <View style={styles.listItem}>
              <Text>{Intstruction_content[0].Intstruction_content_points_8}</Text>
            </View>

            <Text style={styles.subHeadingSecondary}>
              {Intstruction_content[0].Intstruction_content_text_subheading_4}
            </Text>
            <View style={styles.listItem}>
              <Text>{Intstruction_content[0].Intstruction_content_points_9}</Text>
              <Text>{Intstruction_content[0].Intstruction_content_points_10}</Text>
              <Text>{Intstruction_content[0].Intstruction_content_points_11}</Text>
              <Text>{Intstruction_content[0].Intstruction_content_points_12}</Text>
            </View>
          </View>
        </View>

        {/* <View style={styles.userImageDivInst}>
          <View style={styles.userDetailsHolder}>
            <View style={styles.userImageSubDiv}>
              <Image
                source={
                  isAdmin
                    ? adminCapImg
                    : studentProfile
                    ? { uri: studentProfile }
                    : defaultImage
                }
                style={styles.userImage}
                onError={() => {
                  // Fallback handled by RN's default source prop or replace image URI
                }}
              />
            </View>
            <View style={styles.StdNameForData}>
              <Text>{isAdmin ? "Admin" : studentName}</Text>
            </View>
          </View>
        </View> */}

    
      </ScrollView>
          <View style={styles.footerContainergi}>
          <TouchableOpacity
            onPress={handleNextClick}
            disabled={isSaving}
            style={[
              styles.nextBtn,
              { backgroundColor: isSaving ? "#ccc" : "rgb(64 173 242)" },
            ]}
          >
            <Text style={styles.nextBtnText}>
              Next <Text style={styles.nextBtnArrow}>&rarr;</Text>
            </Text>
          </TouchableOpacity>
        </View>
    </View>
  );
};



export default GeneralInstructions;
