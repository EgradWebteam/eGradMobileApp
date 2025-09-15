import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, ActivityIndicator,ScrollView } from "react-native";
import QuestionStatusProvider, { useQuestionStatus } from "../../hooks/CountsContext";
import { useTimer } from "../../hooks/TimerContext.jsx";


import { backEndUrl, frontEndUrl,backEndPort } from "../../apiConfig";
import { styles } from '../../styles/OTSStyles';
import OTSExamSummary from "./OTSExamSummary.jsx";
// import { useSession } from "../../StudentDashboard/hooks/SessionContext.jsx";
import AsyncStorage from '@react-native-async-storage/async-storage';
const QuestionNavigationButtons = ({
  testData,
  activeSubject,
  activeSection,
  activeQuestionIndex,
  setActiveQuestionIndex,
  userAnswers,
  setUserAnswers,
  selectedOption,
  selectedOptionsArray,
  natValue,
  setActiveSubject,
  setActiveSection,
  setSelectedOptionsArray,
  setNatValue,
  getElapsedTimeForCurrentQuestion,
  setSelectedOption,
  realStudentId,
  realTestId,
  realCourseId,
  hasBonus,
  setTestPaperData,
  setSelectedSubjects,
  normalTestData,
  fullTestData,
  setFullTestData,
  isDisabled,
  setIsBonusLoaded,
  autoSaveNATIfNeeded,
  isBonusLoaded,
  setResumeTime,
}) => {
  const {
    answeredCount,
    answeredAndMarkedForReviewCount,
    markedForReviewCount,
    notAnsweredCount,
    notVisitedCount,
    visitedCount,
    totalQuestionsInTest,
  } = useQuestionStatus();
//   const { validateSessionWithoutNavigation } = useSession();
  const [showBonusConfirmPopup, setShowBonusConfirmPopup] = useState(false);
  const { timeSpent, timeLeft } = useTimer();
  const [isSaving, setIsSaving] = useState(false);
  const [isExtraStarted, setIsExtraStarted] = useState(false);

  useEffect(() => {
    const subject = testData?.subjects?.find(
      (sub) => sub.SubjectName === activeSubject
    );
    const section = subject?.sections?.find(
      (sec) => sec.SectionName === activeSection
    );
    const question = section?.questions?.[activeQuestionIndex];
    if (!question) return;

    const qid = question.question_id;
    const answer = userAnswers?.[qid];

    if (!answer) return;

    if (answer?.type === "MCQ" || answer?.type === "CTQ") {
      setSelectedOption({ option_index: answer.optionIndex });
    } else if (answer?.type === "MSQ") {
      setSelectedOptionsArray(answer.selectedOptions || []);
    } else if (answer?.type === "NAT") {
      setNatValue(answer.natAnswer || "");
    }
  }, [activeSubject, activeSection, activeQuestionIndex]);

  useEffect(() => {
    const fetchExtraStatus = async () => {
      try {
        const res = await fetch(`${backEndUrl}/OTSTestPaper/isExtraStarted`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_registration_id: realStudentId,
            test_id: realTestId,
            course_id: realCourseId,
          }),
        });
        const data = await res.json();
        console.log("is_extra_started:", data.is_extra_started);
        setIsExtraStarted(data.is_extra_started);
        // if (data.is_extra_started) {
        //   handleConfirmExtraQuestions();
        // } else {
        //   console.log("this test do not have the extra status");
        // }
      } catch (error) {
        console.error("Failed to fetch extra status:", error);
      }
    };
    fetchExtraStatus();
  }, []);

  const navigateToNext = (subject, section, activeQuestionIndex) => {
    const totalQuestions = section?.questions?.length || 0;
    const isLastQuestion = activeQuestionIndex === totalQuestions - 1;

    if (!isLastQuestion) {
      setActiveQuestionIndex((prev) => prev + 1);
    } else {
      const currentSectionIndex = subject.sections.findIndex(
        (sec) => sec.SectionName === activeSection
      );
      const nextSection = subject.sections[currentSectionIndex + 1];

      if (nextSection) {
        setActiveSection(nextSection.SectionName);
        setActiveQuestionIndex(0);
      } else {
        const currentSubjectIndex = testData.subjects.findIndex(
          (sub) => sub.SubjectName === activeSubject
        );
        const nextSubject = testData.subjects[currentSubjectIndex + 1];

        if (nextSubject) {
          setActiveSubject(nextSubject.SubjectName);
          setActiveSection(nextSubject.sections?.[0]?.SectionName || null);
          setActiveQuestionIndex(0);
        } else {
          setActiveSubject(testData.subjects[0]?.SubjectName);
          setActiveSection(
            testData.subjects[0]?.sections?.[0]?.SectionName || null
          );
          setActiveQuestionIndex(0);
        }
      }
    }
  };
  const saveUserResponse = async ({
  realStudentId,
  realTestId,
  realCourseId,
  subject_id,
  section_id,
  question_id,
  TimeSpentOnQuestion,
  question_type_id,
  optionIndexes1 = "",
  optionIndexes2 = "",
  optionIndexes1CharCodes = [],
  optionIndexes2CharCodes = [],
  calculatorInputValue = "",
  answered = "1", // default answered status
}) => {
  if (!realStudentId || !realTestId || !realCourseId) {
    console.warn("Missing required IDs for saveUserResponse.");
    return { success: false, message: "Missing IDs" };
  }

  const payload = {
    realStudentId,
    realTestId,
    realCourseId,
    subject_id,
    section_id,
    questionId: question_id,
    questionTypeId: question_type_id,
    optionIndexes1,
    optionIndexes2,
    optionIndexes1CharCodes,
    optionIndexes2CharCodes,
    calculatorInputValue,
    answered,
    TimeSpentOnQuestion,
  };

  try {
    const response = await fetch(`${backEndUrl}/OTSTestPaper/SaveResponse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to save response");
    }

    return await response.json();
  } catch (error) {
    console.error("saveUserResponse error:", error.message);
    return { success: false, message: error.message || "Network error" };
  }
};
const isAnswerActuallyChanged = (prev = {}, current = {}) => {
  if (prev.buttonClass !== current.buttonClass) return true;

  switch (current.type) {
    case "MCQ":
    case "CTQ":
      return String(prev.optionId) !== String(current.optionId);

    case "MSQ":
      // Sort once to prevent false negatives due to order change
      const prevSorted = Array.isArray(prev.selectedOptions)
        ? [...prev.selectedOptions].sort()
        : [];
      const currSorted = Array.isArray(current.selectedOptions)
        ? [...current.selectedOptions].sort()
        : [];
      return JSON.stringify(prevSorted) !== JSON.stringify(currSorted);

    case "NAT":
      return String((prev.natAnswer || "").trim()) !== String((current.natAnswer || "").trim());

    default:
      return false;
  }
};
const prepareSavedData = ({
  question,
  qTypeId,
  selectedOption,
  selectedOptionsArray,
  natValue,
  styles,
  timeSpent,
  buttonClass,
}) => {
  let buttonClassvalue = buttonClass || `NotAnsweredBtnCls`;

  let savedData = {
    subjectId: question.subjectId,
    sectionId: question.sectionId,
    questionId: question.question_id,
    type: "",
    buttonClass:buttonClassvalue,
  };

  let optionIndexesStr = "";
  let optionCharCodes = [];
  let calcVal = "";

  if ([1, 2, 8].includes(qTypeId) && selectedOption?.option_index) {
    optionIndexesStr = selectedOption.option_index;
    const matchedOption = question.options.find(
      (opt) => opt.option_index === selectedOption.option_index
    );
    optionCharCodes = matchedOption ? [matchedOption.option_id] : [];

    const questionTypeLabel = qTypeId === 8 ? "CTQ" : "MCQ";

    savedData = {
      ...savedData,
      optionId: matchedOption?.option_id,
      optionIndex: selectedOption.option_index,
      buttonClass,
      TimeSpentOnQuestion: timeSpent,
      type: questionTypeLabel,
    };
  } else if (
    [3, 4].includes(qTypeId) &&
    Array.isArray(selectedOptionsArray) &&
    selectedOptionsArray.length > 0
  ) {
    optionIndexesStr = selectedOptionsArray.join(",");
    optionCharCodes = selectedOptionsArray
      .map((optIndex) => {
        const match = question.options.find((qOpt) => qOpt.option_index === optIndex);
        return match?.option_id;
      })
      .filter(Boolean);

    savedData = {
      ...savedData,
      selectedOptions: selectedOptionsArray,
      buttonClass,
      TimeSpentOnQuestion: timeSpent,
      type: "MSQ",
    };
  } else if ([5, 6].includes(qTypeId) && natValue?.trim() !== "") {
    calcVal = natValue;
    savedData = {
      ...savedData,
      natAnswer: natValue,
      buttonClass,
      TimeSpentOnQuestion: timeSpent,
      type: "NAT",
    };
  } else {
    // Not answered fallback
    savedData = {
      ...savedData,
      buttonClass,
      TimeSpentOnQuestion: timeSpent,
      type: "",
    };
  }

  return { savedData, optionIndexesStr, optionCharCodes, calcVal };
};

const addNextQuestionToState = ({
  section,
  activeQuestionIndex,
  subjectId,
  sectionId,
  userAnswers,
  setUserAnswers,
  styles,
  realStudentId,
  realTestId,
  realCourseId,
}) => {
  const nextQuestion = section?.questions?.[activeQuestionIndex + 1];
  const nextQid = nextQuestion?.question_id;
  const totalQuestions = section?.questions?.length || 0;

  setUserAnswers((prev) => {
    const updated = { ...prev };

    if (
      nextQuestion &&
      activeQuestionIndex < totalQuestions - 1 &&
      !prev[nextQid]
    ) {
      updated[nextQid] = {
        subjectId,
        sectionId,
        questionId: nextQid,
        buttonClass: `NotAnsweredBtnCls`,
        type: "",
      };

      if (realStudentId && realTestId && realCourseId) {
        saveUserResponse({
          realStudentId,
          realTestId,
          realCourseId,
          subject_id: subjectId,
          section_id: sectionId,
          question_id: nextQid,
          question_type_id: nextQuestion?.questionType?.quesionTypeId || null,
          optionIndexes1: "",
          optionIndexes1CharCodes: [],
          calculatorInputValue: "",
          answered: "3", // Not Answered
        });
      }
    }

    return updated;
  });
};
const handleSaveAndNext = async () => {
//   const isValid = await validateSessionWithoutNavigation();
//   if (!isValid) {
    // window.close();
    // return;
//   }

  setIsSaving(true);
  try {
    const subject = testData?.subjects?.find((sub) => sub.SubjectName === activeSubject);
    const section = subject?.sections?.find((sec) => sec.SectionName === activeSection);
    const question = section?.questions?.[activeQuestionIndex];
    if (!question) return;

    const qid = question.question_id;
    const subjectId = subject.subjectId;
    const sectionId = section.sectionId;
    const qTypeId = question?.questionType?.quesionTypeId;
    const existingAnswer = userAnswers?.[qid];
    const timeLimitPerQuestion = getElapsedTimeForCurrentQuestion();
    const timeSpent = timeLimitPerQuestion + (existingAnswer?.TimeSpentOnQuestion ?? 0);

    // Prepare data for save
    const { savedData, optionIndexesStr, optionCharCodes, calcVal } = prepareSavedData({
      question: { ...question, subjectId, sectionId },
      qTypeId,
      selectedOption,
      selectedOptionsArray,
      natValue,
      styles,
      timeSpent,
      buttonClass:(
    ([1, 2, 8].includes(qTypeId) && selectedOption?.option_index) ||
    ([3, 4, 7].includes(qTypeId) && Array.isArray(selectedOptionsArray) && selectedOptionsArray.length > 0) ||
    ([5, 6].includes(qTypeId) && typeof natValue === 'string' && natValue.trim() !== '')
      ? 'AnswerdBtnCls'
      : 'NotAnsweredBtnCls'
  )
});

    // Update user answers and add next question if needed
    setUserAnswers((prev) => ({ ...prev, [qid]: savedData }));
    addNextQuestionToState({
      section,
      activeQuestionIndex,
      subjectId,
      sectionId,
      userAnswers,
      setUserAnswers,
      styles,
      realStudentId,
      realTestId,
      realCourseId,
    });

    const shouldSave =
      ([1, 2, 8].includes(qTypeId) && optionIndexesStr && optionCharCodes.length > 0) ||
      ([3, 4].includes(qTypeId) && optionIndexesStr && optionCharCodes.length > 0) ||
      ([5, 6].includes(qTypeId) && calcVal?.trim() !== "");

    if (!realStudentId || !realTestId || !realCourseId) {
      console.warn("Missing required IDs, skipping saveUserResponse call.");
      navigateToNext(subject, section, activeQuestionIndex);
      return;
    }

    const isAnswerChanged = isAnswerActuallyChanged(existingAnswer, savedData);
    const isStatusChanged = existingAnswer?.buttonClass !== savedData.buttonClass;

    if ((shouldSave && isAnswerChanged) || (isStatusChanged && !isAnswerChanged) || (!shouldSave && isAnswerChanged)) {
      await saveUserResponse({
        realStudentId,
        realTestId,
        realCourseId,
        subject_id: subjectId,
        section_id: sectionId,
        question_id: qid,
        question_type_id: qTypeId,
        TimeSpentOnQuestion: timeSpent,
        optionIndexes1: optionIndexesStr,
        optionIndexes1CharCodes: optionCharCodes,
        calculatorInputValue: calcVal,
        answered: shouldSave ? "1" : "3",
      });
    } else if (Number(timeLimitPerQuestion) > 0) {
      try {
        await fetch(`${backEndUrl}/OTSTestPaper/SaveTimeOnly`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            realStudentId,
            realTestId,
            realCourseId,
            question_id: qid,
            time_spent_on_question: timeSpent,
          }),
        });
      } catch (err) {
        console.error("Error saving time for non-NAT:", err);
      }
    }

    navigateToNext(subject, section, activeQuestionIndex);
  } finally {
    setIsSaving(false);
  }
};
const handleMarkedForReview = async () => {
//   const isValid = await validateSessionWithoutNavigation();
//   if (!isValid) {
//     window.close();
//     return;
//   }

  setIsSaving(true);
  try {
    const subject = testData?.subjects?.find((sub) => sub.SubjectName === activeSubject);
    const section = subject?.sections?.find((sec) => sec.SectionName === activeSection);
    const question = section?.questions?.[activeQuestionIndex];
    if (!question) return;

    const qid = question.question_id;
    const subjectId = subject.subjectId;
    const sectionId = section.sectionId;
    const qTypeId = question?.questionType?.quesionTypeId;
    const existingAnswer = userAnswers?.[qid];
    const timeLimitPerQuestion = getElapsedTimeForCurrentQuestion();
    const timeSpent = timeLimitPerQuestion + (existingAnswer?.TimeSpentOnQuestion ?? 0);

    const { savedData, optionIndexesStr, optionCharCodes, calcVal } = prepareSavedData({
      question: { ...question, subjectId, sectionId },
      qTypeId,
      selectedOption,
      selectedOptionsArray,
      natValue,
      styles,
      timeSpent,
      buttonClass: (
    ([1, 2, 8].includes(qTypeId) && selectedOption?.option_index) ||
    ([3, 4, 7].includes(qTypeId) && Array.isArray(selectedOptionsArray) && selectedOptionsArray.length > 0) ||
    ([5, 6].includes(qTypeId) && typeof natValue === 'string' && natValue.trim() !== '')
      ? 'AnsMarkedForReview'
      : 'MarkedForReview'
  )
});

    setUserAnswers((prev) => ({ ...prev, [qid]: savedData }));

    addNextQuestionToState({
      section,
      activeQuestionIndex,
      subjectId,
      sectionId,
      userAnswers,
      setUserAnswers,
      styles,
      realStudentId,
      realTestId,
      realCourseId,
    });

    const shouldSave =
      ([1, 2, 8].includes(qTypeId) && optionIndexesStr && optionCharCodes.length > 0) ||
      ([3, 4].includes(qTypeId) && optionIndexesStr && optionCharCodes.length > 0) ||
      ([5, 6].includes(qTypeId) && calcVal?.trim() !== "");

    if (!realStudentId || !realTestId || !realCourseId) {
      console.warn("Missing required IDs, skipping saveUserResponse call.");
      navigateToNext(subject, section, activeQuestionIndex);
      return;
    }

    const isAnswerChanged = isAnswerActuallyChanged(existingAnswer, savedData);
    const isStatusChanged = existingAnswer?.buttonClass !== savedData.buttonClass;

    if (shouldSave && isAnswerChanged) {
      await saveUserResponse({
        realStudentId,
        realTestId,
        realCourseId,
        subject_id: subjectId,
        section_id: sectionId,
        question_id: qid,
        question_type_id: qTypeId,
        TimeSpentOnQuestion: timeSpent,
        optionIndexes1: optionIndexesStr,
        optionIndexes1CharCodes: optionCharCodes,
        calculatorInputValue: calcVal,
        answered: "2", // Marked & Answered
      });
    } else if (!shouldSave && !existingAnswer) {
      await saveUserResponse({
        realStudentId,
        realTestId,
        realCourseId,
        subject_id: subjectId,
        section_id: sectionId,
        question_id: qid,
        question_type_id: qTypeId,
        TimeSpentOnQuestion: timeSpent,
        optionIndexes1: "",
        optionIndexes1CharCodes: [],
        calculatorInputValue: "",
        answered: "4", // Marked Only
      });
    } else if (isStatusChanged) {
      await saveUserResponse({
        realStudentId,
        realTestId,
        realCourseId,
        subject_id: subjectId,
        section_id: sectionId,
        question_id: qid,
        question_type_id: qTypeId,
        TimeSpentOnQuestion: timeSpent,
        optionIndexes1: optionIndexesStr,
        optionIndexes1CharCodes: optionCharCodes,
        calculatorInputValue: calcVal,
        answered: shouldSave ? "2" : "4",
      });
    } else if (Number(timeLimitPerQuestion) > 0) {
      try {
        await fetch(`${backEndUrl}/OTSTestPaper/SaveTimeOnly`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            realStudentId,
            realTestId,
            realCourseId,
            question_id: qid,
            time_spent_on_question: timeSpent,
          }),
        });
      } catch (err) {
        console.error("Error saving time for non-NAT:", err);
      }
    }

    navigateToNext(subject, section, activeQuestionIndex);
  } finally {
    setIsSaving(false);
  }
};
const handleClearResponse = async () => {
//   const isValid = await validateSessionWithoutNavigation();
//   if (!isValid) return window.close();

  setIsSaving(true);

    const subject = testData?.subjects?.find(sub => sub.SubjectName === activeSubject);
    const section = subject?.sections?.find(sec => sec.SectionName === activeSection);
    const question = section?.questions?.[activeQuestionIndex];
    if (!question) return;

    const qid = question.question_id;
    const existingAnswer = userAnswers?.[qid];

   let isClear = existingAnswer?.buttonClass !== `NotAnsweredBtnCls`;
    // Reset selections locally
    setSelectedOption(null);
    setSelectedOptionsArray([]);
    setNatValue("");

    // Update answer state as Not Answered but keep time spent
    setUserAnswers(prev => ({
      ...prev,
      [qid]: {
        subjectId: subject.subjectId,
        sectionId: section.sectionId,
        questionId: qid,
        TimeSpentOnQuestion: existingAnswer?.TimeSpentOnQuestion ?? 0,
        type: "",
        buttonClass: `NotAnsweredBtnCls`,
      },
    }));
 
    if (!realStudentId || !realTestId || !realCourseId) {
      console.warn("Missing required IDs, skipping ClearResponse API call.");
      return;
    }
     try {
      if (!isClear) {
            console.warn("No response to clear, skipping API call.");
            return;
          }
    const response = await fetch(
      `${backEndUrl}/OTSTestPaper/ClearResponse/${realStudentId}/${realTestId}/${realCourseId}/${qid}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await response.json();
    if (!data.success) {
      console.warn("Clear Response API response:", data.message);
    } else {
      console.log("Response deleted from DB");
    }
  } catch (err) {
    console.error("Error deleting user response:", err);
  } finally {
    setIsSaving(false);
  }
};

const handlePrevious = async () => {
//   const isValid = await validateSessionWithoutNavigation();
//   if (!isValid) return window.close();

  const subject = testData?.subjects?.find(sub => sub.SubjectName === activeSubject);
  const section = subject?.sections?.find(sec => sec.SectionName === activeSection);
  const question = section?.questions?.[activeQuestionIndex];
  if (!question || activeQuestionIndex <= 0) return;

  const qid = question.question_id;
  const existingAnswer = userAnswers?.[qid];
  const timeLimitPerQuestion = getElapsedTimeForCurrentQuestion();
  const timeSpent = timeLimitPerQuestion + (existingAnswer?.TimeSpentOnQuestion ?? 0);
  const qTypeId = question?.questionType?.quesionTypeId;

  try {
    if (timeLimitPerQuestion > 0) {
      if (![5, 6].includes(qTypeId)) {
        await fetch(`${backEndUrl}/OTSTestPaper/SaveTimeOnly`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            realStudentId,
            realTestId,
            realCourseId,
            question_id: qid,
            time_spent_on_question: timeSpent,
          }),
        });
      } else {
        await autoSaveNATIfNeeded();
      }
    }
  } catch (err) {
    console.error("Error saving time before navigating to previous:", err);
  }

  setActiveQuestionIndex(prev => prev - 1);
};

