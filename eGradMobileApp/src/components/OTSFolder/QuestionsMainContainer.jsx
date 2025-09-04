import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
  Button
} from 'react-native';
// import { useSession } from '../../StudentDashboard/hooks/SessionContext'; // Assume it's RN-compatible
import { styles } from '../../styles/OTSStyles';
import axios from 'axios';
import { backEndUrl, frontEndUrl,backEndPort } from "../../apiConfig";
import Icon from 'react-native-vector-icons/FontAwesome';

const QuestionsMainContainer = ({
  testData,
  realTestId,
  setActiveQuestionIndex,
  realStudentId,
  activeSubject,
  realCourseId,
  setUserAnswers,
  autoSaveNATIfNeeded,
  activeSection,
  activeQuestionIndex,
  setSelectedOption,
  userAnswers,
  selectedOption,
  selectedOptionsArray,
  setSelectedOptionsArray,
  natValue,
  setNatValue,
  setShowSidebar,
  showSidebar,
  selectedSubjects,
  isDisabled
}) => {
//   const { validateSessionWithoutNavigation } = useSession();
  const scrollRef = useRef(null);
  const [showUp, setShowUp] = useState(false);
  const [showDown, setShowDown] = useState(false);
  const [isMobile, setIsMobile] = useState(Dimensions.get('window').width <= 768 || Dimensions.get('window').height <= 768);

  useEffect(() => {
    const handleResize = () => {
      const { width, height } = Dimensions.get('window');
      setIsMobile(width <= 768 || height <= 768);
    };
    const subscription = Dimensions.addEventListener('change', handleResize);
    return () => subscription?.remove();
  }, []);

  const subject = testData?.subjects?.find(sub => sub.SubjectName === activeSubject);
  const section = subject?.sections?.find(sec => sec.SectionName === activeSection);
  const question = section?.questions?.[activeQuestionIndex] || null;
// const getScrollTarget = () => {
//   return isMobile ? questionScrollRefMobile.current : questionScrollRefDesktop.current;
// };
  useEffect(() => {
    const saved = userAnswers?.[String(question?.question_id)];
    if (saved?.type === 'MCQ' && saved.optionId) {
      setSelectedOption({
        option_id: saved.optionId,
        option_index: saved.optionIndex,
      });
    }
  }, [question?.question_id]);
// useEffect(() => {
//   const scrollTarget = getScrollTarget();
//   if (scrollTarget) {

//       scrollTarget.scrollTo(0, 0);
 
//   }
// }, [activeQuestionIndex, activeSection, activeSubject, isMobile]);

  const handleQuestionClick = async (index) => {
    // const isValid = await validateSessionWithoutNavigation();
    // if (!isValid) return;

    await autoSaveNATIfNeeded();
    const q = section?.questions?.[index];
    if (!q) return;

    const existing = userAnswers?.[q.question_id];
    if (!existing) {
      setUserAnswers((prev) => ({
        ...prev,
        [q.question_id]: {
          subjectId: subject.subjectId,
          sectionId: section.sectionId,
          questionId: q.question_id,
          buttonClass: 'NotAnswered',
          type: '',
        },
      }));
      await saveUserResponse({
        realStudentId,
        realTestId,
        realCourseId,
        subject_id: subject.subjectId,
        section_id: section.sectionId,
        question_id: q.question_id,
        question_type_id: q?.questionType?.quesionTypeId,
        answered: '3',
      });
    }
    setActiveQuestionIndex(index);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  const saveUserResponse = async ({
    realStudentId,
    realTestId,
    realCourseId,
    subject_id,
    section_id,
    question_id,
    question_type_id,
    answered = '1'
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
        answered,
      };

      const res = await fetch(`${backEndUrl}/OTSTestPaper/SaveResponse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      return await res.json();
    } catch (error) {
      console.error('Save Error:', error);
      return { success: false };
    }
  };

  const renderQuestionImage = () => {
    if (question?.questionImgName) {
      return (
        <Image
          source={{ uri: question.questionImgName }}
          style={styles.questionImage}
          resizeMode="contain"
        />
      );
    }
    return <Text>No question available</Text>;
  };

  return (
    <View style={styles.mainContainerforquestion}>
      {/* Question Numbers */}
      <ScrollView horizontal style={styles.questionNumberRow}>
        {section?.questions?.map((q, idx) => (
          <TouchableOpacity
            key={q.question_id}
            onPress={() => handleQuestionClick(idx)}
            disabled={isDisabled}
            style={[
              styles.questionBtn,
              idx === activeQuestionIndex && styles.activeBtn,
            ]}
          >
            <Text style={styles.questionBtnText}>{idx + 1}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Scrollable Question Container */}
      <ScrollView ref={scrollRef} style={styles.questionContainer}>
        {/* Question Type and Marks Info */}
        <View style={styles.metaInfo}>
          <Text>Question Type: {question?.questionType?.quesionTypeId || 'N/A'}</Text>
          <Text>Marks: {question?.marks_text || 'N/A'} | Negative: {question?.nmarks_text || 'N/A'}</Text>
        </View>

        {/* Question Image */}
        {renderQuestionImage()}

        {/* Options would be a separate component */}
        <Text>/* Options Component Here */</Text>
      </ScrollView>

      {/* Scroll Controls */}
      <View style={styles.scrollButtons}>
        {showUp && (
          <TouchableOpacity onPress={scrollToTop}>
            <Icon name="arrow-up" size={24} />
          </TouchableOpacity>
        )}
        {showDown && (
          <TouchableOpacity onPress={scrollToBottom}>
            <Icon name="arrow-down" size={24} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};


export default QuestionsMainContainer;
