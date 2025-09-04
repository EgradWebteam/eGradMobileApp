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
} from "react-native";
import { WebView } from "react-native-webview";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ use this in RN
import { backEndUrl, frontEndUrl } from "../apiConfig";

const StudentDashboardBookMarks = ({ studentId }) => {
  const [testPaperData, setTestPaperData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleSolutions, setVisibleSolutions] = useState({});
  const [videoPopup, setVideoPopup] = useState(null);
  const [selectedPortal, setSelectedPortal] = useState(null);

  useEffect(() => {
    const fetchTestPaper = async () => {
      try {
        // Replace sessionStorage with AsyncStorage in RN
        const token = await sessionStorage.getItem("accessToken");
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

  const PlayVideoById = (url) => {
    if (!url) return null;
    let embedUrl = url;

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("youtu.be")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0];
      } else if (url.includes("watch?v=")) {
        videoId = url.split("watch?v=")[1]?.split("&")[0];
      }
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    return (
      <WebView
        source={{ uri: embedUrl }}
        style={{ width: "100%", height: 300 }}
        javaScriptEnabled
        allowsFullscreenVideo
      />
    );
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
    <View style={styles.container}>
      <Text style={styles.heading}>Bookmarks</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.portalButtons}>
        {uniquePortals.map((portal) => (
          <TouchableOpacity
            key={portal.portalId}
            style={[
              styles.portalButton,
              selectedPortal === portal.portalId && styles.activePortalButton,
            ]}
            onPress={() => setSelectedPortal(portal.portalId)}
          >
            <Text style={styles.portalButtonText}>{portal.portalName}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : filteredTests.length > 0 ? (
        <ScrollView style={styles.scrollContent}>
          {filteredTests.map((portal) =>
            portal.tests.map((test) => {
              let questionCounter = 1;
              return (
                <View key={test.TestId} style={styles.testBlock}>
                  <Text style={styles.testTitle}>
                    {test.CourseName} - {test.TestName}
                  </Text>

                  {test.subjects?.map((subject) =>
                    subject.sections.map((section) =>
                      section.questions.map((question) => {
                        const currentQuestionNumber = questionCounter++;
                        return (
                          <View key={question.question_id} style={styles.questionBlock}>
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

                            {/* Question Image */}
                            {question.questionImgName && (
                              <Image
                                source={{ uri: question.questionImgName }}
                                style={styles.image}
                              />
                            )}

                            {/* Options */}
                            {question.options
                              .sort((a, b) =>
                                a.option_index.localeCompare(b.option_index)
                              )
                              .map((option) => (
                                <View key={option.option_id} style={styles.optionRow}>
                                  <Text>({option.option_index})</Text>
                                  <Image
                                    source={{ uri: option.optionImgName }}
                                    style={styles.optionImage}
                                  />
                                </View>
                              ))}

                            {/* Solution buttons */}
                            <View style={styles.solutionButtons}>
                              {question.solution?.solutionImgName && (
                                <TouchableOpacity
                                  style={styles.solutionBtn}
                                  onPress={() =>
                                    toggleSolution(question.question_id)
                                  }
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
                              <Image
                                source={{ uri: question.solution.solutionImgName }}
                                style={styles.solutionImage}
                              />
                            )}

                            {/* Video Modal */}
                            <Modal
                              visible={videoPopup === question.question_id}
                              transparent
                              animationType="slide"
                              onRequestClose={() => setVideoPopup(null)}
                            >
                              <View style={styles.modalOverlay}>
                                <View style={styles.modalContent}>
                                  <TouchableOpacity
                                    style={styles.closeBtn}
                                    onPress={() => setVideoPopup(null)}
                                  >
                                    <Text style={{ color: "white", fontSize: 18 }}>✖</Text>
                                  </TouchableOpacity>
                                  {PlayVideoById(question.solution.video_solution_link)}
                                </View>
                              </View>
                            </Modal>
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
      ) : (
        <Text style={styles.emptyMsg}>You haven't bookmarked anything yet!</Text>
      )}
    </View>
  );
};

export default StudentDashboardBookMarks;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  portalButtons: { marginBottom: 10 },
  portalButton: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginRight: 8,
  },
  activePortalButton: { backgroundColor: "#4CAF50" },
  portalButtonText: { color: "#000" },
  scrollContent: { flex: 1 },
  testBlock: { marginBottom: 20, padding: 10, backgroundColor: "#f9f9f9" },
  testTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  questionBlock: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  image: { width: "100%", height: 200, resizeMode: "contain", marginBottom: 10 },
  optionRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  optionImage: { width: 120, height: 40, resizeMode: "contain", marginLeft: 5 },
  solutionButtons: { flexDirection: "row", marginTop: 10 },
  solutionBtn: {
    backgroundColor: "#2196F3",
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  solutionBtnText: { color: "white" },
  solutionImage: { width: "100%", height: 250, resizeMode: "contain", marginTop: 10 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#000",
    borderRadius: 10,
    overflow: "hidden",
  },
  closeBtn: { position: "absolute", top: 10, right: 10, zIndex: 2 },
  emptyMsg: { textAlign: "center", marginTop: 20, color: "gray" },
});