const formatTime = (seconds) => {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};
const [isAutoSubmitted, setIsAutoSubmitted] = useState(false);
const [isSubmitClicked, setIsSubmitClicked] = useState(false);
const [showExamSummary, setShowExamSummary] = useState(false);

useEffect(() => {
  // Show summary if time's up, auto-submitted, or manually submitted
  setShowExamSummary(timeLeft === 0 || isAutoSubmitted || isSubmitClicked);
}, [timeLeft, isAutoSubmitted, isSubmitClicked]);

useEffect(() => {
  if (timeLeft === 0) {
    const autoSubmit = async () => {
      setIsAutoSubmitted(true);
      await AsyncStorage.setItem("examSummaryEntered", "true");
      await AsyncStorage.setItem("autoSubmitted", "true");
      await handleSubmitClick();
    };
    autoSubmit();
  }
}, [timeLeft]);

  useEffect(() => {
    const checkExamStatus = async () => {
      try {
        const enteredSummary = await AsyncStorage.getItem("examSummaryEntered");
        const alreadySubmitted = await AsyncStorage.getItem("examSubmitted");

        if (enteredSummary === "true" || alreadySubmitted === "true") {
          setShowExamSummary(true);
        }
      } catch (error) {
        console.error("Error checking exam status:", error);
      }
    };

    checkExamStatus();
  }, []);

