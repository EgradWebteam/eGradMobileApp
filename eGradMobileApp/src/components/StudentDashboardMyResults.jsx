import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { BASE_URL } from "../../ConfigFile/ApiConfigURL";
import { backEndUrl, frontEndUrl } from "../apiConfig";
import { styles } from "../styles/StudentDashboardStyles";
// import { useSession } from "./hooks/SessionContext";
// import DisableKeysAndMouseInteractions from "../../ContextFolder/DisableKeysAndMouseInteractions";

const StudentDashboardMyResults = ({ studentId, userData }) => {
  const [testData, setTestData] = useState([]);
  const [selectedPortalId, setSelectedPortalId] = useState(null);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [loading, setLoading] = useState(true);
console.log("user dataaaa",userData);
  // DisableKeysAndMouseInteractions(null);

  const navigation = useNavigation();
  // const { validateSession } = useSession();

  // Fetch test data
  useEffect(() => {
    if (!studentId) return;

    const fetchResultTestData = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("accessToken");
        const response = await fetch(
          `${backEndUrl}/MyResults/FetchResultTestdata/${studentId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        if (data.success) {
          setTestData(data.data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching test result data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResultTestData();
  }, [studentId]);

  const portals = testData.map((portal) => ({
    course_portal_id: portal.course_portal_id,
    portal_name: portal.portal_name,
    exams: portal.exams,
  }));

  const currentPortal = portals.find((p) => p.course_portal_id === selectedPortalId);

  useEffect(() => {
    if (currentPortal && currentPortal.exams.length > 0) {
      setSelectedExamId(currentPortal.exams[0].exam_id);
    }
  }, [selectedPortalId, testData]);

  useEffect(() => {
    if (testData.length > 0) {
      const firstPortal = testData[0];
      setSelectedPortalId(firstPortal.course_portal_id);
      const firstExam = firstPortal.exams?.[0];
      if (firstExam) setSelectedExamId(firstExam.exam_id);
    }
  }, [testData]);

  const handleViewReportClick = async (testId, test, course_id) => {
    // const isValid = await validateSession();
    // if (!isValid) return;

    let course_portal_id = null;
    for (const portal of testData) {
      for (const exam of portal.exams || []) {
        for (const course of exam.courses || []) {
          if (course.course_id === course_id) {
            course_portal_id = portal.course_portal_id;
            break;
          }
        }
        if (course_portal_id) break;
      }
      if (course_portal_id) break;
    }

    if (!course_portal_id) {
      console.error("Course Portal ID not found for course_id:", course_id);
      return;
    }

    navigation.navigate("StudentReport", {
      testId,
      studentId,
      course_portal_id,
      test_name: test.test_name,
      course_id,
      total_marks: test.total_marks,
      duration: test.duration,
      userData,
    });
  };

  const getBackgroundColor = (id) => {
    switch (Number(id)) {
      case 1:
        return "#E0F7FA"; // ChapterWise
      case 2:
        return "#E8F5E9"; // TopicWise
      case 3:
        return "#FFF3E0"; // SubjectWise
      case 4:
        return "#F3E5F5"; // PartTest
      case 5:
        return "#FFEBEE"; // FullTest
      default:
        return "#fff";
    }
  };

  const getBorderColor = (id) => {
    switch (Number(id)) {
      case 1:
        return "#00BCD4";
      case 2:
        return "#4CAF50";
      case 3:
        return "#FF9800";
      case 4:
        return "#9C27B0";
      case 5:
        return "#F44336";
      default:
        return "#ddd";
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.containerMyresults}>
      <Text style={styles.heading}>My Results</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : testData.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>
            You haven't attempted any test yet!
          </Text>
        </View>
      ) : (
        <>
          {/* Portal buttons */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.portalButtonsScroll}>
            {portals.map((portal) => (
              <TouchableOpacity
                key={portal.course_portal_id}
                style={[
                  styles.portalButton,
                  selectedPortalId === portal.course_portal_id && styles.activeButton,
                ]}
                onPress={() => {
                  setSelectedPortalId(portal.course_portal_id);
                  setSelectedExamId(portal.exams[0]?.exam_id || null);
                }}
              >
                <Text style={[  
                              styles.portalButtontext,
                              selectedPortalId === portal.course_portal_id &&  styles.activeButtontext,
                                            ]}>{portal.portal_name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Exam buttons */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.examButtonsScroll}>
            {currentPortal?.exams.map((exam) => (
              <TouchableOpacity
                key={exam.exam_id}
                style={[
                  styles.examButton,
                  selectedExamId === exam.exam_id && styles.activeButton,
                ]}
                onPress={() => setSelectedExamId(exam.exam_id)}
              >
                <Text style={[
                                  styles.examButtontext,
                                 selectedExamId === exam.exam_id &&styles.activeButtontext,
                                ]}>{exam.exam_name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Courses and Tests */}
          <View style={styles.resultsContainer}>
            {currentPortal?.exams
              .find((exam) => exam.exam_id === selectedExamId)
              ?.courses.flatMap((course) =>
                course.tests?.map((test, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.resultCard,
                      { backgroundColor: getBackgroundColor(test.type_of_test_id), borderColor: getBorderColor(test.type_of_test_id) },
                    ]}
                  >
                    <Text   style={[
                      styles.testName,
                      { backgroundColor: getBackgroundColor(test.type_of_test_id), borderColor: getBorderColor(test.type_of_test_id) },
                    ]}>
                      {course.course_name} - {test.test_name}
                    </Text>
                    <View style={styles.resultRow}>
                      <Icon name="trending-up" size={18} color="#555" />
                      <Text style={styles.resultRowText}>Performance</Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Icon name="menu-book" size={18} color="#555" />
                      <Text style={styles.resultRowText}>Solutions</Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.viewReportButton, { backgroundColor: getBackgroundColor(test.type_of_test_id) }]}
                      onPress={() => handleViewReportClick(test.test_id, test, course.course_id)}
                    >
                      <Text style={styles.viewReportButtonText}>VIEW REPORT</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
          </View>
        </>
      )}
    </ScrollView>
  );
};


export default StudentDashboardMyResults;

