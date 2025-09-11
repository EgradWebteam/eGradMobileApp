import React, { useEffect, useRef, useState } from "react";
import {
  View,
  // Text,
  // Image,
  // TouchableOpacity,
  // ScrollView,
  // StyleSheet,
  // ActivityIndicator,
  // ImageBackground,
} from "react-native";
// import { useStudent } from '../../hooks/StudentContext.jsx';
 import { backEndUrl, frontEndUrl,backEndPort } from "../../apiConfig.js";
// import defaultImage from '../../images/StudentImage.png';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import adminCapImg from '../../images/capImg.png';
 // Replace with RN vector icons
// import { useSession } from "../../StudentDashboard/hooks/SessionContext.jsx";
// import Icon from "react-native-vector-icons/FontAwesome";
// import { styles } from '../../styles/OTSStyles';
const OTSRightSideBar = ({
  testData,
  activeSubject,
  activeSection,
  activeQuestionIndex,
  // setActiveQuestionIndex,
  userAnswers,
  setUserAnswers,
  // autoSaveNATIfNeeded,
  // showSidebar,
  // setShowSidebar,
  realStudentId,
  realTestId,
  realCourseId,
  // isDisabled,
  // isMobile,
  // getElapsedTimeForCurrentQuestion,
}) => {
  // const { studentData } = useStudent();
//   const { validateSessionWithoutNavigation } = useSession();

  if (!testData || !Array.isArray(testData.subjects)) return null;

  // const subject = testData.subjects.find(
  //   (subj) => subj.SubjectName === activeSubject
  // );
  // const section = subject?.sections?.find(
  //   (sec) =>
  //     sec.SectionName === activeSection ||
  //     sec.sectionName === activeSection ||
  //     sec.sectionId === activeSection ||
  //     sec.section_id === activeSection
  // );

  // const userData = studentData?.userDetails;
  // const studentProfile = userData?.uploaded_photo;
  // const studentName = userData?.candidate_name;
// const backgroundImages = {
//   AnswerdBtnCls: require('../../images/Answered.png'),
//   NotAnsweredBtnCls: require('../../images/NotAnswered.png'),
//   MarkedForReview: require('../../images/MarkedForReview.png'),
//   AnsMarkedForReview: require('../../images/AnsMarkedForReview.png'),
//   NotVisitedBehaviourBtns: require('../../images/Visited.png'),
// };

  // Admin check (you might want to store this in context or state in RN)
  // const [adminRole, setAdminRole] = useState(null);
  // useEffect(() => {
  //   const fetchAdminRole = async () => {
  //     try {
  //       const role = await AsyncStorage.getItem('adminRole');
  //       setAdminRole(role);
  //     } catch (error) {
  //       console.error('Error retrieving admin role:', error);
  //     }
  //   };

  //   fetchAdminRole(); // Call the async function inside useEffect
  // }, []);
  useEffect(() => {
    const saveIfNewQuestion = async () => {
      const subject = testData?.subjects?.find(
        (sub) => sub.SubjectName === activeSubject
      );
      const section = subject?.sections?.find(
        (sec) => sec.SectionName === activeSection
      );
      const question = section?.questions?.[activeQuestionIndex];
      if (!question) return;

      const existing = userAnswers?.[question.question_id];
      if (existing) return; // already answered, skip

      const qTypeId = question?.questionType?.quesionTypeId;
      setUserAnswers((prev) => ({
        ...prev,
        [question.question_id]: {
          subjectId: subject.subjectId,
          sectionId: section.sectionId,
          questionId: question.question_id,
          buttonClass: `NotAnsweredBtnCls`,
          type: "", // no answer yet
        },
      }));
      await saveUserResponse({
        realStudentId,
        realTestId,
        realCourseId,
        subject_id: subject.subjectId,
        section_id: section.sectionId,
        question_id: question.question_id,
        question_type_id: qTypeId,
        answered: "3",
      });
    };
    saveIfNewQuestion();
  }, [activeQuestionIndex, userAnswers]);
  // const isAdmin = adminRole === "admin";

  const saveUserResponse = async ({
    realStudentId,
    realTestId,
    realCourseId,
    subject_id,
    section_id,
    question_id,
    question_type_id,
    optionIndexes1 = "",
    optionIndexes2 = "",
    optionIndexes1CharCodes = [],
    optionIndexes2CharCodes = [],
    calculatorInputValue = "",
    answered = "1",
  }) => {
    try {
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
      };
      const res = await fetch(`${backEndUrl}/OTSTestPaper/SaveResponse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error in saveUserResponse:", error);
      return { success: false, message: "Network error" };
    }
  };

  // Initialization and saving logic same as your web version, adapted to hooks

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
            question_id: firstQuestion.question_id,
            question_type_id: firstQuestion?.questionType?.quesionTypeId,
            answered: "3",
          });
        } catch (err) {
          console.error("Error saving first question response:", err);
        }
      };

      saveResponse();
    }
  }, [testData, activeSubject, activeSection, userAnswers]);

  // const answeredCount =
  //   section?.questions?.filter((q) => {
  //     const savedAnswer = userAnswers?.[q.question_id];
  //     return (
  //       savedAnswer?.buttonClass === "Answered" ||
  //       savedAnswer?.buttonClass === "AnswerMarkedForReview"
  //     );
  //   }).length || 0;

  // const notAnsweredCount =
  //   section?.questions?.filter((q) => {
  //     const savedAnswer = userAnswers?.[q.question_id];
  //     return savedAnswer?.buttonClass === "NotAnswered";
  //   }).length || 0;

  // const notVisitedCount =
  //   section?.questions?.filter((q) => {
  //     const savedAnswer = userAnswers?.[q.question_id];
  //     return !savedAnswer;
  //   }).length || 0;

  // const markedForReviewCount =
  //   section?.questions?.filter((q) => {
  //     const savedAnswer = userAnswers?.[q.question_id];
  //     return savedAnswer?.buttonClass === "MarkedForReview";
  //   }).length || 0;

  // const answeredAndMarkedForReviewCount =
  //   section?.questions?.filter((q) => {
  //     const savedAnswer = userAnswers?.[q.question_id];
  //     return savedAnswer?.buttonClass === "AnswerMarkedForReview";
  //   }).length || 0;

  // const handleQuestionClick = async (index) => {
  //   // const isValid = await validateSessionWithoutNavigation();
  //   // if (isValid) {
  //     await autoSaveNATIfNeeded();

  //     const subject = testData?.subjects?.find(
  //       (sub) => sub.SubjectName === activeSubject
  //     );
  //     const section = subject?.sections?.find(
  //       (sec) => sec.SectionName === activeSection
  //     );
  //     const question = section?.questions?.[index];
  //     if (!question) return;
  //     const existing = userAnswers?.[question.question_id];
  //     if (!existing) {
  //       setUserAnswers((prev) => ({
  //         ...prev,
  //         [question.question_id]: {
  //           subjectId: subject.subjectId,
  //           sectionId: section.sectionId,
  //           questionId: question.question_id,
  //           buttonClass: "NotAnswered",
  //           type: "",
  //         },
  //       }));
  //       await saveUserResponse({
  //         realStudentId,
  //         realTestId,
  //         realCourseId,
  //         subject_id: subject.subjectId,
  //         section_id: section.sectionId,
  //         question_id: question.question_id,
  //         question_type_id: question?.questionType?.quesionTypeId,
  //         answered: "3",
  //       });
  //     }
  //     setActiveQuestionIndex(index);
  //   // } else {
  //     // On invalid session, you might want to navigate or logout
  //     // window.close() is not applicable in RN
  //     // So, handle accordingly
  //   //   console.warn("Invalid session");
  //   // }
  // };

  // const toggleSidebar = () => {
  //   setShowSidebar((prev) => !prev);
  // };

  return (
    <View>
       {/* {!isMobile && ( 
    <View style={styles.container}>
      <View style={styles.profileHolder}>
        <Image
          source={
            isAdmin
              ? adminCapImg
              : studentProfile
              ? { uri: studentProfile }
              : defaultImage
          }
          style={styles.profileImage}
          onError={() => {
            // Fallback image logic can be implemented here if needed
          }}
        />
        <Text style={styles.studentName}>{isAdmin ? "Admin" : studentName}</Text>
      </View>

      <TouchableOpacity onPress={toggleSidebar} style={styles.toggleButton}>
        <Icon
          name="chevron-right"
          size={20}
          color="#000"
          style={{ transform: [{ rotate: showSidebar ? "180deg" : "0deg" }] }}
        />
      </TouchableOpacity>

      {showSidebar && (
        <View style={styles.sidebar}>
            <ScrollView
            style={styles.questionsContainer}
           
            keyboardShouldPersistTaps="handled"
          >
            {section?.questions?.map((q, index) => {
              const savedAnswer = userAnswers?.[q.question_id];
              const currentSectionId = Number(
                section?.sectionId ?? section?.section_id ?? 0
              );
              const savedSectionId = Number(savedAnswer?.sectionId ?? 0);
              const isFromCurrentSection = savedSectionId === currentSectionId;

              let answerStatus = "NotVisitedBehaviourBtns";
              if (isFromCurrentSection && savedAnswer?.buttonClass) {
                answerStatus = savedAnswer.buttonClass;
              }
           const isActive = index === activeQuestionIndex;
              return (
               <View key={q.question_id} style={styles.questionNumberRow}>
                            <TouchableOpacity
                              style={[
                                styles.questionBtnSNMR,
                              
                                answerStatus,
                              ]}
                              onPress={() => handleQuestionClick(index)}
                              disabled={isDisabled}
                            >
                                 <ImageBackground
                    source={backgroundImages[answerStatus]} // Use the dynamic key
                    style={{ width: 45, height: 45 ,justifyContent:'center',alignContent:'center'}}
                    
                    imageStyle={{ resizeMode: 'contain' ,justifyContent: 'center',
                  alignItems: 'center'}}
                  >
                              <Text style={[styles.questionBtnText, styles[answerStatus]]}>{index + 1}</Text></ImageBackground>
                            </TouchableOpacity>
                          </View>
              );
            })}
          </ScrollView>
          <View style={styles.behaviourCounts}>
            <View style={styles.behaviourItem}>
              <View style={[styles.behaviourCircle, styles.Answered]}>
                <Text style={styles.behaviourCount}>{answeredCount}</Text>
              </View>
              <Text style={styles.behaviourText}>Answered</Text>
            </View>
            <View style={styles.behaviourItem}>
              <View style={[styles.behaviourCircle, styles.notAnswered]}>
                <Text style={styles.behaviourCount}>{notAnsweredCount}</Text>
              </View>
              <Text style={styles.behaviourText}>Not Answered</Text>
            </View>
            <View style={styles.behaviourItem}>
              <View style={[styles.behaviourCircle, styles.notVisited]}>
                <Text style={styles.behaviourCount}>{notVisitedCount}</Text>
              </View>
              <Text style={styles.behaviourText}>Not Visited</Text>
            </View>
            <View style={styles.behaviourItem}>
              <View style={[styles.behaviourCircle, styles.markedForReview]}>
                <Text style={styles.behaviourCount}>{markedForReviewCount}</Text>
              </View>
              <Text style={styles.behaviourText}>Marked for Review</Text>
            </View>
            <View style={styles.behaviourItem}>
              <View style={[styles.behaviourCircle, styles.answeredMarkedForReview]}>
                <Text style={styles.behaviourCount}>{answeredAndMarkedForReviewCount}</Text>
              </View>
              <Text style={styles.behaviourText}>Answered & Marked for Review</Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.subjectText}>{activeSubject}</Text>
            <Text style={styles.sectionText}>{section?.SectionName || ""}</Text>
          </View>

          
        </View>
      )}
    </View>)} */}
    </View>
  );
};
export default OTSRightSideBar;