const prepareForTimeSaveforQuestion = async () => {
  const subject = testData?.subjects?.find(sub => sub.SubjectName === activeSubject);
  const section = subject?.sections?.find(sec => sec.SectionName === activeSection);
  const question = section?.questions?.[activeQuestionIndex];
  if (!question) return;

  const qid = question.question_id;
  const existingAnswer = userAnswers?.[qid];
  const timeLimitPerQuestion = getElapsedTimeForCurrentQuestion();
  const totalTimeSpent = Number(timeLimitPerQuestion) + (existingAnswer?.TimeSpentOnQuestion ?? 0);

  try {
    const response = await fetch(`${backEndUrl}/OTSTestPaper/SaveTimeOnly`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        realStudentId,
        realTestId,
        realCourseId,
        question_id: qid,
        time_spent_on_question: totalTimeSpent,
      }),
    });
    const result = await response.json();
    console.log("✅ Time save response:", result);
  } catch (err) {
    console.error("❌ Error saving time before submission:", err);
  }
};

const handleSubmitClick = async () => {
//   const isValid = await validateSessionWithoutNavigation();
//   if (!isValid) return window.close();

  setIsSaving(true); // disable Submit button
  try {
    const formattedTimeSpent = formatTime(timeSpent);
    const attemptedCount = answeredAndMarkedForReviewCount + answeredCount;
    const notAttemptedCount = markedForReviewCount + notAnsweredCount;

    const allNormalAnswered =
      answeredCount + answeredAndMarkedForReviewCount === totalQuestionsInTest;
    const hasTimeLeft = timeLeft > 0;

    // Show bonus confirm popup if criteria met, else submit directly
    if (hasBonus && hasTimeLeft && allNormalAnswered && !isBonusLoaded) {
      setShowBonusConfirmPopup(true);
      return;
    }

    // Submit exam and save time in parallel
    await Promise.all([
      submitExam(formattedTimeSpent, attemptedCount, notAttemptedCount),
      prepareForTimeSaveforQuestion(),
    ]);
  } finally {
    setIsSaving(false); // always re-enable Submit button
  }
};

