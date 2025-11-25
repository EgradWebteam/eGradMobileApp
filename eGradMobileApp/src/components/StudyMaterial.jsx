// StudyMaterialApp.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Modal,
  Pressable
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import StudyMaterialHighlight from "./StudyMaterialHighlight";
import { decryptBatch } from "../utils/CryptoUtils";
import { useStudent } from "../hooks/StudentContext";
import { backEndUrl, frontEndUrl, backEndPort } from "../apiConfig";
import Icon from "react-native-vector-icons/FontAwesome";

const StudyMaterialApp = () => {
  const { studentData } = useStudent();
  const navigation = useNavigation();
  const route = useRoute();

  const [currentStudyMaterialId, setCurrentStudyMaterialId] = useState(null);
  const [studyData, setStudyData] = useState([]);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [activeChapter, setActiveChapter] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedSubject, setExpandedSubject] = useState(new Set());
  const [expandedTopic, setExpandedTopic] = useState(new Set());
  const [expandedChapter, setExpandedChapter] = useState(new Set());
  const [topicId, setTopicId] = useState(null);
  const [chapterId, setChapterId] = useState(null);
  const [studyMaterialId, setStudyMaterialId] = useState(null);
  const [showCustomPopup, setShowCustomPopup] = useState(false);

  // Decrypt query parameters
  useEffect(() => {
    const decryptParams = async () => {
      const { et, es, ec } = route.params || {};
      if (et && es && ec) {
        try {
          const [decryptedTopicId, decryptedStudyMaterialId, decryptedChapterId] =
            await decryptBatch([et, es, ec]);
          setTopicId(decryptedTopicId);
          setChapterId(decryptedChapterId);
          setStudyMaterialId(decryptedStudyMaterialId);
        } catch (err) {
          console.error("Failed to decrypt", err);
          Alert.alert("Error", "Failed to decrypt parameters", [
            { text: "OK", onPress: () => navigation.navigate("Error") }
          ]);
        }
      } else {
        navigation.navigate("Error");
      }
    };
    decryptParams();
  }, [route.params]);

  // Fetch study materials
  const fetchStudyMaterials = async (topicId = null, chapterId = null) => {
    try {
      const instituteId =
        studentData?.instituteId || (await AsyncStorage.getItem("institute_id"));

      if (!instituteId) return;

      const res = await fetch(`${backEndUrl}/StudyMaterial/study-materials-structured`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ institute_id: instituteId, topic_id: topicId, chapter_id: chapterId }),
      });

      const data = await res.json();
      const formattedData = Array.isArray(data) ? data : [data];
      setStudyData(formattedData);

      // Expand all subjects/topics/chapters
      const allSubjects = new Set();
      const allTopics = new Set();
      const allChapters = new Set();
      formattedData.forEach(subject => {
        allSubjects.add(subject.subject_id);
        subject.topics.forEach(topic => {
          allTopics.add(topic.topic_id);
          topic.chapters.forEach(chapter => allChapters.add(chapter.chapter_id));
        });
      });
      setExpandedSubject(allSubjects);
      setExpandedTopic(allTopics);
      setExpandedChapter(allChapters);

      // Find selected PDF
      let foundPDF = null;
      if (studyMaterialId) {
        formattedData.forEach(subject => {
          subject.topics.forEach(topic => {
            topic.chapters.forEach(ch => {
              if (Number(ch.study_material_id) === Number(studyMaterialId)) {
                foundPDF = { url: ch.url, name: ch.name, study_material_id: ch.study_material_id };
              }
            });
          });
        });
      }

      if (foundPDF) {
        setSelectedPDF(foundPDF.url);
        setActiveChapter(foundPDF.name);
        setCurrentStudyMaterialId(foundPDF.study_material_id);
      } else if (formattedData.length > 0) {
        const firstChapter = formattedData[0].topics?.[0]?.chapters?.[0];
        if (firstChapter) {
          setSelectedPDF(firstChapter.url);
          setActiveChapter(firstChapter.name);
          setCurrentStudyMaterialId(firstChapter.study_material_id);
        }
      }
    } catch (err) {
      console.error("Error fetching study materials:", err);
    }
  };

  useEffect(() => {
    if (topicId && chapterId && studyMaterialId) {
      fetchStudyMaterials(topicId, chapterId);
    }
  }, [topicId, chapterId, studyMaterialId, studentData]);

  const toggleSetItem = (set, id) => {
    const newSet = new Set(set);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    return newSet;
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Hamburger Button */}
      <TouchableOpacity
        style={styles.hamburgerButton}
        onPress={() => setSidebarOpen(!sidebarOpen)}
      >
        <Icon name="bars" size={24} color="#000" />
      </TouchableOpacity>

      <View style={{ flexDirection: "row", flex: 1 }}>
        {/* Sidebar */}
        {sidebarOpen && (
          <ScrollView style={styles.sidebar}>
{studyData.map((subject, sIndex) => (
  <View key={`subject-${subject.subject_id}-${sIndex}`}>
    <TouchableOpacity
      style={styles.subjectHeader}
      onPress={() =>
        setExpandedSubject(toggleSetItem(expandedSubject, subject.subject_id))
      }
    >
      <Icon name={expandedSubject.has(subject.subject_id) ? "chevron-down" : "chevron-right"} size={16} />
      <Text style={styles.subjectText}>{subject.subject_name}</Text>
    </TouchableOpacity>

    {expandedSubject.has(subject.subject_id) &&
      subject.topics.map((topic, tIndex) => (
        <View key={`subject-${subject.subject_id}-topic-${topic.topic_id}-${tIndex}`} style={{ paddingLeft: 15 }}>
          <TouchableOpacity
            style={styles.topicHeader}
            onPress={() =>
              setExpandedTopic(toggleSetItem(expandedTopic, topic.topic_id))
            }
          >
            <Icon name={expandedTopic.has(topic.topic_id) ? "chevron-down" : "chevron-right"} size={14} />
            <Text style={styles.topicText}>{topic.topic_name}</Text>
          </TouchableOpacity>

          {expandedTopic.has(topic.topic_id) &&
            topic.chapters.map((chapter, cIndex) => (
              <View key={`subject-${subject.subject_id}-topic-${topic.topic_id}-chapter-${chapter.chapter_id}-${cIndex}`} style={{ paddingLeft: 15 }}>
                <TouchableOpacity
                  style={styles.chapterHeader}
                  onPress={() =>
                    setExpandedChapter(toggleSetItem(expandedChapter, chapter.chapter_id))
                  }
                >
                  <Icon name={expandedChapter.has(chapter.chapter_id) ? "chevron-down" : "chevron-right"} size={12} />
                  <Text style={styles.chapterText}>{chapter.name}</Text>
                </TouchableOpacity>

                {expandedChapter.has(chapter.chapter_id) && chapter.url && (
                  <TouchableOpacity
                    style={[
                      styles.pdfItem,
                      selectedPDF === chapter.url && styles.activePdf
                    ]}
                    onPress={() => {
                      setSelectedPDF(chapter.url);
                      setActiveChapter(chapter.name);
                      setCurrentStudyMaterialId(chapter.study_material_id);
                      setSidebarOpen(false); // Close sidebar on select
                    }}
                  >
                    <Icon name="file-pdf-o" size={12} />
                    <Text style={styles.pdfText}>
                      {decodeURIComponent(chapter.url.split("/").pop()).replace(/\.pdf.*$/i, "")}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
        </View>
      ))}
  </View>
))}


          </ScrollView>
        )}

        {/* PDF Viewer */}
        {/* PDF Viewer */}
        <View style={{ flex: 1 }}>
          {selectedPDF && (
            <StudyMaterialHighlight
              fileUrl={selectedPDF}
              onClose={() => navigation.goBack()} // <-- This will close the entire study material
            />
          )}
        </View>

      </View>

      {/* Custom Popup */}
      <Modal
        transparent
        visible={showCustomPopup}
        animationType="fade"
        onRequestClose={() => setShowCustomPopup(false)}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Warning!</Text>
            <Text style={styles.popupText}>
              Pressing any <Text style={{ fontWeight: "bold" }}>function keys or other keys</Text> is not allowed.
            </Text>
            <Pressable
              style={styles.popupButton}
              onPress={() => setShowCustomPopup(false)}
            >
              <Text style={styles.popupButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default StudyMaterialApp;

const styles = StyleSheet.create({
  hamburgerButton: {
    position: "absolute",
    top: 40,
    left: 10,
    zIndex: 10,
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  sidebar: {
    width: 120, 
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  subjectHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  subjectText: {
    marginLeft: 8,
    fontWeight: "700",
    fontSize: 16,
    color: "#333",
  },
  topicHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  topicText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#555"
  },
  chapterHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4
  },
  chapterText: {
    marginLeft: 8,
    fontSize: 13,
    color: "#666"
  },
  pdfItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingLeft: 20,
    borderRadius: 5,
    marginVertical: 1
  },
  pdfText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#444"
  },
  activePdf: {
    backgroundColor: "#d0eaff",
    borderRadius: 5,
  },
  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  popupContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center"
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },
  popupText: {
    textAlign: "center",
    marginBottom: 20
  },
  popupButton: {
    backgroundColor: "#01c3ff",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5
  },
  popupButtonText: {
    color: "#fff",
    fontWeight: "bold"
  }
});

