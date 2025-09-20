import React, { useRef, useState, useEffect } from "react";
import { View, Text, ScrollView, Alert, BackHandler, StyleSheet } from "react-native";
import OTSHeader from "../components/OTSFolder/OTSHeader.jsx";
import { styles } from "../styles/OTSStyles.js";
import Toast from "react-native-toast-message";
// import DisableKeysAndMouseInteractions from "../ContextFolder/DisableKeysAndMouseInteractions.jsx";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useStudent } from "../hooks/StudentContext.jsx";
import axios from "axios";
import { backEndUrl } from "../apiConfig.js";
import { decryptBatch } from "../utils/CryptoUtils.jsx";
import PraticeQuestionSection from "../components/PQBFolder/PraticeQuestionSection.jsx";
import PraticeSummaryModal from "../components/PQBFolder/PraticeSummaryModal.jsx";
// import PraticeQuestionSidebar from "../components/PQBFolder/PraticeQuestionSidebar.jsx";
import Icon from 'react-native-vector-icons/AntDesign'; // Adjust based on the icon you're using

// import { useSession } from "../hooks/SessionContext.jsx";
// import { closeTestWindowIfOpen } from "../ContextFolder/windowManager.jsx";
import AsyncStorage from '@react-native-async-storage/async-storage';

const PracticeScreen = () => {
//   DisableKeysAndMouseInteractions();
  const navigation = useNavigation();
  const route = useRoute();
  const { testId, studentId, courseId } = route.params || {};
  const [isLoading, setIsLoading] = useState(false);
  const realTestId = useRef(null);
  const [practiceQuestionsData, setPracticeQuestionsData] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [natAnswers, setNatAnswers] = useState({});
  const [cursorPos, setCursorPos] = useState({});
  const [activeSubjectIdx, setActiveSubjectIdx] = useState(0);
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [showSolution, setShowSolution] = useState({});
  const [showScientificCalc, setShowScientificCalc] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCustomPopup, setShowCustomPopup] = useState(false);
  const [showSolutionModal, setShowSolutionModal] = useState(false);
console.log(answeredQuestions)
//   const pressedKeys = useRef(new Set());
  const [summary, setSummary] = useState({
    correct: 0,
    incorrect: 0,
    unattempted: 0,
    partial: 0,
    accuracy: 0,
  });
  const isSessionCheckInProgress = useRef(false);
  const [startTime, setStartTime] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
//   const logoutHandledRef = useRef(false);
  const { studentData } = useStudent();
  const userData = studentData?.userDetails;
  const studentProfile = userData?.uploaded_photo;
  const studentName = userData?.candidate_name;
