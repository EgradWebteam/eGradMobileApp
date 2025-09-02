import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker"; // or use react-native-dropdown-picker
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../../ConfigFile/ApiConfigURL";
import { encryptBatch } from "../../utils/CryptoUtils";
// import { useSession } from "./hooks/SessionContext";

import imageStarted from "../images/startTest.png";
import imageResumed from "../images/resomeTest.png";
import imageViewReport from "../images/viewReport.png";

const TestDetailsContainer = ({ course, studentId, data, userData, selectedPortalId }) => {
  const [groupedTests, setGroupedTests] = useState({});
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedTestType, setSelectedTestType] = useState("All Tests");
  const [allSubjects, setAllSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

//   const { validateSession } = useSession();
  const navigation = useNavigation();
  const token = sessionStorage.getItem("accessToken");
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
    if (!courseId || !studentId) return;
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/studentmycourses/coursetestdetails/${courseId}/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      processTestDetails(result);
    } catch (err) {
      console.error("Failed to fetch test details", err);
    } finally {
      setLoading(false);
    }
  }, [courseId, studentId, token, processTestDetails]);

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
  const filteredTests = selectedSubjectId
    ? allTests.filter(test => test.subject_ids?.split(",").map(id => id.trim()).includes(selectedSubjectId))
    : allTests;

  // Open test
  const handleStartTestClick = async (test) => {
    // const isValid = await validateSession();
    if (!isValid) return;

    if (sessionStorage.getItem("navigationToken")) {
      setShowPopup(true);
      return;
    }

    try {
    const [encryptedTestId, encryptedStudentId, encryptedCourseId] = await encryptBatch([
      test.test_id,
      studentId,
      courseId ?? test.course_id
    ]);

    // Navigate to Test Screen
    navigation.navigate("TestScreen", {
      testId: encryptedTestId,
      studentId: encryptedStudentId,
      courseId: encryptedCourseId
    });

    } catch (err) {
      console.error("Error starting test:", err);
    }
  };

  const handleViewReport = (test) => {
    navigation.navigate("StudentReport", {
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

  return (
    <ScrollView style={{ flex: 1, padding: 10 }}>
      {selectedPortalId === 1 && (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>{course?.course_name}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 10 }}>
            <Text style={{ color: "blue" }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Picker for test type / subject */}
      <Picker
        selectedValue={selectedTestType || selectedSubjectId}
        onValueChange={(value) => {
          if (value.startsWith("type-")) {
            setSelectedTestType(value.replace("type-", ""));
            setSelectedSubjectId("");
          } else if (value.startsWith("subject-")) {
            setSelectedSubjectId(value.replace("subject-", ""));
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

      {filteredTests.map(test => {
        const attemptStatus = test.test_attempt_status?.toLowerCase().trim();
        const statusIcon = attemptStatus === "completed" ? "completed" : attemptStatus === "started" || attemptStatus === "resumed" ? "resumed" : "started";

        return (
          <View key={test.test_id} style={{ borderWidth: 1, borderRadius: 8, marginVertical: 8, padding: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={images[statusIcon]} style={{ width: 50, height: 50, marginRight: 10 }} />
              <View>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>{test.test_name}</Text>
                <Text>Total Marks: {test.total_marks}</Text>
                <Text>Duration: {test.duration} Minutes</Text>
                <Text>Type: {test.type}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={{ marginTop: 10, padding: 10, backgroundColor: attemptStatus === "completed" ? "green" : "blue", borderRadius: 5 }}
              onPress={() => attemptStatus === "completed" ? handleViewReport(test) : handleStartTestClick(test)}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>
                {attemptStatus === "completed" ? "View Report" : attemptStatus === "started" || attemptStatus === "resumed" ? "Resume Test" : "Start Test"}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}

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
