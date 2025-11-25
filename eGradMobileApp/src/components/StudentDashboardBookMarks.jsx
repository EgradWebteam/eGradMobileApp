import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Modal,
  StyleSheet,
  Dimensions
} from "react-native";
import { WebView } from "react-native-webview";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { backEndUrl } from "../apiConfig";
import { styles } from "../styles/StudentDashboardStyles";
import ResponsiveImage from './OTSFolder/ResponsiveImage';  
import AutoSizedImage from "./AutoSizedImage";
import renderVideo from "./renderVideo";
const StudentDashboardBookMarks = ({ studentId }) => {
  const [testPaperData, setTestPaperData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleSolutions, setVisibleSolutions] = useState({});
  const [videoPopup, setVideoPopup] = useState(null);
  const [selectedPortal, setSelectedPortal] = useState(null);
  const { width, height } = Dimensions.get('window');
  useEffect(() => {
    const fetchTestPaper = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        setLoading(true);

        const response = await fetch(
          `${backEndUrl}/studentBookMarks/BookMarkQuestionOptions/${studentId}`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch bookmarks");

        const data = await response.json();
        setTestPaperData(data);
      } catch (err) {
        console.error("Error fetching test paper:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestPaper();
  }, [studentId]);

  const handleDelete = async (
    studentId,
    questionId,
    bookMarkTid,
    courseId,
    portalId
  ) => {
    try {
      const response = await fetch(
        `${backEndUrl}/studentBookMarks/DeleteBookmark/${studentId}/${questionId}/${bookMarkTid}/${courseId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete bookmark");

      // Update local state
      setTestPaperData((prevData) =>
        prevData
          .map((portal) => {
            if (portal.portalId !== portalId) return portal;

            const updatedTests = portal.tests
              .map((test) => {
                if (test.BookMarkTid !== bookMarkTid) return test;

                const updatedSubjects = test.subjects
                  .map((subject) => {
                    const updatedSections = subject.sections
                      .map((section) => ({
                        ...section,
                        questions: section.questions.filter(
                          (q) => q.question_id !== questionId
                        ),
                      }))
                      .filter((section) => section.questions.length > 0);

                    return { ...subject, sections: updatedSections };
                  })
                  .filter((subject) => subject.sections.length > 0);

                return { ...test, subjects: updatedSubjects };
              })
              .filter((test) => test.subjects.length > 0);

            return { ...portal, tests: updatedTests };
          })
          .filter((portal) => portal.tests.length > 0)
      );
    } catch (err) {
      console.error("Error deleting bookmark:", err);
    }
  };

  const toggleSolution = (questionId) => {
    setVisibleSolutions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };


  const uniquePortals = testPaperData.map(({ portalId, portalName }) => ({
    portalId,
    portalName,
  }));

  useEffect(() => {
    if (uniquePortals.length && selectedPortal === null) {
      setSelectedPortal(uniquePortals[0].portalId);
    }
  }, [uniquePortals]);

  const filteredTests = selectedPortal
    ? testPaperData.filter((p) => p.portalId === selectedPortal)
    : [];

  return (
    <View style={styles.containerBookMarks}>
      <Text style={styles.heading}>Bookmarks</Text>

   

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) :
        filteredTests.length > 0 ? (
          <View>
     <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.portalButtons}>
        {uniquePortals.map((portal) => (
          <TouchableOpacity
            key={portal.portalId}
            style={[
              styles.portalButton,
              selectedPortal === portal.portalId && styles.activeButton,
            ]}
            onPress={() => setSelectedPortal(portal.portalId)}
          >
            <Text style={[
              styles.portalButtontext,
              selectedPortal === portal.portalId && styles.activeButtontext,
            ]}>{portal.portalName}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
         
          <ScrollView style={styles.scrollContent}>
            {filteredTests.map((portal, portalIndex) =>
              portal.tests.map((test, testIndex) => {
                let questionCounter = 1;
                return (
                  <View
                    key={`portal-${portal.portalId}-test-${test.TestId}-${testIndex}`}
                    style={styles.testBlock}
                  >
                    <Text style={styles.testTitle}>
                      {test.CourseName} - {test.TestName}
                    </Text>

                    {test.subjects?.map((subject, subjIndex) =>
                      subject.sections.map((section, secIndex) =>
                        section.questions.map((question, qIndex) => {
                          const currentQuestionNumber = questionCounter++;
                          return (
                            <View
                              key={`test-${test.TestId}-subj-${subjIndex}-sec-${secIndex}-q-${question.question_id}-${qIndex}`}
                              style={styles.questionBlock}
                            >
                              <View style={styles.questionHeader}>
                                <Text>Question No: {currentQuestionNumber}</Text>
                                <TouchableOpacity
                                  onPress={() =>
                                    handleDelete(
                                      studentId,
                                      question.question_id,
                                      test.BookMarkTid,
                                      test.CourseId,
                                      portal.portalId
                                    )
                                  }
                                >
                                  <Icon name="delete-forever" size={28} color="red" />
                                </TouchableOpacity>
                              </View>

                              {/* Question + Content Container with Scroll */}
                              <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={true}
                                nestedScrollEnabled={true}
                                style={{ marginBottom: 10 }}
                              >
                                <View style={{ flexDirection: "column", paddingRight: 20 }}>
                                  {/* Paragraph */}
                                  {question.paragraph?.paragraphImgName && (
                                    <View style={styles.paragraphContainer}>
                                      <Text style={styles.paragraphTag}>Paragraph:</Text>
                                      <ResponsiveImage
                                        uri={question.paragraph.paragraphImgName}
                           
                                      />
                                    </View>
                                  )}

                                  {/* Question Image */}
                                  {question.questionImgName && (
                                    <ResponsiveImage
                                      uri={question.questionImgName}
                                
                                    />
                                  )}

                                  {/* Options */}
                                  {question.options
                                    .sort((a, b) =>
                                      a.option_index.localeCompare(b.option_index)
                                    )
                                    .map((option, optIndex) => (
                                      <View
                                        key={`q-${question.question_id}-opt-${option.option_id}-${optIndex}`}
                                        style={styles.optionRow}
                                      >
                                        <Text>({option.option_index})</Text>
                                        <ResponsiveImage
                                          uri={option.optionImgName}
                                  
                                        />
                                      </View>
                                    ))}
                                </View>
                              </ScrollView>

                              {/* Solution buttons */}
                              <View style={styles.solutionButtons}>
                                {question.solution?.solutionImgName && (
                                  <TouchableOpacity
                                    style={styles.solutionBtn}
                                    onPress={() => toggleSolution(question.question_id)}
                                  >
                                    <Text style={styles.solutionBtnText}>
                                      {visibleSolutions[question.question_id]
                                        ? "Hide Solution"
                                        : "View Solution"}
                                    </Text>
                                  </TouchableOpacity>
                                )}
                                {question.solution?.video_solution_link && (
                                  <TouchableOpacity
                                    style={styles.solutionBtn}
                                    onPress={() => setVideoPopup(question.question_id)}
                                  >
                                    <Text style={styles.solutionBtnText}>
                                      View Video Solution
                                    </Text>
                                  </TouchableOpacity>
                                )}
                              </View>

                              {/* Image Solution */}
                              {visibleSolutions[question.question_id] && (
                                <ScrollView
                                  horizontal
                                  showsHorizontalScrollIndicator={true}
                                  nestedScrollEnabled={true}
                                  style={{ marginTop: 10 }}
                                >
                                  <ResponsiveImage
                                    uri={question.solution.solutionImgName}
                                
                                  />
                                </ScrollView>
                              )}

                              {videoPopup === question.question_id && (
                                <Modal
                                  visible
                                  transparent={false}
                                  onRequestClose={() => setVideoPopup(null)}
                                >
                                  <View style={styles.modalContent}>
                                    <TouchableOpacity
                                      style={styles.closeBtn}
                                      onPress={() => setVideoPopup(null)}
                                    >
                                      <Text style={{ fontSize: 18 }}>✖ Close</Text>
                                    </TouchableOpacity>
                                    <View
                                      style={{ backgroundColor: "#fff", height: height - 80 }}
                                    >
                                      {renderVideo(question.solution.video_solution_link)}
                                    </View>
                                  </View>
                                </Modal>
                              )}
                            </View>
                          );
                        })
                      )
                    )}
                  </View>
                );
              })
            )}
          </ScrollView>
             </View>
        ) : (
          <Text style={styles.emptyMsg}>You haven't bookmarked anything yet!</Text>
        )}
    </View>
  );
};

export default StudentDashboardBookMarks;