//   const { validateSessionWithoutNavigation } = useSession();
  const storageKey = `practiceTest_${testId}_${studentId}`;

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  // useEffect(() => {
  //   const checkNavigationToken = async () => {
  //     const token = await AsyncStorage.getItem("practicenavigationToken");
  //     if (!token) {
  //       navigation.navigate("Error");
  //     }
  //   };

  //   checkNavigationToken();

  //   // BackHandler to prevent back navigation if needed
  //   const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
  //     // Disable back button or handle accordingly
  //     return true;
  //   });

  //   return () => backHandler.remove();
  // }, [navigation]);

  useEffect(() => {
    const decryptParams = async () => {
      try {
        setIsLoading(true);
        const encryptedValues = [];

        if (testId) encryptedValues.push(testId);
        if (studentId) encryptedValues.push(studentId);
        if (courseId) encryptedValues.push(courseId);

        if (encryptedValues.length > 0) {
          const decryptedArray = await decryptBatch(encryptedValues);
          realTestId.current = decryptedArray[0];
          await fetchQuestions(decryptedArray[0]);
        } else {
          console.error("No encrypted parameters found");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Decryption failed:", error);
      }
    };

    decryptParams();
  }, [testId, studentId, courseId]);

  const fetchQuestions = async (decryptedTestId) => {
    try {
      if (!decryptedTestId) return;

      const token = await AsyncStorage.getItem("accessToken");

      if (!token) {
        Alert.alert("Authentication required", "Please login to continue.");
        navigation.navigate("Login");
        return;
      }

      const response = await axios.get(
        `${backEndUrl}/OTSTestPaper/QuestionPaper_WithoutExtra/${decryptedTestId}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      if (response.data?.subjects?.length > 0) {
        setPracticeQuestionsData(response.data);

        const initialAnswered = {};
        response.data.subjects.forEach((subject) => {
          subject.sections.forEach((section) => {
            section.questions.forEach((question) => {
              initialAnswered[question.question_id] = null;
            });
          });
        });

        setAnsweredQuestions(initialAnswered);
        loadSavedData(initialAnswered);
      } else {
        console.error("No questions available for this test");
      }
    } catch (err) {
      console.error("Error fetching practice questions:", err);
      Alert.alert("Error", "Failed to load questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSavedData = async (initialAnswered) => {
    try {
      const savedData = await AsyncStorage.getItem(storageKey);

      if (savedData) {
        const parsedData = JSON.parse(savedData);

        const mergedAnswered = {
          ...initialAnswered,
          ...(parsedData.answeredQuestions || {}),
        };

        setAnsweredQuestions(mergedAnswered);
        setSelectedOption(parsedData.selectedOption || {});
        setNatAnswers(parsedData.natAnswers || {});
        setCurrentQuestionIdx(parsedData.currentQuestionIdx || 0);
        setActiveSubjectIdx(parsedData.activeSubjectIdx || 0);
        setActiveSectionIdx(parsedData.activeSectionIdx || 0);

        if (parsedData.startTime) {
          setStartTime(parsedData.startTime);
          setTimeSpent(parsedData.timeSpent || 0);
        } else {
          const newStartTime = Date.now();
          setStartTime(newStartTime);
          setTimeSpent(0);
        }

        if (parsedData.isSubmitted) {
          setIsSubmitted(true);
          setSummary(parsedData.summary || {});
        } else {
          setIsSubmitted(false);
        }
      } else {
        const newStartTime = Date.now();
        setStartTime(newStartTime);
        setTimeSpent(0);
        setIsSubmitted(false);
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
      await AsyncStorage.removeItem(storageKey);
      const newStartTime = Date.now();
      setStartTime(newStartTime);
      setTimeSpent(0);
      setIsSubmitted(false);
    }
  };

  useEffect(() => {
    const saveData = async () => {
      const dataToSave = {
        selectedOption,
        natAnswers,
        answeredQuestions,
        currentQuestionIdx,
        activeSubjectIdx,
        activeSectionIdx,
        startTime,
        timeSpent,
        isSubmitted,
        summary,
        timestamp: Date.now(),
      };

      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(dataToSave));
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };

    const timeoutId = setTimeout(saveData, 500);
    return () => clearTimeout(timeoutId);
  }, [
    selectedOption,
    natAnswers,
    answeredQuestions,
    currentQuestionIdx,
    activeSubjectIdx,
    activeSectionIdx,
    startTime,
    timeSpent,
    isSubmitted,
    summary,
    storageKey,
  ]);
useEffect(() => {
  if (!startTime || isSubmitted) return;
console.log(answeredQuestions)
  const timer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    setTimeSpent(elapsed);
  }, 1000);

  return () => clearInterval(timer);
}, [startTime, isSubmitted]);

  const getCurrentTest = () => practiceQuestionsData || {};
  const getCurrentSubject = () =>
    getCurrentTest()?.subjects?.[activeSubjectIdx] || null;
  const getCurrentSections = () => getCurrentSubject()?.sections || [];
  const getCurrentSection = () =>
    getCurrentSections()[activeSectionIdx] || { questions: [] };
  const getCurrentQuestion = () =>
    getCurrentSection()?.questions?.[currentQuestionIdx] || null;
  const getCurrentSubjects = () => {
    const currentTest = getCurrentTest();
    return currentTest?.subjects || [];
  };

  const handleSubjectChange = (idx) => {
    setActiveSubjectIdx(idx);
    setActiveSectionIdx(0);
    setCurrentQuestionIdx(0);
  };

  const handleSectionChange = (idx) => {
    setActiveSectionIdx(idx);
    setCurrentQuestionIdx(0);
  };

  const goToQuestion = (newIndex) => {
    const currentSectionQuestions = getCurrentSection()?.questions || [];
    const currentQ = currentSectionQuestions[currentQuestionIdx];

    if (!currentQ) return;

    const qId = currentQ.question_id;

    if (!answeredQuestions[qId]) {
      setSelectedOption((prev) => {
        const updated = { ...prev };
        delete updated[qId];
        return updated;
      });

      setNatAnswers((prev) => {
        const updated = { ...prev };
        delete updated[qId];
        return updated;
      });
    }

    setCurrentQuestionIdx(newIndex);
  };

  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  const toggleCalculator = () => {
    setShowScientificCalc((prev) => !prev);
  };

  const calculatePerfForEntity = (questions = []) => {
    let correct = 0,
      incorrect = 0,
      unattempted = 0,
      partial = 0;

    questions.forEach((q) => {
      const qId = q.question_id;
      const status = answeredQuestions[qId];
      const qtype = q.questionType?.qtype_text;

      if (qtype === "MSQ" || qtype === "MSQN") {
        if (
          !status ||
          (!status.correctSelected?.length && !status.wrong?.length)
        ) {
          unattempted++;
        } else if (status.status === "completed") {
          correct++;
        } else if (status.status === "failed") {
          incorrect++;
        } else if (
          status.status === "partial" &&
          status.correctSelected?.length > 0
        ) {
          partial++;
        }
      } else {
        if (status === "correct") correct++;
        else if (status === "incorrect") incorrect++;
        else unattempted++;
      }
    });

    return { correct, incorrect, unattempted, partial };
  };

  const calculateLivePerformance = () => {
    const subj = getCurrentSubject();
    if (!subj) return { correct: 0, incorrect: 0, unattempted: 0, partial: 0 };

    if (subj.sections && subj.sections.length > 0) {
      const sec = getCurrentSection();
      if (!sec) return { correct: 0, incorrect: 0, unattempted: 0, partial: 0 };

      return calculatePerfForEntity(sec.questions);
    }

    return calculatePerfForEntity(subj.questions);
  };
  const perf = calculateLivePerformance();

  const handleWithSession = (callback) => {
    return async (...args) => {
      // if (isSessionCheckInProgress.current) {
      //   console.log("Session validation in progress, ignoring duplicate click...");
      //   return;
      // }

      // isSessionCheckInProgress.current = true;

      try {
        // const isValid = await validateSessionWithoutNavigation();

        // if (!isValid) {
        //   try {
        //     closeTestWindowIfOpen();
        //   } catch (e) {
        //     console.log("Cannot close window:", e);
        //   }
        //   return;
        // }

        callback(...args);
      } catch (err) {
        console.error("Session validation error:", err);
      } finally {
        isSessionCheckInProgress.current = false;
      }
    };
  };

  const handleFinalSubmit = () => {
    const test = getCurrentTest();
    let correct = 0,
      incorrect = 0,
      unattempted = 0,
      partial = 0;
    let totalQuestions = 0;
    let totalAccuracyPoints = 0;

    test?.subjects?.forEach((subj) => {
      subj.sections?.forEach((sec) => {
        sec.questions?.forEach((q) => {
          totalQuestions++;
          const qId = q.question_id;
          const status = answeredQuestions[qId];
          const qtype = q.questionType?.qtype_text;

          if (
            !status ||
            (qtype === "MCQ" && selectedOption[qId] === undefined) ||
            (qtype === "MSQ" &&
              (!selectedOption[qId] || selectedOption[qId].length === 0)) ||
            (qtype.startsWith("NAT") &&
              (!natAnswers[qId] || natAnswers[qId].trim() === ""))
          ) {
            unattempted++;
            return;
          }

          if (
            qtype === "MCQ" ||
            qtype === "MCQ4" ||
            qtype === "CTQ" ||
            qtype === "MCQ5" ||
            qtype === "TF" ||
            qtype === "NATI" ||
            qtype === "NATD"
          ) {
            if (status === "correct") {
              correct++;
              totalAccuracyPoints += 1;
            } else {
              incorrect++;
            }
            return;
          }

          if (qtype === "MSQ") {
            if (status.status === "completed") {
              correct++;
              totalAccuracyPoints += 1;
            } else if (status.status === "failed") {
              incorrect++;
            } else if (status.status === "partial") {
              partial++;
              totalAccuracyPoints += 0.5;
            }
            return;
          }

          if (qtype === "MSQN") {
            if (status.status === "completed") {
              correct++;
              totalAccuracyPoints += 1;
            } else if (status.status === "failed") {
              incorrect++;
            } else if (status.status === "partial") {
              partial++;
              totalAccuracyPoints += status.accuracy;
            }
          }
        });
      });
    });

    const attemptedQuestions = totalQuestions - unattempted;
    const accuracyScore =
      attemptedQuestions > 0
        ? ((totalAccuracyPoints / attemptedQuestions) * 100).toFixed(2)
        : 0;

    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    const timeSpentFormatted = `${minutes}m ${seconds}s`;

    const finalSummary = {
      correct,
      incorrect,
      partial,
      unattempted,
      accuracy: accuracyScore,
      timeSpent: timeSpentFormatted,
      timeSpentMinutes: minutes,
      idealTimeMinutes: 60,
    };

    setSummary(finalSummary);
    setIsSubmitted(true);

    const dataToSave = {
      answeredQuestions,
      selectedOption,
      natAnswers,
      currentQuestionIdx,
      activeSubjectIdx,
      activeSectionIdx,
      startTime,
      timeSpent,
      isSubmitted: true,
      summary: finalSummary,
    };

    AsyncStorage.setItem(storageKey, JSON.stringify(dataToSave));
  };

  return (
    <View style={styles.container}>
      <OTSHeader />
          <View style={styles.OTSNavbarMainContainer}>
      <View style={styles.OTSTestNameHolder}>
        <Text style={styles.testNameText}>{getCurrentTest()?.TestName}</Text>
      </View>
      <View style={styles.timerWrapper}>
        <Icon name="clockcircle" style={styles.clockIcon} />
        <Text style={styles.timerText}>{formatTime(timeSpent)}</Text>
      </View>
    </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
 <PraticeQuestionSection
              practiceQuestionsData={practiceQuestionsData}
              activeSubjectIdx={activeSubjectIdx}
              activeSectionIdx={activeSectionIdx}
              currentQuestionIdx={currentQuestionIdx}
              selectedOption={selectedOption}
              natAnswers={natAnswers}
              answeredQuestions={answeredQuestions}
              showSolution={showSolution}
              showScientificCalc={showScientificCalc}
              cursorPos={cursorPos}
              onSubjectChange={handleSubjectChange}
              onSectionChange={handleSectionChange}
              onQuestionChange={goToQuestion}
              onToggleCalculator={toggleCalculator}
              onSetSelectedOption={setSelectedOption}
              onSetNatAnswers={setNatAnswers}
              onSetAnsweredQuestions={setAnsweredQuestions}
              onSetShowSolution={setShowSolution}
              onSetCursorPos={setCursorPos}
              onSetCurrentQuestionIdx={setCurrentQuestionIdx}
              OptionPatternId={practiceQuestionsData?.opt_pattern_id}
              onFinalSubmit={handleFinalSubmit}
              getCurrentSubjects={getCurrentSubjects}
              getCurrentSections={getCurrentSections}
              getCurrentSection={getCurrentSection}
              getCurrentQuestion={getCurrentQuestion}
              handleWithSession={handleWithSession}
              storageKey={storageKey}
               showSidebar={showSidebar}
               showSolutionModal={showSolutionModal}
               setShowSolutionModal={setShowSolutionModal}
            />

            {/* <PraticeQuestionSidebar
              showSidebar={showSidebar}
              studentProfile={studentProfile}
              studentName={studentName}
              performance={perf}
              currentSection={getCurrentSection()}
              currentSubjects={getCurrentSubject()}
              currentSections={getCurrentSections()}
              currentQuestionIdx={currentQuestionIdx}
              answeredQuestions={answeredQuestions}
              onQuestionChange={goToQuestion}
              onToggleSidebar={toggleSidebar}
              timeSpent={timeSpent}
              handleWithSession={handleWithSession}
              storageKey={storageKey}
            /> */}
        {isSubmitted && (
          <PraticeSummaryModal
          visible={isSubmitted}
          summary={summary}
            currentSection={getCurrentSection()}
            answeredQuestions={answeredQuestions}
            onAttemptNow={() => {
              setIsSubmitted(false);
              const section = getCurrentSection();
              let firstIdx = -1;

              if (summary.unattempted > 0) {
                firstIdx = section.questions.findIndex(
                  (q) => !answeredQuestions[q.question_id]
                );
              } else if (summary.partial > 0) {
                firstIdx = section.questions.findIndex(
                  (q) => answeredQuestions[q.question_id]?.status === "partial"
                );
              }

              if (firstIdx !== -1) {
                setCurrentQuestionIdx(firstIdx);
              }
            }}
            onClose={() => window.close()}
            storageKey={storageKey}
          />
        )}
        {showCustomPopup && (
          <View style={styles.popup}>
            <Text style={styles.warningTitle}>Warning!</Text>
            <Text style={styles.warningText}>
              Pressing any function keys or other keys are not allowed. Press OK to continue.
            </Text>
            <Text onPress={() => setShowCustomPopup(false)} style={[styles.buttonText, {textAlign: 'center', padding: 10, backgroundColor: '#007AFF', borderRadius: 5}]}>OK</Text>
          </View>
        )}
      </ScrollView>
      <Toast />
    </View>
  );
};

export default PracticeScreen;
