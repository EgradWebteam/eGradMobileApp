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
import CheckBox from "@react-native-community/checkbox";
import { RadioButton } from "react-native-paper"; 
const { width } = Dimensions.get("window");
import ResponsiveImage from './OTSFolder/ResponsiveImage';
import { backEndUrl } from "../apiConfig";
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
   const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef(null);
  const submitLock = useRef(false);
 const togglePalette = async () => {
    // const isValid = await validateSession();
    // if (!isValid) return;
    setShowPalette(prev => !prev);
  };
    const getStatus = (questionId) => {
    if (
      exerciseMeta &&
      typeof exerciseMeta === "object" &&
      exerciseMeta[questionId] &&
      typeof exerciseMeta[questionId] === "object"
    ) {
      return exerciseMeta[questionId].status;
    }
    return undefined;
  };
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
 const questionId = exercise?.questions?.[currentQuestionIndex]?.exercise_question_id
const handleNatipChange = (value) => {
    if (answerDisabled || submitLock.current) return;

    // Handle backspace
    if (value === "BACK SPACE") {
      if (cursorPosition > 0) {
        const newValue =
          userAnswer.slice(0, cursorPosition - 1) +
          userAnswer.slice(cursorPosition);
        const newCursor = cursorPosition - 1;
        setUserAnswer(newValue);
        setCursorPosition(newCursor);
      }
      return;
    }

    // Handle clear all
    if (value === "ClearAll") {
      setUserAnswer("");
      setCursorPosition(0);
      return;
    }

    // Insert character at cursor
    let newValue =
      userAnswer.slice(0, cursorPosition) + value + userAnswer.slice(cursorPosition);

    // Special cases for "."
    if (value === ".") {
      if (userAnswer === "") newValue = "0.";
      else if (userAnswer === "-") newValue = "-0.";
    }

    // Allow only valid numbers
    if (/^-?[0-9]*\.?[0-9]*$/.test(newValue)) {
      if (newValue.includes("-") && newValue.indexOf("-") !== 0) return;

      // Prevent unnecessary leading zeros
      if (newValue.startsWith("-0") && newValue.length > 2 && newValue[2] !== ".") {
        newValue = "-" + newValue.slice(2);
      } else if (newValue.startsWith("0") && newValue.length > 1 && newValue[1] !== ".") {
        newValue = newValue.slice(1);
      }

      if (newValue.length <= 10) {
        setUserAnswer(newValue);
        setCursorPosition(cursorPosition + value.length);
      }
    }
  };

  const handleArrowClick = (direction) => {
     if (answerDisabled || submitLock.current) return;
    let newPos = cursorPosition;
    if (direction === "left" && cursorPosition > 0) {
      newPos -= 1;
    } else if (direction === "right" && cursorPosition < userAnswer.length) {
      newPos += 1;
    }
    setCursorPosition(newPos);
  };


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

  const handleOptionChange = async (value) => {
    // const isValid = await validateSession();
    // if (!isValid) return;
    if (currentQuestion.qtype_text === "MCQ4" || currentQuestion.qtype_text === "MCQ5" || currentQuestion.qtype_text === "CTQ") {
      setUserAnswer(value);
    } else if (currentQuestion.qtype_text === "MSQ" || currentQuestion.qtype_text === "MSQN") {
      if (selectedOptions.includes(value)) {
        setSelectedOptions(selectedOptions.filter((opt) => opt !== value));
      } else {
        setSelectedOptions([...selectedOptions, value]);
      }
    }
  };
