import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
 import { backEndUrl, frontEndUrl,backEndPort } from "../apiConfig";
import TestDetailsContainer from "./TestDetailsContainer";
import OrvlCourseTopic from "./OrvlCourseTopic";
// import { useSession } from "./hooks/SessionContext";

const BundleCourseContainer = ({
  courseIds,
  onBack,
  studentId,
  userData,
  selectedExam,
  setChapterdetails,
  chapterdetails,
}) => {
  const [bundleData, setBundleData] = useState(null);
  const [activeSection, setActiveSection] = useState("orvl");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [testDataLoading, setTestDataLoading] = useState(false);
  const [orvlDataLoading, setOrvlDataLoading] = useState(true);
  const [refreshTriggerBundle, setRefreshTriggerBundle] = useState(false);
  const [courseId, setCourseId] = useState(null);
//   const { validateSession } = useSession();
console.log("user dataaaa bundleeee",userData)
  // Fetch ORVL (bundle) data
  useEffect(() => {
    const fetchTotalCourseData = async () => {
      try {
        setOrvlDataLoading(true);
        const url = `${backEndUrl}/studentmycourses/getBundleData`;
        const response = await axios.post(url, {
          courseIds: courseIds,
          studentId: studentId,
        });
        setBundleData(response.data);
      } catch (error) {
        console.error("Error while fetching course data", error);
      } finally {
        setOrvlDataLoading(false);
      }
    };

    if (studentId && courseIds) {
      fetchTotalCourseData();
    }
  }, [studentId, courseIds]);

  // Restore active section from AsyncStorage
  useEffect(() => {
    const loadState = async () => {
      const savedState = JSON.parse((await AsyncStorage.getItem("studentDashboardState")) || "{}");
      setActiveSection(savedState.orvlbtnsection ?? "orvl");
    };
    loadState();
  }, []);

  // Fetch test details
  useEffect(() => {
    const fetchTestDetails = async () => {
      setTestDataLoading(true);
    //   const isValid = await validateSession();
    //   if (!isValid) return;
      try {
        const response = await axios.post(
          `${backEndUrl}/studentmycourses/getBundleCourseDetails`,
          { courseIds, studentId }
        );
        setData(response.data);
        console.log("test dataaaaa in bundleee",response.data);
      } catch (error) {
        console.error("Error fetching test details", error);
      } finally {
        setTestDataLoading(false);
      }
    };

    if (activeSection === "test" && studentId) {
      fetchTestDetails();
    }
  }, [activeSection, studentId, courseIds, refreshTriggerBundle]);

  // Restore last chapter
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      try {
        const savedState = JSON.parse((await AsyncStorage.getItem("studentDashboardState")) || "{}");
        const savedChapterId = savedState.selectedChapterId;
        const savedCourseId = savedState.selectedCourseId;
        if (savedChapterId) {
          await handleStartPractice(savedChapterId, savedCourseId);
        }
      } catch (error) {
        console.error("Failed to initialize dashboard state:", error);
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  const handleSectionChange = async (section) => {
    // const isValid = await validateSession();
    // if (!isValid) return;

    setActiveSection(section);
    const savedState = {
      ...(JSON.parse((await AsyncStorage.getItem("studentDashboardState")) || "{}")),
      orvlbtnsection: section,
    };
    await AsyncStorage.setItem("studentDashboardState", JSON.stringify(savedState));
  };

  const handleStartPractice = async (chapterId, courseCreationId) => {
    // const isValid = await validateSession();
    // if (!isValid) return;
    try {
      const response = await axios.get(
        `${backEndUrl}/studentmycourses/getChapterQuestions/${chapterId}`
      );
      setChapterdetails(response.data);
      setCourseId(courseCreationId);

      await AsyncStorage.setItem(
        "studentDashboardState",
        JSON.stringify({
          activeSection: "myCourses",
          selectedTestCourse: courseIds,
          selectedPortalId: 2,
          showQuizContainer: false,
          showTestContainer: false,
          courseContainer: true,
          selectedExam,
          selectedCourseId: courseCreationId,
          selectedChapterName: response.data.chapter_name || null,
          selectedChapterId: response.data.chapter_id || null,
        })
      );
    } catch (error) {
      console.error("Error fetching topic details", error);
    }
  };

  const orvlDetails = bundleData?.orvlDetails || [];
  const subjectList = Array.from(new Set(orvlDetails.map((item) => item.subject_name))).sort(
    (a, b) => a.localeCompare(b)
  );

  useEffect(() => {
    if (subjectList.length > 0 && !selectedSubject) {
      setSelectedSubject(subjectList[0]);
    }
  }, [subjectList, selectedSubject]);

  if (chapterdetails) {
    return (
      <OrvlCourseTopic
        courseData={chapterdetails}
        courseCreationId={courseId}
        studentId={studentId}
        topicid={chapterdetails.topic_id}
        onBack={async () => {
        //   const isValid = await validateSession();
        //   if (!isValid) return;
          setChapterdetails(null);
          await AsyncStorage.setItem(
            "studentDashboardState",
            JSON.stringify({
              activeSection: "myCourses",
              // selectedTestCourse: course,
              selectedPortalId: 2,
              showQuizContainer: false,
              showTestContainer: false,
              courseContainer: true,
              selectedTestCourse: courseIds,
              selectedExam,
            })
          );
        }}
      />
    );
  }

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <ScrollView style={styles.container}>
      {/* Go Back Button */}
      <TouchableOpacity style={styles.goBackBtn} onPress={onBack}>
        <Text style={styles.goBackText}>Go Back</Text>
      </TouchableOpacity>

      {/* Section Buttons */}
      <View style={styles.sectionButtons}>
        <TouchableOpacity
          style={[styles.sectionBtn, activeSection === "orvl" && styles.activeBtn]}
          onPress={() => handleSectionChange("orvl")}
        >
          <Text   style={[
        styles.btnText,
        activeSection === "orvl" && styles.activeBtnText, // 👈 add this
      ]}>
        Recorded Lectures</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sectionBtn, activeSection === "test" && styles.activeBtn]}
          onPress={() => handleSectionChange("test")}
        >
          <Text  style={[
        styles.btnText,
        activeSection === "test" && styles.activeBtnText, // 👈 add this
      ]}>
        My Tests</Text>
        </TouchableOpacity>
      </View>

      {/* Test Section */}
      {activeSection === "test" && (
        <TestDetailsContainer
          studentId={studentId}
          data={data}
          refreshTriggerBundle={refreshTriggerBundle}
          setRefreshTriggerBundle={setRefreshTriggerBundle}
          userData={userData}
          testDataLoading={testDataLoading}
        />
      )}

      {/* ORVL Section */}
      {activeSection === "orvl" &&
        (orvlDataLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            {/* Subject Filter */}
            {subjectList.length > 0 && (
              <ScrollView horizontal style={styles.subjectFilter}>
                {subjectList.map((subject, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.subjectBtn,
                      selectedSubject === subject && styles.activeSubjectBtn,
                    ]}
                    onPress={() => setSelectedSubject(subject)}
                  >
                    <Text  style={[
          styles.btnText,
          selectedSubject === subject && styles.activeBtnText, 
        ]}>
          {subject}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* ORVL Content */}
            {orvlDetails.length > 0 ? (
              (selectedSubject
                ? Object.entries(
                    orvlDetails
                      .filter((item) => item.subject_name === selectedSubject)
                      .reduce((acc, item) => {
                        if (!acc[item.topic_id]) {
                          acc[item.topic_id] = { topic_name: item.topic_name, chapters: [] };
                        }
                        acc[item.topic_id].chapters.push(item);
                        return acc;
                      }, {})
                  )
                : []
              ).map(([topicId, topicData]) => (
                <View key={topicId} style={styles.topicContainer}>
                  <Text style={styles.topicTitle}>Topic: {topicData.topic_name}</Text>
                  {topicData.chapters.map((chapter, idx) => (
                    <View key={idx} style={styles.chapterCard}>
                      <Text style={styles.chapterTitle}>Chapter: {chapter.chapter_name}</Text>
                      <Text>🎥 Lectures: {chapter.lecture_count}</Text>
                      <Text>📝 Exercises: {chapter.exercise_count}</Text>
                      <Text>📄 PDFs</Text>
                      <TouchableOpacity
                        style={styles.startBtn}
                        onPress={() => handleStartPractice(chapter.chapter_id, chapter.course_id)}
                      >
                        <Text style={styles.startBtnText}>▶ Start Practice</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ))
            ) : (
              <Text>No Recorded Lecture details available.</Text>
            )}
          </>
        ))}
    </ScrollView>
  );
};

export default BundleCourseContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

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

  sectionButtons: {
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 16,
  },
  sectionBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#e5e5e5",
    alignItems: "center",
  },
  activeBtn: {
    backgroundColor: "#00aaff",
  },
  btnText: {
    fontWeight: "600",
    color: "#222",
  },
activeBtnText: {
  color: "#fff", // White when active
},
  /* Subject filter pills */
  subjectFilter: {
    marginBottom: 16,
  },
  subjectBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#e5e5e5",
    borderRadius: 20,
    marginRight: 10,
  },
  activeSubjectBtn: {
    backgroundColor: "#00aaff",
  },
  subjectBtnText: {
    fontWeight: "600",
    color: "#fff",
  },

  /* Topic container */
  topicContainer: {
    marginBottom: 20,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#111",
  },

  /* Chapter card */
  chapterCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  chapterTitle: {
    fontWeight: "800",
    fontSize: 17,
    marginBottom: 8,
    color: "#222",
    textAlign:"center",
  },
  chapterInfo: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },

  /* Start practice button */
  startBtn: {
    marginTop: 10,
    backgroundColor: "#00aaff",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  startBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});

