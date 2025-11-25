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
import { useSession } from "../hooks/SessionContext";
// import DisableKeysAndMouseInteractions from "../../ContextFolder/DisableKeysAndMouseInteractions";

const StudentDashboardMyResults = ({ studentId, userData }) => {
  const [testData, setTestData] = useState([]);
  const [selectedPortalId, setSelectedPortalId] = useState(null);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log("user dataaaa", userData);
  // DisableKeysAndMouseInteractions(null);

  const navigation = useNavigation();
  const { validateSession } = useSession();

  /* ---------------------- FETCH TEST RESULTS ---------------------- */
  useEffect(() => {
    if (!studentId) return;

    const fetchResultTestData = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("accessToken");

        const res = await fetch(
          `${backEndUrl}/MyResults/FetchResultTestdata/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        if (data.success) {
          setTestData(data.data);
        }
      } catch (err) {
        console.error("Error fetching test result data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResultTestData();
  }, [studentId]);

  /* ---------------------- PORTALS & EXAMS ---------------------- */
  const portals = testData.map((portal) => ({
    course_portal_id: portal.course_portal_id,
    portal_name: portal.portal_name,
    exams: portal.exams,
  }));

  const currentPortal = portals.find(
    (p) => p.course_portal_id === selectedPortalId
  );

  useEffect(() => {
    if (testData.length > 0) {
      const first = testData[0];
      setSelectedPortalId(first.course_portal_id);

      const firstExam = first.exams?.[0];
      if (firstExam) setSelectedExamId(firstExam.exam_id);
    }
  }, [testData]);

  useEffect(() => {
    if (currentPortal?.exams?.length > 0) {
      setSelectedExamId(currentPortal.exams[0].exam_id);
    }
  }, [selectedPortalId]);

  /* ---------------------- NAVIGATION ---------------------- */
  const handleViewReportClick = async (testId, test, course_id) => {
    const isValid = await validateSession();
    if (!isValid) return;

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

  /* ---------------------- RENDER ---------------------- */
  return (
    <ScrollView contentContainerStyle={styles.containerMyresults}>
      <Text style={styles.heading}>My Results</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#01c3ff" />
      ) : testData.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>
            You haven't attempted any test yet!
          </Text>
        </View>
      ) : (
        <>
          {/* ------- PORTAL BUTTONS ------- */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.portalButtonsScroll}
          >
            {portals.map((portal) => (
              <TouchableOpacity
                key={portal.course_portal_id}
                style={[
                  styles.portalBtn,
                  selectedPortalId === portal.course_portal_id &&
                    styles.portalActive,
                ]}
                onPress={() => {
                  setSelectedPortalId(portal.course_portal_id);
                  setSelectedExamId(portal.exams[0]?.exam_id || null);
                }}
              >
                <Text
                  style={[
                    styles.portalText,
                    selectedPortalId === portal.course_portal_id &&
                      styles.portalTextActive,
                  ]}
                >
                  {portal.portal_name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ------- EXAM BUTTONS ------- */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.examButtonsScroll}
          >
            {currentPortal?.exams.map((exam) => (
              <TouchableOpacity
                key={exam.exam_id}
                style={[
                  styles.examBtn,
                  selectedExamId === exam.exam_id && styles.examActive,
                ]}
                onPress={() => setSelectedExamId(exam.exam_id)}
              >
                <Text
                  style={[
                    styles.examText,
                    selectedExamId === exam.exam_id &&
                      styles.examTextActive,
                  ]}
                >
                  {exam.exam_name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ------- TEST CARDS ------- */}
          <View style={styles.resultsContainer}>
            {currentPortal?.exams
              .find((exam) => exam.exam_id === selectedExamId)
              ?.courses.flatMap((course) =>
                course.tests?.map((test, index) => (
                  <View key={index} style={styles.resultCard}>
                    {/* HEADER */}
                    <Text style={styles.testName}>
                      {course.course_name} - {test.test_name}
                    </Text>

                    <View style={styles.resultContent}>
                      <View style={styles.resultRow}>
                        <Icon name="trending-up" size={20} color="#3c3c3c" />
                        <Text style={styles.resultRowText}>Performance</Text>
                      </View>

                      <View style={styles.resultRow}>
                        <Icon name="menu-book" size={20} color="#3c3c3c" />
                        <Text style={styles.resultRowText}>Solutions</Text>
                      </View>

                      <TouchableOpacity
                        style={styles.viewReportButton}
                        onPress={() =>
                          handleViewReportClick(
                            test.test_id,
                            test,
                            course.course_id
                          )
                        }
                      >
                        <Text style={styles.viewReportButtonText}>
                          VIEW REPORT
                        </Text>
                      </TouchableOpacity>
                    </View>
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


