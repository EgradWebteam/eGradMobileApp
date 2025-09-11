import React, { useState, useEffect, useRef,useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
   Dimensions,
  Alert
} from 'react-native';
import { styles } from '../../styles/OTSStyles';
import axios from 'axios';
import { backEndUrl, frontEndUrl,backEndPort } from "../../apiConfig";
import OTSTimer from './OTSTimer';
import QuestionsMainContainer from './QuestionsMainContainer';
import SubjectsAndSectionsContainer from './SubjectsAndSectionsContainer';
// import OTSRightSideBar from './OTSRightSideBar'; // or omit if not needed
import QuestionNavigationButtons from './QuestionNavigationButtons';
import ExamSummaryCollector from './ExamSummaryCollector';
import TimerProvider from '../../hooks/TimerContext';
import  QuestionStatusProvider  from '../../hooks/CountsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useSession } from '../../StudentDashboard/hooks/SessionContext';

const OTSMain = ({
  testData,
  realStudentId,
  realTestId,
  realCourseId,
  warningMessage,
  summaryData,
  userAnswers,
  setUserAnswers,
  sectionType,
  hasBonus,
  setTestPaperData,
  normalTestData,
  setNormalTestData,
  fullTestData,
  setFullTestData,
}) => {
  const [activeSubject, setActiveSubject] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptionsArray, setSelectedOptionsArray] = useState([]);
  const [natValue, setNatValue] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedOptionalSubjects, setSelectedOptionalSubjects] = useState([]);
  const [showResetTable, setShowResetTable] = useState(false);
  const [showUnselectWarning, setShowUnselectWarning] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [resumeTime, setResumeTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBonusLoaded, setIsBonusLoaded] = useState(false);

  const questionStartTimeRef = useRef(Date.now());
