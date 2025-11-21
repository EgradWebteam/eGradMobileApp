import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { backEndUrl, frontEndUrl } from "../apiConfig";
import LectureExerciseList from "./LectureExerciseList.jsx";
import Popup from "./ Popup.jsx";
import { useSession } from "../hooks/SessionContext.jsx";
const OrvlCourseTopic = ({
  topicid,
  onBack,
  studentId,
  courseCreationId,
  courseData,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showExercise, setShowExercise] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [exerciseMeta, setExerciseMeta] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [answerDisabled, setAnswerDisabled] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [solutionVideo, setSolutionVideo] = useState(null);
  const [solutionImage, setSolutionImage] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const playedTimeRef = useRef(0);
  const submittedStatusRef = useRef({});

  const { validateSession: contextValidateSession } = useSession();

  // ------------------------ CHECK ADMIN ROLE ------------------------
  useEffect(() => {
    const fetchAdminRole = async () => {
      try {
        const role = await AsyncStorage.getItem("adminRole");
        setIsAdmin(role === "admin");
      } catch (err) {
        console.error("Error fetching admin role", err);
      }
    };
    fetchAdminRole();
  }, []);

  const validateSession = isAdmin
    ? async () => true
    : contextValidateSession;

  // ------------------------ FETCH EXERCISE META ------------------------
  const fetchexerciseMeta = async () => {
    const exercise_name_id = selectedExercise?.exercise_name_id;
    if (!exercise_name_id) return;

    const params = new URLSearchParams({ exercise_name_id });

    const subject_id = courseData?.subject_id;
    const topic_id = courseData?.topic_id;
    const chapter_id = courseData?.chapter_id;
    const course_id = courseCreationId;

    if (subject_id) params.append("subject_id", subject_id);
    if (topic_id) params.append("topic_id", topic_id);
    if (chapter_id) params.append("chapter_id", chapter_id);
    if (studentId) params.append("student_registration_id", studentId);
    if (course_id) params.append("course_id", course_id);

    try {
      if (!isAdmin) {
        const response = await fetch(
          `${backEndUrl}/studentmycourses/GetExcerciseQuestionStatus?${params.toString()}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        const statusData = (await response.json()) || [];
        const meta = {};
        selectedExercise?.questions?.forEach((question) => {
          const qid = question.exercise_question_id;
          const record = statusData.find(
            (item) => item.exercise_question_id === qid
          );
          const status = record
            ? record.question_status === 1
              ? "answered"
              : record.question_status === 0
              ? "unanswered"
              : "unvisited"
            : "unvisited";

          meta[qid] = {
            status,
            answer_text: question.answer_text,
            response: record?.exercise_userresponse || "",
            videoSolution: question.video_solution_link || null,
            imageSolution: question.solution_img_name || null,
          };
        });
        setTimeout(() => setExerciseMeta(meta), 0);
      } else {
        const adminMeta = {};
        selectedExercise?.questions?.forEach((question) => {
          adminMeta[question.exercise_question_id] = {
            status: "unvisited",
            answer_text: question.answer_text,
            response: "",
            videoSolution: question.video_solution_link || null,
            imageSolution: question.solution_img_name || null,
          };
        });
        setTimeout(() => setExerciseMeta(adminMeta), 0);
      }
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedExercise?.exercise_name_id) fetchexerciseMeta();
  }, [courseData, selectedExercise, studentId, courseCreationId]);
useEffect(() => {
  if (selectedExercise) {
    const questionid =
      selectedExercise?.questions?.[currentQuestionIndex]
        ?.exercise_question_id;
    if (!questionid) return;

    if (exerciseMeta && typeof exerciseMeta === "object") {
      const meta = exerciseMeta[questionid];

      if (!meta || meta.status === "unvisited") {
        // Check if already submitted for this question to prevent repeated calls
        if (!submittedStatusRef.current[questionid]) {
          submitExerciseStatus(questionid);
          submittedStatusRef.current[questionid] = true;
        }
        setAnswerDisabled(false);
        setUserAnswer("");
        setFeedback(null);
        setSolutionVideo(null);
        setSolutionImage(null);
        setSelectedOptions([]);
      } else if (meta.status === "answered") {
        // Reset the submission flag so it can be submitted again if needed later
        submittedStatusRef.current[questionid] = false;

        
      const questionType =
          selectedExercise.questions[currentQuestionIndex].qtype_text;

        const correctAnswer = meta.answer_text || "";
        const userResponse = meta.response || "";

 if (questionType === "MSQ" || questionType === "MSQN") { 
  const response = meta.response;

  if (typeof response === "string" && response.length > 0) {
    const userAnsArray = response
      .split(",")
      .map(opt => opt.trim().toLowerCase()) // normalize to lowercase
      .sort();

    setSelectedOptions(userAnsArray);

    // Normalize correct answers
    const correctAnsArray = correctAnswer
      .split(",")
      .map(opt => opt.trim().toLowerCase()) // normalize to lowercase
      .sort();

    // Compare user response to correct answer
    const isCorrect =
      userAnsArray.length === correctAnsArray.length &&
      userAnsArray.every((val, index) => val === correctAnsArray[index]);

    setFeedback(
      isCorrect
        ? "Correct Answer"
        : `Wrong Answer. Correct: ${correctAnsArray.join(", ")}`
    );
  }
} else if (questionType === "NATD") {
  const userNum = parseFloat(userResponse?.trim());
const rangeMatch = (correctAnswer || '').match(/(-?\d*\.?\d+)\s*-\s*(-?\d*\.?\d+)/);
const min = rangeMatch ? parseFloat(rangeMatch[1]) : NaN;
const max = rangeMatch ? parseFloat(rangeMatch[2]) : NaN;


  setUserAnswer(userResponse);

  if (!isNaN(userNum) && !isNaN(min) && !isNaN(max)) {
    const isCorrect = userNum >= min && userNum <= max;

    setFeedback(
      isCorrect
        ? "Correct Answer"
        : `Wrong Answer. Correct Range: ${min} - ${max}`
    );
  } else {
    setFeedback("Invalid answer format or range.");
  }
} else {
  // Handle non-MSQ types with lowercase normalization too
  const normalizedUser = userResponse?.trim().toLowerCase() || "";
  const normalizedCorrect = correctAnswer?.trim().toLowerCase() || "";

  setUserAnswer(userResponse);

  setFeedback(
    normalizedUser === normalizedCorrect
      ? "Correct Answer"
      : `Wrong Answer. Correct: ${correctAnswer}`
  );
}

       if(meta.videoSolution) {setSolutionVideo(meta.videoSolution || null);}
       if(meta.imageSolution) {setSolutionImage(meta.imageSolution || null);}

        setAnswerDisabled(true);
      } else {
        submittedStatusRef.current[questionid] = false;

        setAnswerDisabled(false);
        setUserAnswer("");
        setFeedback(null);
        setSolutionVideo(null);
        setSolutionImage(null);
        setSelectedOptions([]);
      }
    }
  }
}, [selectedExercise, currentQuestionIndex, exerciseMeta]);


  // ------------------------ SUBMIT EXERCISE STATUS ------------------------
  const submitExerciseStatus = async (questionid) => {
    const updatedMeta = {
      ...exerciseMeta,
      [questionid]: {
        ...exerciseMeta[questionid],
        status: "unanswered",
        response: "",
      },
    };
    setExerciseMeta(updatedMeta);

    if (isAdmin || !studentId || !courseCreationId) {
      console.warn(
        "🛑 Submission skipped: missing courseId or studentId (admin/preview mode)."
      );
      return;
    }

    const payload = {
      question_status: 0,
      exercise_question_id: questionid,
      exercise_name_id: selectedExercise.exercise_name_id,
      student_registration_id: studentId,
      course_id: courseCreationId,
      topic_id: courseData.topic_id,
      chapter_id: courseData.chapter_id,
      subject_id: courseData.subject_id,
    };

    try {
      const response = await fetch(
        `${backEndUrl}/studentmycourses/ExerciseQuestionstatus`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log("Exercise status submitted:", data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to submit exercise status.");
    }
  };

  // ------------------------ HANDLERS ------------------------
  const handleLectureClick = async (lecture) => {
    const isValid = await validateSession();
    if (!isValid) return;
    setSelectedLecture(lecture);
    setSelectedExercise(null);
    setShowExercise(false);
    setShowPopup(true);
  };

  const handleExerciseClick = async (exercise) => {
    const isValid = await validateSession();
    if (!isValid) return;

    const parentLecture = courseData.lectures.find((lecture) =>
      lecture.exercises.some((ex) => ex.exercise_name === exercise.exercise_name)
    );

    if (parentLecture) {
      setSelectedLecture(parentLecture);
      setCurrentQuestionIndex(0);
      setSelectedExercise(exercise);
      setShowExercise(true);
      setShowPopup(true);
    } else console.error("Parent lecture not found for exercise.");
  };

  const handleClosePopup = async () => {
    const isValid = await validateSession();
    if (!isValid) return;
    setSelectedLecture(null);
    setSelectedExercise(null);
    setShowPopup(false);
  };

  // ------------------------ NAVIGATION ------------------------
 const nextLectureOrExercise = async () => {
  const isValid = await validateSession();
  if (!isValid) return;

  if (!courseData || !selectedLecture) return;

  const currentLectureIndex = courseData.lectures.findIndex(
    (lecture) => lecture.orvl_lecture_name_id === selectedLecture.orvl_lecture_name_id
  );

  const currentLecture = courseData.lectures[currentLectureIndex];
  const exercises = currentLecture.exercises;

  if (!showExercise) {
    // On lecture
    if (exercises && exercises.length > 0) {
      setSelectedExercise(exercises[0]);
      setShowExercise(true);
      setCurrentQuestionIndex(0);
    } else {
      // No exercises → next lecture
      const nextLecture = courseData.lectures[currentLectureIndex + 1];
      if (nextLecture) {
        setSelectedLecture(nextLecture);
        setSelectedExercise(null);
        setShowExercise(false);
      } else {
        alert("You're already at the last lecture.");
      }
    }
  } else {
    // On an exercise
    const currentExerciseIndex = exercises.findIndex(
      (ex) => ex.exercise_name_id === selectedExercise.exercise_name_id
    );

    if (currentExerciseIndex < exercises.length - 1) {
      setSelectedExercise(exercises[currentExerciseIndex + 1]);
      setCurrentQuestionIndex(0);
    } else {
      // Move to next lecture
      const nextLecture = courseData.lectures[currentLectureIndex + 1];
      if (nextLecture) {
        setSelectedLecture(nextLecture);
        setSelectedExercise(null);
        setShowExercise(false);
      } else {
        alert("You're already at the last lecture.");
      }
    }
  }
};

  const previousLectureOrExercise = async() => {
  const isValid = await validateSession();
    if (!isValid) return;
  if (!courseData || !selectedLecture) return;

  const currentLectureIndex = courseData.lectures.findIndex(
    (lecture) =>
      lecture.orvl_lecture_name_id === selectedLecture.orvl_lecture_name_id
  );

  const currentLecture = courseData.lectures[currentLectureIndex];
  const exercises = currentLecture.exercises;

  if (showExercise && selectedExercise) {
    // ✅ Case 1: On an exercise
    const currentExerciseIndex = exercises.findIndex(
      (ex) => ex.exercise_name_id === selectedExercise.exercise_name_id
    );

    if (currentExerciseIndex > 0) {
      // Go to previous exercise
      setSelectedExercise(exercises[currentExerciseIndex - 1]);
      setCurrentQuestionIndex(0);
    } else {
      // First exercise → go back to lecture
      setShowExercise(false);
      setSelectedExercise(null);
    }
  } else {
    // ✅ Case 2: On lecture → go to previous lecture
    const previousLecture = courseData.lectures[currentLectureIndex - 1];

    if (previousLecture) {
      setSelectedLecture(previousLecture);

      if (previousLecture.exercises.length > 0) {
        // Previous lecture has exercises → go to last one
        const lastExercise = previousLecture.exercises[previousLecture.exercises.length - 1];
        setSelectedExercise(lastExercise);
        setShowExercise(true);
        setCurrentQuestionIndex(0);
      } else {
        // No exercises → just show lecture
        setSelectedExercise(null);
        setShowExercise(false);
      }
    } else {
      alert("You're already at the first lecture.");
    }
  }
};

  // ------------------------ RENDER ------------------------
  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>{error.message || error}</Text>;

  return (
    <View style={styles.container}>
      {!showPopup && (
        <TouchableOpacity style={styles.goBackBtn} onPress={onBack}>
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      )}
      {!showPopup && (
        <View style={styles.header}>
          <Text style={styles.chapterName}>{courseData.chapter_name}</Text>
        </View>
      )}
      <View style={styles.content}>
        {showPopup ? (
          <Popup
          lecture={selectedLecture}
          userAnswer={userAnswer}
          setUserAnswer={setUserAnswer}          
          answerDisabled={answerDisabled}  
          setAnswerDisabled = {setAnswerDisabled}      
          feedback={feedback}
          setFeedback={setFeedback}
          exercise={selectedExercise}
          setExerciseMeta={setExerciseMeta}
          onClose={handleClosePopup}
          fetchExerciseStatus={fetchexerciseMeta}
          topic_id={courseData.topic_id}
          subject_id={courseData.subject_id}
          chapter_id={courseData.chapter_id}
          currentQuestionIndex={currentQuestionIndex}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          exerciseMeta ={exerciseMeta}
          previousLectureOrExercise={previousLectureOrExercise}
          nextLectureOrExercise={nextLectureOrExercise}
          studentId = {studentId}
          course_id = {courseCreationId}
          solutionVideo={solutionVideo}
          solutionImage={solutionImage}
          playedTimeRef={playedTimeRef}
          selectedOptions={selectedOptions}
          setSelectedOptions ={setSelectedOptions}
          showExercise={showExercise}
          />
        ) : (
          <LectureExerciseList
           topicid={topicid}
            lectures={courseData.lectures}
            onLectureClick={handleLectureClick}
            onExerciseClick={handleExerciseClick}
            // userStatus={userStatus}
            StudyMaterial={courseData.StudyMaterial}
            chapter_id={courseData.chapter_id}
            chapter_name = {courseData.chapter_name}
            study_material_id={courseData.study_material_id}
            chapter_study_material_pdf_count={courseData.chapter_study_material_pdf_count}
          
          />
        )}
      </View>
    </View>
  );
};

export default OrvlCourseTopic;

// ------------------------ STYLES ------------------------
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  chapterName: { fontSize: 20, fontWeight: "bold" },
  content: { flex: 1 },
});