useEffect(() => {
  submitLock.current = false;
  
}, [questionId]);
 const handleSubmitAnswer = async () => {
  // Prevent double submission
  if (submitLock.current) return;
  submitLock.current = true;

  let submittedAnswer = "";

  // Handling different question types
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

  // Payload to send in the request
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
    // API request to submit the answer
    const res = await fetch(`${backEndUrl}/studentmycourses/SubmitUserAnswer`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to submit");

    // Disable further submission and update state
    setAnswerDisabled(true);
    setExerciseMeta((prevMeta) => ({
      ...prevMeta,
      [currentQuestion.exercise_question_id]: {
        status: "answered",
        response: submittedAnswer,
      },
    }));
  } catch (e) {
    // Show feedback if submission fails
    setFeedback("Failed to submit. Try again.");
  } finally {
    // Reset the lock after the operation is done
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
                <View style={styles.slideshow}>
        {/* Question Section */}
        <View style={styles.exerciseQuestionContainers}>
          <View style={styles.questionsAndImgScrollContainer}>
            <View style={styles.questionTypeAndID}>
              <Text style={styles.questionText}>
                Question No : {currentQuestion.exercise_question_sort_id}
              </Text>
              <Text>Type : {currentQuestion.qtype_text}</Text>
              {isMobile && (
                <TouchableOpacity onPress={togglePalette} style={styles.toggleIcon}>
                  {showPalette ? (
                    <Text style={styles.closeIcon}>✖</Text>
                  ) : (
                    <Text style={styles.hamburgerIcon}>☰</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.questionAndImage} ref={inputRef}>
              {currentQuestion.qtype_text === "CTQ" && currentQuestion.paragraph_img && (
                <View style={styles.imgContainer}>
                  <ResponsiveImage uri= {currentQuestion.paragraph_img }
                 
                  />
                </View>
              )}

              {currentQuestion.question_img_name && (
                <View style={styles.imgContainer}>
                     <ResponsiveImage uri= {currentQuestion.question_img_name }
                
                  />
                </View>
              )}

             {(currentQuestion.qtype_text === "NATD" || currentQuestion.qtype_text === "NATI") && (
  <View style={styles.NATInputHolder}>
    {/* Input Box */}
    <View style={styles.NATLabel}>
      <TextInput
        style={[styles.natInput, answerDisabled && styles.inputDisabled]}
        value={userAnswer}
        ref={inputRef}
        editable={!answerDisabled}
        placeholder="Enter your answer"
        keyboardType="numeric"
         showSoftInputOnFocus={false}
  onChangeText={() => {}}
           
      />
      <Text style={styles.unitText}>{currentQuestion.exercise_answer_unit}</Text>
    </View>

    {/* Keypad */}
    <View style={styles.backSpaceBtn}>
      {/* Backspace */}
      <TouchableOpacity
        style={styles.backSpaceButton}
        onPress={() => handleNatipChange("BACK SPACE")}
        disabled={answerDisabled}
      >
        <Text style={styles.calcText}>BACK SPACE</Text>
      </TouchableOpacity>
  </View>
      {/* Number Keys */}
      <View style={styles.CalculatorBox}>
        {["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ".", "-"].map((key) => (
          <TouchableOpacity
            key={key}
            style={styles.calcButton}
            onPress={() => handleNatipChange(key)}
            disabled={answerDisabled}
          >
           <Text style={styles.calcText}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Arrow Keys */}
     <View style={styles.arrowBtns}>
        <TouchableOpacity
         style={styles.arrowButton}
          onPress={() => handleArrowClick("left")}
          disabled={answerDisabled || cursorPosition === 0}
        >
          <Text style={styles.arrowText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => handleArrowClick("right")}
          disabled={answerDisabled || cursorPosition === userAnswer.length} 
        >
          <Text style={styles.arrowText}>→</Text>
        </TouchableOpacity>
      </View>
<View style={styles.backSpaceBtn}>
      {/* Clear */}
      <TouchableOpacity 
          style={styles.backSpaceButton}
        onPress={() => handleNatipChange('ClearAll')}
        disabled={answerDisabled}
      >
        <Text style={styles.calcText}> CLEAR ALL</Text>
      </TouchableOpacity>
    </View>
  </View>
)}

             {(currentQuestion.qtype_text === "MCQ4" ||
  currentQuestion.qtype_text === "MCQ5" ||
  currentQuestion.qtype_text === "CTQ" ||
  currentQuestion.qtype_text === "TF" ||
  currentQuestion.qtype_text === "MSQ" ||
  currentQuestion.qtype_text === "MSQN") &&
  currentQuestion.options?.length > 0 && (
    <View style={styles.optionsContainer}>
      {currentQuestion.options
        .sort((a, b) => a.option_index.localeCompare(b.option_index))
        .map((option) => (
          <View key={option.option_id} style={styles.optionLabel}>
            {/* For MSQ / MSQN → CheckBox */}
            {(currentQuestion.qtype_text === "MSQ" ||
              currentQuestion.qtype_text === "MSQN") ? (
              <CheckBox
                value={selectedOptions.includes(option.option_index)}
                onValueChange={() =>
                  handleOptionChange(option.option_index)
                }
                disabled={answerDisabled}
              />
            ) : (
              // For MCQ / CTQ / TF → Radio Button
              <RadioButton
                value={option.option_index}
                status={
                  selectedOption === option.option_index
                    ? "checked"
                    : "unchecked"
                }
                onPress={() => handleOptionChange(option.option_index)}
                disabled={answerDisabled}
              />
            )}

            {option.option_img_name ? (
              <ResponsiveImage uri={option.option_img_name} />
            ) : (
              <Text style={styles.optionIndex}>{option.option_index}</Text>
            )}
          </View>
        ))}
    </View>
)}

              {feedback && <Text>{feedback}</Text>}
            </View>
          </View>

          {/* Navigation Buttons */}
          <View style={styles.navigationButtons}>
  {currentQuestionIndex > 0 && (
    <TouchableOpacity
      style={styles.btn}
      onPress={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
    >
      <Text style={styles.btnText}>Previous</Text>
    </TouchableOpacity>
  )}

  {!answerDisabled && (
    <TouchableOpacity
      style={styles.btn}
      onPress={handleSubmitAnswer}
      disabled={answerDisabled}
    >
      <Text style={styles.btnText}>Submit</Text>
    </TouchableOpacity>
  )}

  {answerDisabled && (
    <TouchableOpacity
      style={styles.btn}
      onPress={async () => {
        // const isValid = await validateSession();
        // if (!isValid) return;
        setSolutionVisibility(currentQuestion.exercise_question_id);
      }}
    >
      <Text style={styles.btnText}>View Solution</Text>
    </TouchableOpacity>
  )}

  {currentQuestionIndex < exercise.questions.length - 1 && (
    <TouchableOpacity
      style={styles.btn}
      onPress={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
    >
      <Text style={styles.btnText}>Next</Text>
    </TouchableOpacity>
  )}
</View>

        </View>

        {/* Status Palette */}
        {showPalette && (
          <View style={[styles.statusPalette, showPalette ? styles.showPaletteMobile : null]}>
            <View style={styles.statusPaletteContainer}>
              {exercise.questions.map((question, index) => {
                const status = getStatus(question.exercise_question_id);
                return (
                  <TouchableOpacity
                    key={question.exercise_question_id}
                    onPress={async () => {
                      const isValid = await validateSession();
                      if (!isValid) return;
                      setCurrentQuestionIndex(index);
                    }}
                    style={[styles.statusItem, styles[getStatus(question.exercise_question_id)]]}
                  >
                    <Text>{index + 1}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </View>
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
                  <ResponsiveImage uri= { solutionImage }
                    
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
  exerciseQuestionContainers:{
    padding:10
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
  navigationButtons: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginVertical: 15,
  paddingHorizontal: 20,
},
btnText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600",
  textAlign: "center",
},
  btn: {
    padding: 10,
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: 6,
  },
    natInput:{
    borderColor:'#ccc',
    borderWidth:1,
    width:'90%',
    height:40,
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
  NATInputHolder: {
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 15,
    display: 'flex', // optional in RN, flexDirection is sufficient
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16, // 1rem ≈ 16px
    gap: 4, // Note: `gap` support is limited in RN; needs manual spacing
    borderWidth: 2,
    borderColor: '#c5c0c0',
    shadowColor: '#000',
    shadowOffset: { width: 1.95, height: 1.95 },
    shadowOpacity: 0.2,
    shadowRadius: 2.6,
    elevation: 3, // Required for shadow to appear on Android
  },

  NATLabel: {
    width: 150,
    fontWeight: 'bold',
    display: 'flex', // optional
    marginBottom: 10,
  },

  backSpaceBtn: {
    display: 'flex',
    justifyContent: 'center',
    width: '85%',
    marginHorizontal: 'auto', // React Native doesn’t support 'auto' – may need to adjust manually
    margin: 10,
  },
  backSpaceButton: {
    width: '100%',
    padding: 5,
    fontSize: 16, // 'larger' in web ≈ 18px
    backgroundColor: '#d9d9d9',
    borderRadius: 10,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: 'darkgray',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Required for Android shadow
    textTransform: 'uppercase', // This works only in <Text />
    color: 'black', // Also for <Text />, not <View />
    alignItems: 'center',
    justifyContent: 'center',
  },

  backSpaceButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: 'black',
  },
  CalculatorBox: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10, 
    justifyContent: 'center',
    padding: 10,
  },

  calcButton: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: '#aaa',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#e4e4e4',
    color: 'black',
    shadowColor: '#000',
    shadowOffset: { width: 1.95, height: 1.95 },
    shadowOpacity: 0.2,
    shadowRadius: 2.6,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },

  arrowBtns: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 16, // Not fully supported; manage via spacing on children
  },

  arrowButton: {
    width: 45,
    height: 30,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    color: 'black',
  },

});
