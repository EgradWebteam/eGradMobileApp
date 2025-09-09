import React, { useEffect, useRef, useState } from "react";
import { View, Text, Button, StyleSheet, Alert, BackHandler, AppState } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
 import { backEndUrl, frontEndUrl,backEndPort } from "../apiConfig.js";
import { decryptBatch }from "../utils/CryptoUtils.jsx";
import { styles } from '../styles/OTSStyles';
import OTSHeader from "../components/OTSFolder/OTSHeader";
import OTSNavbar from "../components/OTSFolder/OTSNavbar";
import OTSMain from "../components/OTSFolder/OTSMain";
import TimerProvider from "../hooks/TimerContext";

const TestScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();


  const { testId, studentId, courseId } = route.params;

  const realTestId = useRef("");
  const realStudentId = useRef("");
  const realCourseId = useRef("");

  const [testPaperData, setTestPaperData] = useState([]);
  const [normalTestData, setNormalTestData] = useState(null);
  const [fullTestData, setFullTestData] = useState(null);
  const [hasBonus, setHasBonus] = useState(false);
  const [showCustomPopup, setShowCustomPopup] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [warningMessage, setWarningMessage] = useState(false);
  const [violationCount, setViolationCount] = useState(0);

  const appState = useRef(AppState.currentState);
  const summaryData = useRef({});
useEffect(() => {
  const fetchTestData = async () => {
    setIsLoading(true);
    try {
      const [decryptedTestId, decryptedStudentId, decryptedCourseId] = await decryptBatch([
        decodeURIComponent(testId),
        decodeURIComponent(studentId),
        decodeURIComponent(courseId),
      ]);

      realTestId.current = decryptedTestId;
      realStudentId.current = decryptedStudentId;
      realCourseId.current = decryptedCourseId;

      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Access token not found');
      }

      // Fetch test paper without bonus
      const response = await axios.get(
        `${backEndUrl}/OTSTestPaper/QuestionPaper_WithoutExtra/${decryptedTestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`Test paper fetch failed with status ${response.status}`);
      }

      const data = response.data;
      setTestPaperData(data);
      setNormalTestData(data);

      // Bonus check
      const bonusRes = await axios.get(`${backEndUrl}/OTSTestPaper/CheckingTestHasBonus/${decryptedTestId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (bonusRes.status !== 200) {
        throw new Error(`Bonus check failed with status ${bonusRes.status}`);
      }

      const bonusData = bonusRes.data;
      setHasBonus(!!bonusData.has_bonus);

    } catch (error) {
      console.error('Error fetching test data:', error);
      Alert.alert('Error', 'Failed to load test data.');
      // assumes you're using react-navigation
    } finally {
      setIsLoading(false);
    }
  };

  fetchTestData();
}, []);

  // App State (background/foreground)
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.current.match(/active/) && nextAppState === "background") {
        setWarningMessage(true);
        setViolationCount((count) => count + 1);
        setTimeout(() => setWarningMessage(false), 10000);
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => subscription.remove();
  }, []);

  // Back button handling
  // useEffect(() => {
  //   const onBackPress = () => {
  //     Alert.alert("Warning", "Going back is not allowed during the test.");
  //     return true;
  //   };
  //   BackHandler.addEventListener("hardwareBackPress", onBackPress);
  //   return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  // }, []);

  if (isLoading) {
    return (
      <SkeletonPlaceholder>
        <View style={{ margin: 20 }}>
          <SkeletonPlaceholder.Item height={30} width={200} borderRadius={4} />
          <SkeletonPlaceholder.Item height={20} width={300} borderRadius={4} marginTop={10} />
          <SkeletonPlaceholder.Item height={100} width={"100%"} borderRadius={4} marginTop={10} />
        </View>
      </SkeletonPlaceholder>
    );
  }

  return (
    <View style={styles.container}>
      <OTSHeader />
      <OTSNavbar
        realTestId={realTestId.current}
        realCourseId={realCourseId.current}
        testName={testPaperData.TestName}
        testData={testPaperData}
      />
      <TimerProvider testData={testPaperData}>
        <OTSMain
          testData={testPaperData}
            realStudentId={realStudentId.current}
            realCourseId={realCourseId.current}
            realTestId={realTestId.current}
            warningMessage={warningMessage}
            summaryData={summaryData}
            sectionType={testPaperData.sectionType}
            userAnswers={userAnswers}
            setUserAnswers={setUserAnswers}
            hasBonus={hasBonus}
            setTestPaperData={setTestPaperData}
            normalTestData={normalTestData}
            setNormalTestData={setNormalTestData}
            fullTestData={fullTestData}
            setFullTestData={setFullTestData}
        />
      </TimerProvider>

      {showCustomPopup && (
        <View style={styles.popup}>
          <Text style={styles.warningTitle}>Warning!</Text>
          <Text style={styles.warningText}>
            Function keys or restricted actions are not allowed during the test.
          </Text>
          <Button title="OK" onPress={() => setShowCustomPopup(false)} />
        </View>
      )}

      {warningMessage && (
        <View style={styles.overlayWarning}>
          <Text style={styles.warningText}>Please do not switch apps or minimize the test.</Text>
        </View>
      )}
    </View>
  );
};

export default TestScreen;