//   const { validateSessionWithoutNavigation } = useSession();

  const currentSubject = testData?.subjects?.find(sub => sub.SubjectName === activeSubject);
  const currentSection = currentSubject?.sections?.find(sec => sec.SectionName === activeSection);
  const questions = currentSection?.questions || [];
  const currentQuestion = questions[activeQuestionIndex];
  const qid = currentQuestion?.question_id;

  const isOptional = currentSubject?.sectionType === "Optional";
  const isDisabled = isOptional && !selectedSubjects.includes(currentSubject?.SubjectName);

  // ✅ Utility: elapsed time
  const getElapsedTimeForCurrentQuestion = useCallback(() => {
    return Math.round((Date.now() - questionStartTimeRef.current) / 1000);
  }, []);
  // const [isMobile, setIsMobile] = useState(Dimensions.get('window').width <= 768 || Dimensions.get('window').height <= 768);
    const isMobile = true;

  // useEffect(() => {
  //   const handleResize = () => {
  //     // const { width, height } = Dimensions.get('window');
  //     // setIsMobile(width <= 768 || height <= 768);
  //     setIsMobile(true);
  //   };
  //   const subscription = Dimensions.addEventListener('change', handleResize);
  //   return () => subscription?.remove();
  // }, []);
  useEffect(() => {
    questionStartTimeRef.current = Date.now();
  }, [qid]);

  // ✅ Set first active subject/section on mount
  useEffect(() => {
    if (testData && !activeSubject && Array.isArray(testData.subjects)) {

      const normalSubjects = testData.subjects.filter(
        (s) => s.subjectType === "0" // ✅ fixed key
      );


      if (normalSubjects.length > 0) {
        const firstSubject = normalSubjects[0];
        setActiveSubject(firstSubject.SubjectName);

        const firstSection = firstSubject.sections?.[0];
        if (firstSection) {
          setActiveSection(firstSection.SectionName);
          setActiveQuestionIndex(0);
        }
      }
    }
  }, [testData, activeSubject]);

  // ✅ Update section when activeSubject changes
  useEffect(() => {
    const subject = testData?.subjects?.find(subj => subj.SubjectName === activeSubject);
    if (subject?.sections?.length > 0) {
      setActiveSection(subject.sections[0].SectionName);
      setActiveQuestionIndex(0);
    } else {
      setActiveSection(null);
    }
  }, [activeSubject]);

  // ✅ Fetch user answers after resume
  useEffect(() => {
    const fetchUserAnswers = async () => {
      if (!realStudentId || !realTestId || !realCourseId || !testData?.subjects?.length) return;

      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const response = await axios.get(
          `${backEndUrl}/ResumeTest/getResumedUserresponses/${realStudentId}/${realTestId}/${realCourseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = response.data;
        const answers = {};
        let firstSubject, firstSection, firstQuestion;

        data.subjects?.forEach(sub => {
          if (!firstSubject) firstSubject = sub.subject_id;
          sub.sections?.forEach(sec => {
            const sectionId = sec.section_id ?? sec.test_section_id ?? 0;
            if (!firstSection) firstSection = sectionId;
            sec.questions?.forEach(q => {
              const entry = {
                questionId: q.question_id,
                subjectId: sub.subject_id,
                sectionId,
                optionId: q.option_id,
                TimeSpentOnQuestion: q.time_spent_on_question,
                buttonClass: getButtonClass(q.question_status),
                type: mapQuestionType(q.question_type_id),
                optionIndex: q.user_answer,
                selectedOptions: q.user_answer?.split?.(",") || [],
                natAnswer: q.user_answer || "",
              };
              answers[q.question_id] = entry;
              if (!firstQuestion && q.user_answer) firstQuestion = entry;
            });
          });
        });

        setUserAnswers(answers);
        setResumeTime(data.time_left);

        // Restore first subject/section
        const subjectMatch = testData.subjects.find(sub => sub.subjectId === firstSubject);
        if (subjectMatch) {
          setActiveSubject(subjectMatch.SubjectName);
          const sectionMatch = subjectMatch.sections?.find(sec => sec.sectionId === firstSection);
          if (sectionMatch) setActiveSection(sectionMatch.SectionName);
        }

        if (firstQuestion) {
          if (firstQuestion.type === "MCQ") setSelectedOption(firstQuestion.optionIndex);
          if (firstQuestion.type === "MSQ") setSelectedOptionsArray(firstQuestion.selectedOptions);
          if (firstQuestion.type === "NAT") setNatValue(firstQuestion.natAnswer);
        }
      } catch (err) {
        console.error("Error fetching resumed answers:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAnswers();
  }, [realStudentId, realTestId, realCourseId]);
useEffect(() => {
    if (!testData || !Array.isArray(testData.subjects)) return;

    const subject = testData.subjects.find(
      (subj) => subj.SubjectName === activeSubject
    );
    const section = subject?.sections?.find(
      (sec) => sec.SectionName === activeSection
    );
    const firstQuestion = section?.questions?.[0];

    if (firstQuestion && !userAnswers?.[firstQuestion.question_id]) {
      setUserAnswers((prev) => ({
        ...prev,
        [firstQuestion.question_id]: {
          subjectId: subject.subjectId,
          sectionId: section.sectionId,
          questionId: firstQuestion.question_id,
          buttonClass: "NotAnsweredBtnCls",
          type: "",
        },
      }));

      const isOptional = subject.sectionType === "Optional";

      if (!realStudentId || !realTestId || !realCourseId) {
        console.warn("Missing required IDs, skipping saveUserResponse call.");
        return;
      }

      if (isOptional) return;

      const saveResponse = async () => {
        try {
          await saveUserResponse({
            realStudentId,
            realTestId,
            realCourseId,
            subject_id: subject.subjectId,
            section_id: section.sectionId,
            questionId: firstQuestion.question_id,
            questionTypeId: firstQuestion?.questionType?.quesionTypeId,
            answered: "3",
          });
        } catch (err) {
          console.error("Error saving first question response:", err);
        }
      };

      saveResponse();
    }
  }, [testData, activeSubject, activeSection, userAnswers]);
  // ✅ Auto-save NAT and time
const autoSaveNATIfNeeded = async () => {
  try {
    const subject = testData?.subjects?.find(
      (sub) => sub.SubjectName === activeSubject
    );
    const section = subject?.sections?.find(
      (sec) => sec.SectionName === activeSection
    );
    const question = section?.questions?.[activeQuestionIndex];
    const qTypeId = question?.questionType?.quesionTypeId;

    if (!question) return;

    const qid = question.question_id;
    const subjectId = subject.subjectId;
    const sectionId = section.sectionId;

    const existingAnswer = userAnswers?.[qid];
    const timeLimitPerQuestion = getElapsedTimeForCurrentQuestion();
    const timeSpent =
      timeLimitPerQuestion + (existingAnswer?.TimeSpentOnQuestion ?? 0);

    if (!realStudentId || !realTestId || !realCourseId) {
      console.warn("Missing required IDs for autoSaveNATIfNeeded. Skipping.");
      return;
    }

    const prevAnswer = userAnswers?.[qid];
    const wasMarkedForReview =
      prevAnswer?.buttonClass === `AnsMarkedForReview`;
    const wasPreviouslyAnswered =
      prevAnswer?.type === "NAT" && prevAnswer?.natAnswer?.trim();

    // ✅ NAT Handling (Type ID 5 or 6)
    if ([5, 6].includes(qTypeId)) {
      if (natValue?.trim() !== "") {
        const savedData = {
          subjectId,
          sectionId,
          questionId: qid,
          natAnswer: natValue,
          type: "NAT",
          TimeSpentOnQuestion: timeSpent,
          buttonClass: wasMarkedForReview
            ? `AnsMarkedForReview`
            : `AnswerdBtnCls`,
        };

        // Save locally
        setUserAnswers((prev) => ({
          ...prev,
          [qid]: savedData,
        }));

        // Save to backend
        await saveUserResponse({
          realStudentId,
          realTestId,
          realCourseId,
          subject_id: subjectId,
          section_id: sectionId,
          questionId: qid,
          questionTypeId: qTypeId,
          optionIndexes1: "",
          optionIndexes1CharCodes: [],
          calculatorInputValue: natValue,
          TimeSpentOnQuestion: timeSpent,
          answered: "1",
        });
      } else if (wasPreviouslyAnswered) {
        // Case 2: NAT cleared → Remove if previously answered
        setUserAnswers((prev) => ({
          ...prev,
          [qid]: {
            subjectId,
            sectionId,
            questionId: qid,
            type: "",
            TimeSpentOnQuestion: timeSpent,
            buttonClass: `NotAnsweredBtnCls`,
          },
        }));

        await saveUserResponse({
          realStudentId,
          realTestId,
          realCourseId,
          subject_id: subjectId,
          section_id: sectionId,
          questionId: qid,
          questionTypeId: qTypeId,
          optionIndexes1: "",
          optionIndexes1CharCodes: [],
          calculatorInputValue: natValue,
          TimeSpentOnQuestion: timeSpent,
          answered: "3",
        });
      } else {
        // Just save the time
        setUserAnswers((prev) => ({
          ...prev,
          [qid]: {
            ...(prev[qid] || {}),
            subjectId,
            sectionId,
            questionId: qid,
            TimeSpentOnQuestion: timeSpent,
            type: prev[qid]?.type || "",
            buttonClass: prev[qid]?.buttonClass || `NotAnsweredBtnCls`,
          },
        }));

        if (Number(timeLimitPerQuestion) > 0) {
          await fetch(`${backEndUrl}/OTSTestPaper/SaveTimeOnly`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              realStudentId,
              realTestId,
              realCourseId,
              question_id: qid,
              time_spent_on_question: timeSpent,
            }),
          });
        }
      }
    } else {
      // Not NAT → Save time only
      setUserAnswers((prev) => ({
        ...prev,
        [qid]: {
          ...(prev[qid] || {}),
          subjectId,
          sectionId,
          questionId: qid,
          TimeSpentOnQuestion: timeSpent,
          type: prev[qid]?.type || "",
          buttonClass: prev[qid]?.buttonClass ||`NotAnsweredBtnCls`,
        },
      }));

      if (Number(timeLimitPerQuestion) > 0) {
        await fetch(`${backEndUrl}/OTSTestPaper/SaveTimeOnly`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            realStudentId,
            realTestId,
            realCourseId,
            question_id: qid,
            time_spent_on_question: timeSpent,
          }),
        });
      }
    }
  } catch (error) {
    console.error("Error in autoSaveNATIfNeeded:", error);
  }
};

  // ✅ Auto-save time every 20 seconds
  useEffect(() => {
    if (!realStudentId || !realTestId || !realCourseId) return;

    const intervalId = setInterval(async () => {
      const timeSpent = getElapsedTimeForCurrentQuestion() + (userAnswers?.[qid]?.TimeSpentOnQuestion ?? 0);
      const alreadySubmitted = await AsyncStorage.getItem("examSubmitted") === "true";
      if (timeSpent > 0 && !alreadySubmitted) {
        try {
        //   const isValid = await validateSessionWithoutNavigation();
        //   if (!isValid) return Alert.alert("Session expired", "Please login again.");
          await axios.patch(`${backEndUrl}/OTSTestPaper/SaveTimeOnly`, { realStudentId, realTestId, realCourseId, question_id: qid, time_spent_on_question: timeSpent });
        } catch (err) {
          console.error("Auto-save time error:", err);
        }
      }
    }, 20000);

    return () => clearInterval(intervalId);
  }, [qid, userAnswers]);
// ✅ Helper functions
 const getButtonClass = (status) =>{
  switch (status) {
    case 1: return `AnswerdBtnCls`;
    case 2: return `AnsMarkedForReview`;
    case 3: return `NotAnsweredBtnCls`;
    case 4: return `MarkedForReview`;
    default: return `NotAnsweredBtnCls`;
  }
}

 const  mapQuestionType = (typeId)=>{
  switch (typeId) {
    case 1:
    case 2:
      return "MCQ";
    case 3:
    case 4:
      return "MSQ";
    case 5:
    case 6:
      return "NAT";
    case 8:
      return "CTQ";
    default:
      return "";
  }
}

const  saveUserResponse = async(payload) => {
  try {
    console.log(payload)
    const res = await axios.post(`${backEndUrl}/OTSTestPaper/SaveResponse`, payload);
    return res.data;
  } catch (err) {
    console.error("Error saving user response:", err);
    return { success: false, message: "Network error" };
  }
}

  if (isLoading) return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;

  return (
    <View style={styles.mainContainer}>
      <TimerProvider testData={testData} resumeTime={resumeTime}>
        <OTSTimer testData={testData} realStudentId={realStudentId} realTestId={realTestId} realCourseId={realCourseId} />
      </TimerProvider>

      {warningMessage && (
        <View style={styles.warningMessage}>
          <Text>Warning: Do not switch tabs, refresh, or minimize/maximize screen during test.</Text>
        </View>
      )}

      <SubjectsAndSectionsContainer
        testData={testData}
        activeSubject={activeSubject}
        setActiveSubject={setActiveSubject}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        autoSaveNATIfNeeded={autoSaveNATIfNeeded}
        setUserAnswers={setUserAnswers}
        userAnswers={userAnswers}
        setActiveQuestionIndex={setActiveQuestionIndex}
        activeQuestionIndex={activeQuestionIndex}
        showSidebar={showSidebar}
        sectionType={sectionType}
        selectedOptionalSubjects={selectedOptionalSubjects}
        setSelectedOptionalSubjects={setSelectedOptionalSubjects}
        showResetTable={showResetTable}
        setShowResetTable={setShowResetTable}
        showUnselectWarning={showUnselectWarning}
        setShowUnselectWarning={setShowUnselectWarning}
        selectedSubjects={selectedSubjects}
        setSelectedSubjects={setSelectedSubjects}
        setShowSidebar={setShowSidebar}
        realStudentId={realStudentId}
        realTestId={realTestId}
        realCourseId={realCourseId}
        isDisabled={isDisabled}
        getElapsedTimeForCurrentQuestion={getElapsedTimeForCurrentQuestion}
      />

      {!showResetTable && !showUnselectWarning && (
        <QuestionsMainContainer
          realStudentId={realStudentId}
          realTestId={realTestId}
          setActiveQuestionIndex={setActiveQuestionIndex}
          realCourseId={realCourseId}
          setUserAnswers={setUserAnswers}
          autoSaveNATIfNeeded={autoSaveNATIfNeeded}
          testData={testData}
          activeSubject={activeSubject}
          activeSection={activeSection}
            isMobile = {isMobile}
          activeQuestionIndex={activeQuestionIndex}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          userAnswers={userAnswers}
          selectedOptionsArray={selectedOptionsArray}
          setSelectedOptionsArray={setSelectedOptionsArray}
          natValue={natValue}
          setNatValue={setNatValue}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          selectedSubjects={selectedSubjects}
          isDisabled={isDisabled}
          getElapsedTimeForCurrentQuestion={getElapsedTimeForCurrentQuestion}
        />
      )}
    
      {/* <OTSRightSideBar
        saveUserResponse={saveUserResponse}
        testData={testData}
        activeSubject={activeSubject}
        activeSection={activeSection}
        activeQuestionIndex={activeQuestionIndex}
        setActiveQuestionIndex={setActiveQuestionIndex}
        userAnswers={userAnswers}
        setUserAnswers={setUserAnswers}
        autoSaveNATIfNeeded={autoSaveNATIfNeeded}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        realStudentId={realStudentId}
        realTestId={realTestId}
        realCourseId={realCourseId}
        isDisabled={isDisabled}
        isMobile = {isMobile}
        selectedSubjects={selectedSubjects}
        getElapsedTimeForCurrentQuestion={getElapsedTimeForCurrentQuestion}
        setSelectedSubjects={setSelectedSubjects}
      /> */}

      <QuestionStatusProvider testData={isBonusLoaded ? fullTestData : testData} activeSubject={activeSubject} activeSection={activeSection} userAnswers={userAnswers}>
        <TimerProvider testData={testData} resumeTime={resumeTime}>
          <QuestionNavigationButtons
            testData={testData}
            realStudentId={realStudentId}
            realTestId={realTestId}
            realCourseId={realCourseId}
            activeSubject={activeSubject}
            activeSection={activeSection}
            autoSaveNATIfNeeded={autoSaveNATIfNeeded}
            activeQuestionIndex={activeQuestionIndex}
            setActiveQuestionIndex={setActiveQuestionIndex}
            userAnswers={userAnswers}
            setUserAnswers={setUserAnswers}
            selectedOption={selectedOption}
            selectedOptionsArray={selectedOptionsArray}
            natValue={natValue}
            setSelectedOption={setSelectedOption}
            setSelectedOptionsArray={setSelectedOptionsArray}
            setNatValue={setNatValue}
            hasBonus={hasBonus}
            setTestPaperData={setTestPaperData}
            setSelectedSubjects={setSelectedSubjects}
            normalTestData={normalTestData}
            setNormalTestData={setNormalTestData}
            fullTestData={fullTestData}
             setActiveSubject={setActiveSubject}
             setActiveSection={setActiveSection}
            setFullTestData={setFullTestData}
            isDisabled={isDisabled}
            isBonusLoaded={isBonusLoaded}
            setIsBonusLoaded={setIsBonusLoaded}
            setResumeTime={setResumeTime}
            getElapsedTimeForCurrentQuestion={getElapsedTimeForCurrentQuestion}
          />
        </TimerProvider>
      </QuestionStatusProvider>

      <QuestionStatusProvider testData={testData} activeSubject={activeSubject} activeSection={activeSection} userAnswers={userAnswers}>
        <TimerProvider testData={testData} resumeTime={resumeTime}>
          <ExamSummaryCollector
             onDataReady={true}
            realStudentId={realStudentId}
            realTestId={realTestId}
            realCourseId={realCourseId}
            summaryData={summaryData}
          />
        </TimerProvider>
      </QuestionStatusProvider>
    </View>
  );
}
export default OTSMain;

