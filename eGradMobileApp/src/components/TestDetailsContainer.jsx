import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity,StyleSheet, Image, ActivityIndicator, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker"; // or use react-native-dropdown-picker
import { useNavigation } from "@react-navigation/native";
 import { backEndUrl, frontEndUrl,backEndPort } from "../apiConfig";
import { encryptBatch } from "../utils/CryptoUtils";
import axios from 'axios';
// import { useSession } from "./hooks/SessionContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import imageStarted from "../images/startTest.png";
import imageResumed from "../images/resomeTest.png";
import imageViewReport from "../images/viewReport.png";
import {styles} from "../styles/StudentDashboardStyles"

const TestDetailsContainer = ({course, testDataLoading, refreshTriggerBundle, setRefreshTriggerBundle, onBack, studentId, data, userData, selectedPortalId  }) => {
  const [groupedTests, setGroupedTests] = useState({});
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedTestType, setSelectedTestType] = useState("All Tests");
  const [allSubjects, setAllSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
 const [refreshTrigger, setRefreshTrigger] = useState(false);
//   const { validateSession } = useSession();
  const navigation = useNavigation();

  const courseId = course?.course_id;
  const images = {
    started: imageStarted,
    resumed: imageResumed,
    completed: imageViewReport,
    default: imageStarted
  };

  // Utility: process test data
  const processTestDetails = useCallback((data) => {
    const grouped = {};
    const subjectsSet = new Map();

    data?.test_details?.forEach(group => {
      const testType = group.type_of_test_name;
      grouped[testType] = { tests: group.tests, typeId: group.type_of_test_id };
      group.tests.forEach(test => {
        if (test.subject_ids && test.subject_names) {
          const ids = test.subject_ids.split(",");
          const names = test.subject_names.split(",");
          ids.forEach((id, idx) => {
            const trimmedId = id.trim();
            const name = names[idx]?.trim() || "Unnamed Subject";
            if (!subjectsSet.has(trimmedId)) subjectsSet.set(trimmedId, name);
          });
        }
      });
    });

    setGroupedTests(grouped);
    setAllSubjects(Array.from(subjectsSet.entries()).map(([id, name]) => ({ id, name })));
  }, []);

  // Fetch tests from API

const fetchCourseTests = useCallback(async () => {
  const token = await AsyncStorage.getItem("accessToken");
  if (!courseId || !studentId || !token) return;

  try {
    setLoading(true);
    const res = await axios.get(`${backEndUrl}/studentmycourses/coursetestdetails/${courseId}/${studentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = res.data;
    processTestDetails(result);
  } catch (err) {
    console.error("Failed to fetch test details", err);
  } finally {
    setLoading(false);
  }
}, [courseId, studentId, processTestDetails,refreshTrigger]);


  useEffect(() => {
    if (data) processTestDetails(data);
    fetchCourseTests();
  }, [data, fetchCourseTests, processTestDetails]);

  const filterTestsBySubject = (tests) => {
    if (!selectedSubjectId) return tests;
    return tests.filter(test =>
      test.subject_ids?.split(",").map(id => id.trim()).includes(selectedSubjectId)
    );
  };

  const flattenGroupedTests = (groupedTests) => {
    return Object.entries(groupedTests).flatMap(([type, { tests, typeId }]) =>
      tests.map(test => ({ ...test, type, typeId }))
    );
  };

  const allTests = flattenGroupedTests(groupedTests);
const filteredTests = allTests.filter(test => {
  const matchesSubject = selectedSubjectId
    ? test.subject_ids?.split(",").map(id => id.trim()).includes(selectedSubjectId)
    : true;

  const matchesTestType = selectedTestType && selectedTestType !== "All Tests"
    ? test.type === selectedTestType
    : true;

  return matchesSubject && matchesTestType;
});
 const formattedTime = getCurrentLocalMySQLTime();
  function getCurrentLocalMySQLTime() {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localTime = new Date(now - offset).toISOString().slice(0, 19).replace('T', ' ');
    return localTime;
  }
  // Open test
const handleStartTestClick = async (test) => {
      console.log("handleStartTestClick CALLED with test:", test);
  const testCreationTableId = test.test_id;

  const courseCreationId = courseId ?? test.course_id;

  try {
    // const navigationToken = await AsyncStorage.getItem('navigationToken');
    // if (navigationToken) {
    //   Alert.alert(
    //     "Active Test",
    //     "You already have an active test in progress. Please complete it before starting another one."
    //   );
    //   return;
    // }

    const [encryptedTestId, encryptedStudentId, encryptedCourseId] = await encryptBatch([
      testCreationTableId,
      studentId,
      courseCreationId
    ]);

    const testStatusData = {
      studentregistrationId: studentId,
      courseCreationId,
      testCreationTableId,
      studentTestStartTime: formattedTime,
      testAttemptStatus: 'started',
      testConnectionStatus: 'active',
      testConnectionTime: formattedTime
    };

    console.log("Sending test status data:", testStatusData);

    const response = await axios.post(
      `${backEndUrl}/studentmycourses/InsertOrUpdateTestAttemptStatus`,
      testStatusData,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    console.log("API response status:", response.status);

    if (response.status === 200) {
      setRefreshTrigger(prev => !prev);
      if (setRefreshTriggerBundle) setRefreshTriggerBundle(prev => !prev);
      const convertToHHMMSS = (minutes) => {
        const totalSeconds = Math.floor(minutes * 60);
        const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const secs = String(totalSeconds % 60).padStart(2, '0');
        return `${hrs}:${mins}:${secs}`;
      };

      const durationHHMMSS = convertToHHMMSS(test.duration || 0);
      const timeSpent = test.time_spent ?? "00:00:00";

      console.log("durationHHMMSS:", durationHHMMSS);
      console.log("timeSpent:", timeSpent);

      const isTestCompleted = durationHHMMSS === timeSpent;

      if (isTestCompleted) {
        console.log("Navigating to TestResultScreen");
        navigation.navigate('TestScreen', {
          testId: encryptedTestId,
          studentId: encryptedStudentId,
          courseId: encryptedCourseId
        });
      } else {
        console.log("Navigating to GeneralInstructions");
        navigation.navigate('GeneralInstructions', {
          testId: encryptedTestId,
          studentId: encryptedStudentId,
          courseId: encryptedCourseId
        });
      }

    } else {
      Alert.alert("Error", "Failed to update test status");
    }
  } catch (error) {
    console.error("Error starting test:", error);
    Alert.alert("Error", "An error occurred while starting the test");
  }
};


  const handleViewReport = (test) => {
    navigation.navigate("StudentReport", {
      testId: test.test_id,
      studentId,
      test_name: test.test_name,
      course_portal_id: selectedPortalId,
      course_id: courseId ?? test.course_id,
      total_marks: test.total_marks,
      duration: test.duration,
      userData
    });
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1 }} />;
const backgroundColors = {
  1: "#ffe4e1",//chapterwise
  2: "#d9edf8",//topicwise
  3: "#f6e6c3",//subjectwise
  4: "#efebe4",//part test
  5: "#d6eadf",//full test
};

const getBackgroundClass = (id) => backgroundColors[id] || "#d6eadf";



const groupedFilteredTests = filteredTests.reduce((acc, test) => {
  const type = test.type || "Unknown Type";
  if (!acc[type]) {
    acc[type] = [];
  }
  acc[type].push(test);
  return acc;
}, {});
const selectedSubjectName = selectedSubjectId
  ? allSubjects.find(sub => sub.id === selectedSubjectId)?.name
  : null;

  return (
    <ScrollView style={{ flex: 1, padding: 10 }}>
      {selectedPortalId === 1 && (
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.TestDetailsCourseName}>{course?.course_name}</Text>
            <View style={styles.TestDetailsGoBack}>
          <TouchableOpacity onPress={() => onBack()} style={styles.back}>
            <Text style={{ color: "#fff" }}>Go Back</Text>
          </TouchableOpacity></View>
        </View>
      )}

      {/* Picker for test type / subject */}
<Picker
style={{}}
  selectedValue={selectedTestType || selectedSubjectId}
  onValueChange={(itemValue, itemIndex) => {
    if (itemValue.startsWith("type-")) {
      setSelectedTestType(itemValue.replace("type-", ""));
      setSelectedSubjectId("");
    } else if (itemValue.startsWith("subject-")) {
      setSelectedSubjectId(itemValue.replace("subject-", ""));
      setSelectedTestType("");
    }
  }}
>

        <Picker.Item label="Select Test Type / Subject" value="type-All Tests" />
        {Object.keys(groupedTests).map(type => (
          <Picker.Item key={type} label={type} value={`type-${type}`} />
        ))}
        {allSubjects.map(sub => (
          <Picker.Item key={sub.id} label={sub.name} value={`subject-${sub.id}`} />
        ))}
      </Picker>

      {/* Test Cards */}
      {filteredTests.length === 0 && (
        <Text style={{ marginTop: 20 }}>No tests available at the moment. Please check back later.</Text>
      )}
{selectedSubjectName && (
  <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10 }}>
     {selectedSubjectName}
  </Text>
)}
    {Object.entries(groupedFilteredTests).map(([typeName, tests]) => (

<View key={typeName}>
   
    <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 10 }}>{typeName}</Text>

    {/* Test Cards */}
    {tests.map(test => {
        const attemptStatus = test.test_attempt_status?.toLowerCase().trim();
        const statusIcon = attemptStatus === "completed" ? "completed" : attemptStatus === "started" || attemptStatus === "resumed" ? "resumed" : "started";

        return (
          <View key={test.test_id} style={{ borderRadius: 8, marginVertical: 8, padding: 10 ,
    backgroundColor: getBackgroundClass(test.typeId),shadowColor: "#000",
  shadowOffset: { width: 0, height: 3 },  // y-offset 3px
  shadowOpacity: 0.24,
  shadowRadius: 8,
  // Elevation for Android
  elevation: 5,}}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={images[statusIcon]} style={{ width: 50, height: 50, marginRight: 10 }} />
              <View>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>{test.test_name}</Text>
                <Text>Total Marks: {test.total_marks}</Text>
                <Text>Duration: {test.duration} Minutes</Text>
                <Text>Type: {test.type}</Text>
              </View>
            </View>

         {test.test_status !== "0" && (
  <TouchableOpacity
    style={{
      marginTop: 10,
      padding: 10,
      width:"10px",
      backgroundColor: attemptStatus === "completed" ? "#2ecc71" :attemptStatus === "started" || attemptStatus === "resumed"?"#e67e22": "#06b6d4",
      borderRadius: 5,
    }}
    onPress={() =>
      attemptStatus === "completed"
        ? handleViewReport(test)
        : handleStartTestClick(test)
    }
  >
    <Text style={{ color: "#fff", textAlign: "center" }}>
      {attemptStatus === "completed"
        ? "View Report"
        : attemptStatus === "started" || attemptStatus === "resumed"
        ? "Resume Test"
        : "Start Test"}
    </Text>
  </TouchableOpacity>
)}

          </View>
        );
       })}
  </View>
))}

      {showPopup && (
        <View style={{ position: "absolute", top: "30%", left: "10%", right: "10%", backgroundColor: "#fff", padding: 20, borderRadius: 8, elevation: 5 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Active Test In Progress</Text>
          <Text>You already have an active test. Please complete it before starting a new one.</Text>
          <TouchableOpacity onPress={() => setShowPopup(false)} style={{ marginTop: 10, padding: 10, backgroundColor: "red", borderRadius: 5 }}>
            <Text style={{ color: "#fff", textAlign: "center" }}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default TestDetailsContainer;
