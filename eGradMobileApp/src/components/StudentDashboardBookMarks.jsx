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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { backEndUrl } from "../apiConfig";
import { styles } from "../styles/StudentDashboardStyles";
import AutoSizedImage from "./AutoSizedImage";
const StudentDashboardBookMarks = ({ studentId }) => {
  const [testPaperData, setTestPaperData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleSolutions, setVisibleSolutions] = useState({});
  const [videoPopup, setVideoPopup] = useState(null);
  const [selectedPortal, setSelectedPortal] = useState(null);

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

  const toggleSolution = (questionId) => {
    setVisibleSolutions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const PlayVideoById = (url) => {
    if (!url) return null;
    const lowerUrl = url.toLowerCase();
    let embedUrl = url;

    // YouTube
    if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("youtu.be")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0];
      } else if (url.includes("watch?v=")) {
        videoId = url.split("watch?v=")[1]?.split("&")[0];
      }
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    // Vimeo
    else if (lowerUrl.includes("vimeo.com")) {
      const videoId = url.split("/").pop();
      embedUrl = `https://player.vimeo.com/video/${videoId}`;
    }

    // Google Drive
    else if (lowerUrl.includes("drive.google.com/file/d/")) {
      const fileId = url.split("/d/")[1]?.split("/")[0];
      if (fileId) embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
    }

    // Direct video file (.mp4, .webm, .ogg)
    else if (lowerUrl.match(/\.(mp4|webm|ogg)$/)) {
      return (
        <WebView
          source={{ uri: url }}
          style={{ width: "100%", height: 300 }}
          mediaPlaybackRequiresUserAction={false}
          allowsFullscreenVideo
        />
      );
    }

    // Default embed
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
    <View style={styles.containerBookMarks}>
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
                            {/* Question + Delete */}
                            <View style={styles.questionHeader}>
                              <Text>Question No: {currentQuestionNumber}</Text>
                              <TouchableOpacity>
                                <Icon name="delete-forever" size={28} color="red" />
                              </TouchableOpacity>
                            </View>

                            {/* Paragraph */}
                            {question.paragraph?.paragraphImgName && (
                              <View style={styles.paragraphContainer}>
                                <Text style={styles.paragraphTag}>Paragraph:</Text>
                                {/* <Image
                                  source={{ uri: question.paragraph.paragraphImgName }}
                                  style={styles.paragraphImage}
                                /> */}
                                 <AutoSizedImage uri={question.paragraph.paragraphImgName} style={styles.paragraphImage} />
                              </View>
                            )}

                            {/* Question Image */}
                            {question.questionImgName && (
                               <AutoSizedImage uri={question.questionImgName} style={styles.image} />
                            )}

                            {/* Options */}
                            {question.options
                              .sort((a, b) =>
                                a.option_index.localeCompare(b.option_index)
                              )
                              .map((option) => (
                                <View key={option.option_id} style={styles.optionRow}>
                                  <Text>({option.option_index})</Text>
                                  {/* <Image 
                                   source={{ uri: option.optionImgName } }
                                  style={styles.optionImage} /> */}
                                   <AutoSizedImage uri={option.optionImgName} style={styles.optionImage} />
                                </View>
                              ))}

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
                           <AutoSizedImage uri={question.solution.solutionImgName} style={styles.solutionImage} />
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
