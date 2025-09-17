import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview";

const { width } = Dimensions.get("window");

const Popup = ({
  visible,
  onClose,
  lecture,
  exercise,
  topic_id,
  chapter_id,
  subject_id,
  course_id,
  studentId,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  userAnswer,
  setUserAnswer,
  selectedOptions,
  setSelectedOptions,
  exerciseMeta,
  setExerciseMeta,
  answerDisabled,
  setAnswerDisabled,
  feedback,
  setFeedback,
  solutionVideo,
  solutionImage,
  previousLectureOrExercise,
  nextLectureOrExercise,
}) => {
  const [isMobile, setIsMobile] = useState(width <= 768);
  const [showPalette, setShowPalette] = useState(width > 768);
  const [solutionTypes, setSolutionTypes] = useState({});
  const [solutionVisibility, setSolutionVisibility] = useState(null);
  const inputRef = useRef(null);
  const submitLock = useRef(false);

useEffect(() => {
  const update = () => {
    const mobile = Dimensions.get("window").width <= 768;
    setIsMobile(mobile);
    setShowPalette(!mobile);
  };

  // subscribe
  const subscription = Dimensions.addEventListener("change", update);

  // cleanup
  return () => {
    subscription?.remove();
  };
}, []);

  const getVideoEmbedUrl = (url) => {
    if (!url) return null;
    const lower = url.toLowerCase();
    if (lower.includes("youtube")) {
      let id = "";
      if (url.includes("youtu.be")) id = url.split("youtu.be/")[1]?.split("?")[0];
      else if (url.includes("watch?v=")) id = url.split("watch?v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${id}?rel=0`;
    }
    if (lower.includes("vimeo")) {
      const id = url.split("/").pop();
      return `https://player.vimeo.com/video/${id}`;
    }
    if (lower.includes("drive.google.com/file/d/")) {
      const id = url.split("/d/")[1]?.split("/")[0];
      return `https://drive.google.com/file/d/${id}/preview`;
    }
    if (lower.match(/\.(mp4|webm|ogg)$/)) return url;
    return url;
  };

  const currentQuestion = exercise?.questions?.[currentQuestionIndex];

  const handleOptionChange = (value) => {
    if (currentQuestion.qtype_text === "MSQ" || currentQuestion.qtype_text === "MSQN") {
      if (selectedOptions.includes(value)) {
        setSelectedOptions(selectedOptions.filter((v) => v !== value));
      } else {
        setSelectedOptions([...selectedOptions, value]);
      }
    } else {
      setUserAnswer(value);
    }
  };

  const handleSubmitAnswer = async () => {
    if (submitLock.current) return;
    submitLock.current = true;

    let submittedAnswer = "";
    if (["NATD", "NATI", "MCQ4", "MCQ5", "CTQ"].includes(currentQuestion.qtype_text)) {
      if (!userAnswer) {
        Alert.alert("Error", "Please submit an answer before proceeding.");
        submitLock.current = false;
        return;
      }
      submittedAnswer = userAnswer;
    } else if (["MSQ", "MSQN"].includes(currentQuestion.qtype_text)) {
      if (!selectedOptions.length) {
        Alert.alert("Error", "Please select at least one option.");
        submitLock.current = false;
        return;
      }
      submittedAnswer = selectedOptions.sort().join(",");
    }

    const payload = {
      question_status: 1,
      topic_id,
      subject_id,
      chapter_id,
      exercise_question_id: currentQuestion.exercise_question_id,
      exercise_name_id: exercise.exercise_name_id,
      student_registration_id: studentId,
      course_id,
      exercise_userresponse: submittedAnswer,
    };

    try {
      const res = await fetch(`${BASE_URL}/studentmycourses/SubmitUserAnswer`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit");
      setAnswerDisabled(true);
      setExerciseMeta({
        ...exerciseMeta,
        [currentQuestion.exercise_question_id]: {
          status: "answered",
          response: submittedAnswer,
        },
      });
    } catch (e) {
      setFeedback("Failed to submit. Try again.");
    } finally {
      submitLock.current = false;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {exercise ? exercise.exercise_name : lecture?.orvl_lecture_name}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeBtn}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {exercise && exercise.questions?.length > 0 ? (
          <ScrollView style={{ flex: 1 }}>
            <Text style={styles.questionText}>
              Q{currentQuestion.exercise_question_sort_id}: {currentQuestion.qtype_text}
            </Text>

            {currentQuestion.question_img_name && (
              <Image
                source={{ uri: currentQuestion.question_img_name }}
                style={styles.image}
                resizeMode="contain"
              />
            )}

            {/* MCQ / MSQ */}
            {(currentQuestion.qtype_text.startsWith("MCQ") || currentQuestion.qtype_text.startsWith("MSQ")) && (
              <View style={styles.optionsWrap}>
                {currentQuestion.options?.map((opt) => (
                  <TouchableOpacity
                    key={opt.option_id}
                    style={styles.option}
                    onPress={() => handleOptionChange(opt.option_index)}
                  >
                    <Text>
                      ({opt.option_index}) {opt.option_img_name ? "[Image Option]" : opt.option_index}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* NATD */}
            {(currentQuestion.qtype_text === "NATD" || currentQuestion.qtype_text === "NATI") && (
              <TextInput
                ref={inputRef}
                value={userAnswer}
                onChangeText={setUserAnswer}
                editable={!answerDisabled}
                style={styles.input}
                placeholder="Enter your answer"
                keyboardType="numeric"
              />
            )}

            {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

            <View style={styles.navBtns}>
              {currentQuestionIndex > 0 && (
                <TouchableOpacity onPress={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}>
                  <Text style={styles.btn}>Previous</Text>
                </TouchableOpacity>
              )}
              {!answerDisabled && (
                <TouchableOpacity onPress={handleSubmitAnswer}>
                  <Text style={styles.btn}>Submit</Text>
                </TouchableOpacity>
              )}
              {answerDisabled && (
                <TouchableOpacity onPress={() => setSolutionVisibility(currentQuestion.exercise_question_id)}>
                  <Text style={styles.btn}>View Solution</Text>
                </TouchableOpacity>
              )}
              {currentQuestionIndex < exercise.questions.length - 1 && (
                <TouchableOpacity onPress={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}>
                  <Text style={styles.btn}>Next</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        ) : lecture ? (
          <WebView
            source={{ uri: getVideoEmbedUrl(lecture.lecture_video_link) }}
            style={{ flex: 1 }}
            allowsFullscreenVideo
          />
        ) : (
          <Text>No Data Available</Text>
        )}

        {/* Solution Modal */}
        {solutionVisibility && (
          <Modal visible transparent animationType="fade">
            <View style={styles.solutionOverlay}>
              <View style={styles.solutionContent}>
                <TouchableOpacity onPress={() => setSolutionVisibility(null)}>
                  <Text style={styles.closeBtn}>✕</Text>
                </TouchableOpacity>

                {solutionVideo && (
                  <WebView
                    source={{ uri: getVideoEmbedUrl(solutionVideo) }}
                    style={{ flex: 1 }}
                  />
                )}
                {solutionImage && (
                  <Image
                    source={{ uri: solutionImage }}
                    style={{ width: "100%", height: 300 }}
                    resizeMode="contain"
                  />
                )}
              </View>
            </View>
          </Modal>
        )}
      </View>
    </Modal>
  );
};

export default Popup;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  title: { fontSize: 18, fontWeight: "600" },
  closeBtn: { fontSize: 20, color: "red" },
  questionText: { fontSize: 16, margin: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    margin: 10,
  },
  optionsWrap: { margin: 10 },
  option: {
    padding: 10,
    backgroundColor: "#f5f5f5",
    marginVertical: 5,
    borderRadius: 5,
  },
  navBtns: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
  },
  btn: {
    padding: 10,
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: 6,
  },
  feedback: { color: "red", textAlign: "center" },
  image: { width: "100%", height: 200, marginVertical: 10 },
  solutionOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  solutionContent: {
    width: "90%",
    height: "70%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
});
