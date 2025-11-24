import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute, useNavigation } from "@react-navigation/native";
import { backEndUrl, frontEndUrl } from "../apiConfig";
import StudentReport from "./StudentReport"; 
import SolutionsTab from "./SolutionsTab.jsx";
import QuestionsTab from "./QuestionsTab.jsx";
import { useSession } from "../hooks/SessionContext.jsx";
// import DisableKeysAndMouseInteractions from "../../../ContextFolder/DisableKeysAndMouseInteractions.jsx";

const StudentReportMain = () => {
  const [activeTab, setActiveTab] = useState("Your Performance");
  const { validateSession } = useSession();
  const navigation = useNavigation();
  const route = useRoute();

  const {
    testId,
    studentId,
    userData,
    course_id,
    test_name,
    total_marks,
    duration,
    course_portal_id,
  } = route.params || {};
console.log("dataaa",route.params)
  const [data, setData] = useState(null);
  const [testPaperData, setTestPaperData] = useState([]);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  const [subjectMarks, setSubjectMarks] = useState([]);
  const [error, setError] = useState(null);
  const [selectedSubjectSection, setSelectedSubjectSection] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(false);

  const hasFetchedData = useRef(false);
  const hasFetchedSolutions = useRef(false);
  const hasFetchedQuestions = useRef(false);

//   DisableKeysAndMouseInteractions(null);

  // ✅ Go Back
  const handleGoBack = async () => {
    const isValid = await validateSession();
    if (!isValid) return;

    navigation.navigate("studentDashboard", { studentId });
    await AsyncStorage.removeItem("activeTab");
  };

  // ✅ Fetch Questions
  useEffect(() => {
    const fetchQuestionDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${backEndUrl}/MyResults/questions/${testId}/${course_id}/${studentId}`
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const json = await res.json();
        setQuestionData(json);
      } catch (err) {
        console.error("Failed to fetch question details:", err);
        setError("Something went wrong while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    if (
      activeTab === "Questions" &&
      !hasFetchedQuestions.current &&
      studentId &&
      testId
    ) {
      fetchQuestionDetails();
      hasFetchedQuestions.current = true;
    }
  }, [activeTab, studentId, testId, course_id]);

  // ✅ Fetch Performance
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("accessToken");

        const summaryRes = await fetch(
          `${backEndUrl}/MyResults/StudentRankSummary/${studentId}/${testId}/${course_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const summaryData = await summaryRes.json();
        setData(summaryData);
        console.log("✅ summaryData fetched", summaryData);

        const subjectRes = await fetch(
          `${backEndUrl}/MyResults/TestSubjectWiseStudentMarks/${studentId}/${testId}/${course_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const subjectJson = await subjectRes.json();
        setSubjectMarks(subjectJson.subjects || []);
        console.log("✅ subjectMarks fetched", subjectJson.subjects);
      } catch (err) {
        setError("Error fetching data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (
      activeTab === "Your Performance" &&
      !hasFetchedData.current &&
      studentId &&
      testId
    ) {
      fetchData();
      hasFetchedData.current = true;
    }
  }, [activeTab, studentId, testId, course_id, course_portal_id]);


  // ✅ Fetch Solutions
  useEffect(() => {
    const fetchTestPaper = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("accessToken");
        const res = await fetch(
          `${backEndUrl}/MyResults/StudentReportQuestionPaper/${testId}/${studentId}/${course_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const json = await res.json();
        setTestPaperData(json);

        if (json?.subjects?.length > 0) {
          const firstSubject = json.subjects[0];
          const firstSection = firstSubject.sections?.[0] || {};
          setSelectedSubjectSection({
            SubjectName: firstSubject.SubjectName,
            SectionName: firstSection.SectionName || null,
            questions: firstSection.questions || [],
          });
        }

        const bookmarked =
          json?.subjects?.flatMap((sub) =>
            sub?.sections?.flatMap((sec) =>
              sec?.questions
                ?.filter((q) => q?.bookMark_Qid !== null)
                ?.map((q) => q.bookMark_Qid)
            )
          ) || [];
        setBookmarkedQuestions(bookmarked);
      } catch (err) {
        console.error("Error fetching test paper:", err);
      } finally {
        setLoading(false);
      }
    };

    if (
      activeTab === "Solutions" &&
      !hasFetchedSolutions.current &&
      testId &&
      studentId
    ) {
      fetchTestPaper();
      hasFetchedSolutions.current = true;
    }
  }, [activeTab, testId, studentId, course_id]);

  // ✅ Load saved tab from AsyncStorage
  useEffect(() => {
    const loadSavedTab = async () => {
      const savedTab = await AsyncStorage.getItem("activeTab");
      if (savedTab) setActiveTab(savedTab);
    };
    loadSavedTab();
  }, []);

  const handleTabChange = async (tab) => {
    const isValid = await validateSession();
    if (!isValid) return;
    setActiveTab(tab);
    await AsyncStorage.setItem("activeTab", tab);
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{activeTab}</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.testDetails}>
        <Text>Test Name: <Text style={styles.bold}>{test_name}</Text></Text>
        <Text>Total Marks: <Text style={styles.bold}>{total_marks}</Text></Text>
        <Text>Duration: <Text style={styles.bold}>{duration}</Text></Text>
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "Your Performance" && styles.activeTab]}
          onPress={() => handleTabChange("Your Performance")}
        >
          <Text 
          style={styles.tabText}
          >
          Your Performance</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "Solutions" && styles.activeTab]}
          onPress={() => handleTabChange("Solutions")}
        >
          <Text 
          style={styles.tabText}
          >Solutions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "Questions" && styles.activeTab]}
          onPress={() => handleTabChange("Questions")}
        >
          <Text 
          style={styles.tabText}
          >Detailed Analysis</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      <View style={styles.tabContent}>
        {activeTab === "Your Performance" && (
          <StudentReport
            testId={testId}
            course_id={course_id}
            studentId={studentId}
            course_portal_id={course_portal_id}
            userData={userData}
            data={data}
            subjectMarks={subjectMarks}
          />
        )}
        {activeTab === "Solutions" && (
          <SolutionsTab
            testId={testId}
            setBookmarkedQuestions={setBookmarkedQuestions}
            bookmarkedQuestions={bookmarkedQuestions}
            studentId={studentId}
            setSelectedSubjectSection={setSelectedSubjectSection}
            selectedSubjectSection={selectedSubjectSection}
            userData={userData}
            course_id={course_id}
            testPaperData={testPaperData}
          />
        )}
        {activeTab === "Questions" && (
          <QuestionsTab
            testId={testId}
            studentId={studentId}
            userData={userData}
            course_id={course_id}
            questionData={questionData}
            loading={loading}
          />
        )}
      </View>
    </View>
  );
};

export default StudentReportMain;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerText: { fontSize: 20, fontWeight: "bold" },
  backButton: { backgroundColor: "#198754", padding: 8, borderRadius: 5 },
  backButtonText: { color: "#fff" , fontWeight:"bold"},
  testDetails: { marginBottom: 16 },
  bold: { fontWeight: "bold" },
  tabRow: { flexDirection: "row", marginBottom: 16 },
  tabBtn: {
    flex: 1,
    padding: 10,
    backgroundColor: "#444444",
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 4,
  },
  activeTab: { backgroundColor: "rgb(7, 174, 240)" },
  tabTextActive: { color: "#fff", fontWeight: "bold" },
  tabText:{color: "#fff", fontWeight: "bold",fontSize:13},
  tabContent: { flex: 1, marginTop: 10 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red" },
});