const submitExam = async (formattedTimeSpent, attemptedCount, notAttemptedCount) => {
  setIsSubmitClicked(true);
  await AsyncStorage.setItem("examSummaryEntered", "true");

  setShowExamSummary(true);

  if (!realStudentId || !realTestId || !realCourseId) {
    console.warn("Missing IDs, skipping SaveExamSummary API call.");
    return;
  }

  const examSummaryData = {
    studentId: realStudentId,
    test_creation_table_id: realTestId,
    course_id: realCourseId,
    totalQuestions: totalQuestionsInTest,
    totalAnsweredQuestions: answeredCount,
    totalAnsweredMarkForReviewQuestions: answeredAndMarkedForReviewCount,
    totalMarkForReviewQuestions: markedForReviewCount,
    totalNotAnsweredQuestions: notAnsweredCount,
    totalVisitedQuestionQuestions: visitedCount,
    totalNotVisitedQuestions: notVisitedCount,
    totalAttemptedQuestions: attemptedCount,
    totalNotAttemptedQuestions: notAttemptedCount,
    TimeSpent: formattedTimeSpent,
  };

  try {
    const response = await fetch(`${backEndUrl}/OTSExamSummary/SaveExamSummary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(examSummaryData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Summary Submitted:", result.message);
      await AsyncStorage.setItem("examSubmitted", "true");
    } else {
      console.error("Submit Failed:", result.message);
    }
  } catch (err) {
    console.error("Error submitting summary:", err);
  }
};


const handleExtraQYes = async () => {
  try {
    const res = await fetch(`${backEndUrl}/OTSTestPaper/set-extra-started`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_registration_id: realStudentId,
        test_id: realTestId,
        course_id: realCourseId,
      }),
    });

    const data = await res.json();

    if (data.success) {
      await handleConfirmExtraQuestions();
    } else {
      console.log("Error while posting the extra status");
    }
  } catch (err) {
    console.error("Network error in handleExtraQYes:", err);
  }
};

const handleConfirmExtraQuestions = async () => {
//   const isValid = await validateSessionWithoutNavigation();
//   if (!isValid) return window.close();

  try {
    const token = await AsyncStorage.getItem("accessToken");
    if (!token) {
      console.warn("No access token found");
      return;
    }

    const response = await fetch(`${backEndUrl}/OTSTestPaper/QuestionPaper_WithExtra/${realTestId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const bonusData = await response.json();

    // Merge subjects
    const mergedSubjects = [...normalTestData.subjects, ...bonusData.subjects];
    const full = { ...bonusData, subjects: mergedSubjects };

    // Update state
    setTestPaperData(bonusData);      // Show bonus only
    setFullTestData(full);             // Keep full merged for summary
    // setResumeTime(timeLeft);           // Resume from current time

    // Setup first subject and section
    const firstSubject = bonusData.subjects?.[0];
    const firstSection = firstSubject?.sections?.[0];

    if (firstSubject?.subjectId) {
      setSelectedSubjects([firstSubject.subjectId]);
      setActiveSubject(firstSubject.SubjectName);
    }

    if (firstSection?.SectionName) {
      setActiveSection(firstSection.SectionName);
    }

    setActiveQuestionIndex(0);
    setIsBonusLoaded(true);
    setShowBonusConfirmPopup(false);
  } catch (err) {
    console.error("Error loading bonus questions:", err);
  }
};

const handleCancelExtraQuestions = async () => {
//   const isValid = await validateSessionWithoutNavigation();
//   if (!isValid) return window.close();

  setShowBonusConfirmPopup(false);

  const formattedTimeSpent = formatTime(timeSpent);
  const attemptedCount = answeredAndMarkedForReviewCount + answeredCount;
  const notAttemptedCount = markedForReviewCount + notAnsweredCount;

  await submitExam(formattedTimeSpent, attemptedCount, notAttemptedCount);
};

const onCancelSubmit = async () => {
//   const isValid = await validateSessionWithoutNavigation();
//   if (!isValid) return window.close();

  setShowExamSummary(false);
  setIsSubmitClicked(false);
  setIsAutoSubmitted(false);

  try {
    await AsyncStorage.multiRemove(["examSummaryEntered", "examSubmitted"]);
  } catch (err) {
    console.error("Error clearing AsyncStorage keys:", err);
  }
};

  return (
  
    <ScrollView contentContainerStyle={styles.footerContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.btnsSubContainer}>
        <View style={styles.navigationBtnHolderSubContainer}>

          <TouchableOpacity
            // style={getButtonStyle(isDisabled)}
            onPress={handleMarkedForReview}
            disabled={isDisabled || isSaving}
             style= {styles.NavigationButton}
          >
            <Text
           
            //  style={getButtonTextStyle(isDisabled)}
             >Marked For Review & Next</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style= {styles.NavigationButton}
            // style={getButtonStyle(isDisabled)}
            onPress={handleClearResponse}
            disabled={isDisabled || isSaving}
          >
            <Text 
            // style={getButtonTextStyle(isDisabled)}
            >Clear Response</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.navigationBtnHolderSubContainerForSubmit}>
          {activeQuestionIndex > 0 && (
            <TouchableOpacity
              style= {styles.NavigationButton}
              // style={getButtonStyle(isDisabled)}
              onPress={handlePrevious}
              disabled={isDisabled || isSaving}
            >
              <Text 
              // style={getButtonTextStyle(isDisabled)}
              >Previous</Text>
            </TouchableOpacity>
          )}

       
        </View>
      </View>

      <View style={styles.submitBtnCls}>
        <TouchableOpacity
          style={[styles.submitButton, isSaving && styles.disabledButton]}
          onPress={handleSubmitClick}
          disabled={isSaving}
        >
          <Text 
  style={{ color: '#fff', fontSize: 16 }}
          // style={getButtonTextStyle(isSaving)}
          >Submit</Text>
        </TouchableOpacity>
   <TouchableOpacity
            style= {styles.saveandnext}
            // style={getButtonStyle(isDisabled)}
            onPress={handleSaveAndNext}
            disabled={isDisabled || isSaving}
          >
            <Text 
           style={styles.buttonText}
            >Save & Next</Text>
          </TouchableOpacity>
        {/* Hidden Save & Next button equivalent, if needed, you can toggle with conditional rendering */}
      </View>

      {showBonusConfirmPopup && (
                  <Modal
      animationType="fade"
      transparent={false}
      visible={showBonusConfirmPopup}
      onRequestClose={!showBonusConfirmPopup}
    >
        <View style={styles.examSummaryMainDiv}>
          <View style={styles.examSummarySubDiv}>
            <Text style={styles.popupTitle}>Do you want to attempt extra questions?</Text>
            <View style={styles.popupButtons}>
              <TouchableOpacity
                style={[styles.popupButton, styles.yesButton]}
                onPress={handleExtraQYes}
              >
                <Text style={styles.popupButtonText}>Yes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.popupButton, styles.noButton]}
                onPress={handleCancelExtraQuestions}
              >
                <Text style={styles.popupButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
    </Modal>
      )}

      {showExamSummary && (
            <Modal
      animationType="fade"
      transparent={false}
      visible={showExamSummary}
      onRequestClose={!showExamSummary}
    >
        <View style={styles.examSummaryMainDiv}>
          <View style={styles.examSummarySubDiv}>
          
            <QuestionStatusProvider
              testData={isBonusLoaded ? fullTestData : testData}
              activeSubject={activeSubject}
              activeSection={activeSection}
              userAnswers={userAnswers}
            >
              <OTSExamSummary
                testData={isBonusLoaded ? fullTestData : testData} // ✅ pass merged only after bonus
                  userAnswers={userAnswers}
                  onCancelSubmit={onCancelSubmit}
                  isSubmitClicked={isSubmitClicked}
                  isAutoSubmitted={isAutoSubmitted}
                  setUserAnswers={setUserAnswers}
                  realTestId={realTestId}
                  realCourseId={realCourseId}
                  realStudentId={realStudentId}
                  setShowExamSummary={setShowExamSummary}
              />
            </QuestionStatusProvider>
          </View>
        </View>
          </Modal>
      )}
    </ScrollView>
  );
};
export default QuestionNavigationButtons;