import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { backEndUrl, frontEndUrl,backEndPort } from "../apiConfig";
import { encryptBatch } from "../utils/CryptoUtils";
import { useSession } from "../hooks/SessionContext";
import { useNavigation } from "@react-navigation/native";
import CompletedPractice from "../assets/CompletedPractice.png";
import ReAttemptedPratice from "../assets/ReAttemptedPratice.png";
import PracticeImg from "../assets/PracticeImg.png";

const { width, height } = Dimensions.get("window");

const PracticeQuestionBank = ({ onBack, course_name, course, studentId ,userData,selectedPortalId,selectedExam}) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedTestType, setSelectedTestType] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [practiceData, setPracticeData] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [pendingTest, setPendingTest] = useState(null);
  const [Popup, setPopup] = useState(false);
  const { validateSession } = useSession();
const navigation = useNavigation();
const fetchPracticeData = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    if (!token) {
      console.warn("No token found in AsyncStorage");
      return;
    }

    const res = await fetch(
      `${backEndUrl}/studentmycourses/coursetestdetails/${course.course_id}/${studentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    const testDetails = data?.test_details || [];
    setPracticeData(testDetails);
    console.log("PQB testDetails:", testDetails);

    const subjectsSet = new Set();
    testDetails.forEach((group) => {
      group.tests
        ?.filter((test) => test.test_status === "1" || test.test_status === 1)
        .forEach((test) => {
          test.subject_names
            ?.split(",")
            .map((s) => s.trim())
            .forEach((s) => subjectsSet.add(s));
        });
    });

    setAllSubjects(
      Array.from(subjectsSet).map((s, idx) => ({ id: idx + 1, name: s }))
    );
  } catch (err) {
    console.error("Error fetching PQB data:", err);
    setPracticeData([]);
    setAllSubjects([]);
  }
};


  useEffect(() => {
    fetchPracticeData();
  }, [studentId, course.course_id]);

  const getStatusImage = (test) => {
    const { status_version, practice_attempt_count } = test;

    if (status_version == null || status_version === 0) {
      return PracticeImg;
    }
    if (
      status_version >= practice_attempt_count &&
      practice_attempt_count > 0
    ) {
      return CompletedPractice;
    }
    return ReAttemptedPratice;
  };

  const testTypeOrder = {
    "Chapter Wise": 1,
    "Topic Wise": 2,
    "Subject Wise": 3,
    "Part Test": 4,
    "Full Test": 5,
  };

  const groupedData = practiceData.reduce((acc, group) => {
    acc[group.type_of_test_name] = {
      id: group.type_of_test_id,
      tests: group.tests || [],
    };
    return acc;
  }, {});

  let filteredGroupedData = groupedData;
  if (selectedTestType) {
    filteredGroupedData = {
      [selectedTestType]: groupedData[selectedTestType] || { id: null, tests: [] },
    };
  } else if (selectedSubject) {
    filteredGroupedData = {};
    Object.keys(groupedData).forEach((type) => {
      const filteredTests = groupedData[type].tests.filter((test) =>
        test.subject_names.includes(selectedSubject)
      );
      if (filteredTests.length > 0)
        filteredGroupedData[type] = {
          id: groupedData[type].id,
          tests: filteredTests,
        };
    });
  }

  function getLocalTestDate(dateUTC, timeStr) {
    if (!timeStr) return null;
    const utcDate = new Date(dateUTC);
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);

    return new Date(
      utcDate.getFullYear(),
      utcDate.getMonth(),
      utcDate.getDate(),
      hours,
      minutes,
      seconds
    );
  }

  const backgroundColors = {
  1: "#ffe4e1", // chapterwise
  2: "#d9edf8", // topicwise
  3: "#f6e6c3", // subjectwise
  4: "#efebe4", // part test
  5: "#d6eadf", // full test
};

const getBackgroundClass = (id) => backgroundColors[id] || "#f0f0f0";

const handleStartPracticeWithSession = async (testId, studentId, courseId) => {
  console.log("dataaaa",testId,studentId,courseId);
  try {
    const navigationToken = await AsyncStorage.getItem("navigationToken");
    if (navigationToken === "valid") {
      setPopup(true);
      return;
    }

    const isActive = (await AsyncStorage.getItem("practiceTestActive")) === "true";
    if (isActive) {
      setShowPopup(true);
      setPendingTest({ testId, studentId, courseId });
      return;
    }

    const keys = await AsyncStorage.getAllKeys();
    const practiceKeys = keys.filter((key) => key.startsWith("practiceTest_"));
    if (practiceKeys.length > 0) {
      await AsyncStorage.multiRemove(practiceKeys);
    }

    handleStartPractice(testId, studentId, courseId);
  } catch (err) {
    console.error("Error in handleStartPracticeWithSession:", err);
  }
};

const handleStartPractice = async (testId, studentId, courseId) => {
  try {
    // await AsyncStorage.setItem("practiceTestActive", "true");
    // await AsyncStorage.setItem("practicenavigationToken", Date.now().toString());

    const encryptedArray = await encryptBatch([testId, studentId, courseId]);
    const encryptedTestId = encodeURIComponent(encryptedArray[0]);
    const encryptedStudentId = encodeURIComponent(encryptedArray[1]);
    const encryptedCourseId = encodeURIComponent(encryptedArray[2]);

    // 🔹 Navigate to PracticeInstruction screen with params
    navigation.navigate("PracticeInstruction", {
      testId: encryptedTestId,
      studentId: encryptedStudentId,
      courseId: encryptedCourseId,
    });
  } catch (err) {
    console.error("Encryption failed:", err);
    await AsyncStorage.removeItem("practiceTestActive");
    await AsyncStorage.removeItem("practicenavigationToken");
  }
};

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.courseName}>{course_name}</Text>
        <TouchableOpacity style={styles.goBackBtn} onPress={onBack}>
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>

      {/* Picker */}
      <Picker
        selectedValue={selectedOption}
        onValueChange={(value) => {
          setSelectedOption(value);
          if (value.startsWith("type-")) {
            setSelectedTestType(value.replace("type-", ""));
            setSelectedSubject("");
          } else if (value.startsWith("subject-")) {
            setSelectedSubject(value.replace("subject-", ""));
            setSelectedTestType("");
          } else {
            setSelectedTestType("");
            setSelectedSubject("");
          }
        }}
        style={styles.picker}
      >
        <Picker.Item label="Select Test Type / Subject" value="" />
        {practiceData
          .slice()
          .sort(
            (a, b) =>
              (testTypeOrder[a.type_of_test_name] || 99) -
              (testTypeOrder[b.type_of_test_name] || 99)
          )
          .map((group) => (
            <Picker.Item
              key={`type-${group.type_of_test_name}`}
              label={group.type_of_test_name}
              value={`type-${group.type_of_test_name}`}
            />
          ))}
        {allSubjects.map((subject) => (
          <Picker.Item
            key={`subject-${subject.name}`}
            label={subject.name}
            value={`subject-${subject.name}`}
          />
        ))}
      </Picker>

      {/* Test Cards */}
      <FlatList
        data={Object.keys(filteredGroupedData).sort(
          (a, b) => (testTypeOrder[a] || 99) - (testTypeOrder[b] || 99)
        )}
        keyExtractor={(item) => item}
        renderItem={({ item: type }) => {
          const { tests } = filteredGroupedData[type];
          // const validTests = tests.filter((test) => test.test_status === "1");
          // if (validTests.length === 0) return null;

          return (
            <View>
              <Text style={styles.sectionHeading}>{type}</Text>
              {tests.map((test) => {
                const now = new Date();
                const testStart = getLocalTestDate(
                  test.test_start_date,
                  test.test_start_time
                );
                const isCompleted =
                  test.status_version >= test.practice_attempt_count &&
                  test.practice_attempt_count > 0;

                return (
             <View
  key={test.test_id}
  style={[
    styles.testCard,
    { backgroundColor: getBackgroundClass(groupedData[type].id) },
  ]}
>
  <View style={styles.testRow}>
    <Image source={getStatusImage(test)} style={styles.testIcon} />
    <View>
      <Text style={styles.testName}>{test.test_name}</Text>
      <Text>Total Attempts: {test.practice_attempt_count}</Text>
      <Text>Subjects: {test.subject_names}</Text>
    </View>
  </View>

<View style={{ alignItems: 'center', marginTop: 10 }}>
  {(() => {
    const now = new Date();
    const testStart = getLocalTestDate(test.test_start_date, test.test_start_time);
    
    // ✅ Case A: test_status = 0
    if (test.test_status === "0") {
      return (
        <Text style={{ color: "#666", textAlign: "center" }}>
          Practice Test will be activated soon
        </Text>
      );
    }
    
    // Upcoming test → show activation message
    if (now < testStart) {
      const formattedDate = testStart.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      const formattedTime = testStart.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return (
        <Text style={{ color: "#666", textAlign: "center" }}>
          Practice Test will be activated on{" "}
          <Text style={{ fontWeight: "bold" }}>{formattedDate}</Text> at{" "}
          <Text style={{ fontFamily: "monospace" }}>{formattedTime}</Text>
        </Text>
      );
    }

    // Test is active → show button based on attempt status
    const isCompleted = test.status_version >= test.practice_attempt_count && 
                       test.practice_attempt_count > 0;
    
    return (
      <TouchableOpacity
        style={[
           styles.startBtn,
    isCompleted
      ? styles.completedBtn
      : test.status_version && test.status_version > 0
      ? styles.reAttemptBtn
      : null,
        ]}
        disabled={isCompleted}
        onPress={() =>
          !isCompleted &&
          handleStartPracticeWithSession(test.test_id, studentId, course.course_id)
        }
      >
        <Text style={styles.btnText}>
          {isCompleted
            ? "Completed"
            : !test.status_version || test.status_version === 0
            ? "Start Practice"
            : `Re-Attempt (${test.practice_attempt_count - test.status_version})`}
        </Text>
      </TouchableOpacity>
    );
  })()}
</View>
</View>
                );
              })}
            </View>
          );
        }}
        nestedScrollEnabled={true}   
  scrollEnabled={false}
      />

      {/* Popup 1 */}
      <Modal visible={showPopup} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.popupHeading}>Practice Test Already Open</Text>
            <Text style={styles.popupText}>
              You already have a practice test running. If you choose Yes, it will be closed.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setShowPopup(false)}>
                <Text style={styles.btnText}>Yes, Close Test</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setShowPopup(false)}>
                <Text style={styles.btnText}>No, Continue Test</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Popup 2 */}
      <Modal visible={Popup} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.popupHeading}>Active Test In Progress</Text>
            <Text style={styles.popupText}>You already have an active test. Please complete it first.</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={() => setPopup(false)}>
              <Text style={styles.btnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  courseName: { fontSize: 20, fontWeight: "bold" },
  goBackBtn: {  
    backgroundColor: "#028a0f",
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 8,
  alignSelf: "flex-end",  
  marginBottom: 16,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
  elevation: 3,
},
  goBackText: {
     color: "#fff",
  fontWeight: "600",
  fontSize: 14,
    },
  picker: { borderWidth: 1, borderColor: "#ccc", marginBottom: 12 },
  sectionHeading: { fontSize: 18, fontWeight: "bold", marginTop: 16 },
  testCard: {
  padding: 12,
  marginVertical: 8,
  borderRadius: 12,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.2,
  shadowRadius: 6,
  elevation: 5, // for Android shadow
},

  testRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  testIcon: { width: 40, height: 40, marginRight: 12 },
  testName: { fontSize: 16, fontWeight: "bold" },
  startBtn: { backgroundColor: "#06b6d4", padding: 10, borderRadius: 8, alignItems: "center" },
  completedBtn: { backgroundColor: "#2ecc71" },
reAttemptBtn: { backgroundColor: "#e67e22" },
  btnText: { color: "#fff", fontWeight: "bold" },
  testActivation: { color: "#d9534f", marginTop: 6 },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalBox: { width: width * 0.8, padding: 20, backgroundColor: "#fff", borderRadius: 12 },
  popupHeading: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  popupText: { marginBottom: 16 },
  modalActions: { flexDirection: "row", justifyContent: "space-between" },
  modalBtn: { flex: 1, padding: 12, backgroundColor: "#007BFF", marginHorizontal: 4, borderRadius: 8, alignItems: "center" },
});

export default PracticeQuestionBank;
