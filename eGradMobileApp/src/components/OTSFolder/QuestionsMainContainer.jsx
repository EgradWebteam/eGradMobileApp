import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
// import { useSession } from '../../StudentDashboard/hooks/SessionContext'; // Assume it's RN-compatible
import { styles } from '../../styles/OTSStyles';
import axios from 'axios';
import QuestionOptionsContainer from './QuestionOptionsContainer';
import { backEndUrl, frontEndUrl,backEndPort } from "../../apiConfig";
import Icon from 'react-native-vector-icons/FontAwesome';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';





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
  isDisabled,
}) => {
  const questionScrollRefMobile = useRef(null);
  const questionScrollRefDesktop = useRef(null);

  const [isMobile, setIsMobile] = useState(
    Dimensions.get('window').width <= 768 || Dimensions.get('window').height <= 768
  );
  const savedAnswer = userAnswers?.[String(question?.question_id)];
  useEffect(() => {
    const handleResize = ({ window }) => {
      setIsMobile(window.width <= 768 || window.height <= 768);
    };

    const subscription = Dimensions.addEventListener('change', handleResize);
    return () => subscription?.remove();
  }, []);

  const getScrollTarget = () => {
    return isMobile ? questionScrollRefMobile.current : questionScrollRefDesktop.current;
  };

  const subject = testData?.subjects?.find(
    (sub) => sub.SubjectName === activeSubject
  );

  const section = subject?.sections?.find(
    (sec) => sec.SectionName === activeSection
  );

  const question = section?.questions?.[activeQuestionIndex] || null;

//   useEffect(() => {
//     const scrollTarget = getScrollTarget();
//     if (scrollTarget) {
//       setTimeout(() => {
//         scrollTarget.scrollTo({ y: 0, animated: true });
//       }, 100);
//     }
//   }, [activeQuestionIndex, activeSection, activeSubject, isMobile]);

  useEffect(() => {
    setSelectedOption(null);
    setSelectedOptionsArray([]);
    setNatValue('');

    const currentQuestion = section?.questions?.[activeQuestionIndex];
    const saved = userAnswers?.[currentQuestion?.question_id];

    if (saved) {
      if (saved.type === 'MCQ' && saved.optionId) {
        setSelectedOption({
          option_id: saved.optionId,
          option_index: saved.optionIndex,
        });
      }
      if (saved.type === 'MSQ' && Array.isArray(saved.selectedOptions)) {
        setSelectedOptionsArray(saved.selectedOptions);
      }
      if (saved.type === 'NAT' && typeof saved.natAnswer === 'string') {
        setNatValue(saved.natAnswer);
      }
    }
  }, [activeSubject, activeSection, activeQuestionIndex, userAnswers]);

  const handleQuestionClick = async (index) => {
    // Commented session validation for now
    // const isValid = await validateSessionWithoutNavigation();

    const question = section?.questions?.[index];
    if (!question) return;

    const existing = userAnswers?.[question.question_id];
    if (!existing) {
      setUserAnswers((prev) => ({
        ...prev,
        [question.question_id]: {
          subjectId: subject.subjectId,
          sectionId: section.sectionId,
          questionId: question.question_id,
          buttonClass: 'NotAnsweredBtnCls',
          type: '',
        },
      }));

      await saveUserResponse({
        realStudentId,
        realTestId,
        realCourseId,
        subject_id: subject.subjectId,
        section_id: section.sectionId,
        question_id: question.question_id,
        question_type_id: question?.questionType?.quesionTypeId,
        answered: '3',
      });
    }

    setActiveQuestionIndex(index);
  };

  const saveUserResponse = async ({
    realStudentId,
    realTestId,
    realCourseId,
    subject_id,
    section_id,
    question_id,
    question_type_id,
    optionIndexes1 = '',
    optionIndexes2 = '',
    optionIndexes1CharCodes = [],
    optionIndexes2CharCodes = [],
    calculatorInputValue = '',
    answered = '1',
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

      const response = await fetch(`${backEndUrl}/OTSTestPaper/SaveResponse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });


      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in saveUserResponse:', error);
      return { success: false, message: 'Network error' };
    }
  };

  const getQuestionMeta = () => {
    const questionTypeId = question?.questionType?.quesionTypeId;
    let displayQuestionType = '';

    if ([1, 2].includes(questionTypeId)) {
      displayQuestionType = 'MCQ';
    } else if ([3, 4].includes(questionTypeId)) {
      displayQuestionType = 'MSQ';
    } else if ([5, 6].includes(questionTypeId)) {
      displayQuestionType = 'NAT';
    } else if ([8].includes(questionTypeId)) {
      displayQuestionType = 'CTQ';
    }

    return {
      questionType: displayQuestionType,
      marks: question?.marks_text || 'N/A',
      negativeMarks: question?.nmarks_text || 'N/A',
    };
  };

  const handleLeftClickMain = () => {
    setShowSidebar((prev) => !prev);
  };

  const { questionType, marks, negativeMarks } = getQuestionMeta();

  const paragraphId = question?.paragraph?.paragraph_id;
  const paragraph = testData?.paragraphs?.find(
    (p) => p.paragraph_id === paragraphId
  );

  const isParagraphPresent = !!paragraph?.paragraphImgName;

  const renderQuestion = (question) => {
    console.log(question)
    if (!question) return <Text>No question available.</Text>;

    return (
      <View style={styles.questionImageContainer}>
        {question.questionImgName ? (
          <Image
           source={{ uri: question.questionImgName }}
  style={{ width: 300, height: 300, backgroundColor: '#eee' }}
  resizeMode="contain"
  onError={(e) => {
    console.log('Image load error:', e.nativeEvent.error);
  }}
          />
        ) : (
          <Text>No image available.</Text>
        )}
      </View>
    );
  }; 
   return (
    <View style={styles.mainContainerforquestion}>
      
      <ScrollView horizontal style={styles.questionNumberRow}>
        {section?.questions?.map((q, index) => {
         const savedAnswer = userAnswers?.[q.question_id];
            const currentSectionId = Number(
              section?.sectionId ?? section?.section_id ?? 0
            );
            const savedSectionId = Number(savedAnswer?.sectionId ?? 0);
            const isFromCurrentSection = savedSectionId === currentSectionId;
            const answerClass =
              isFromCurrentSection && savedAnswer?.buttonClass
                ? savedAnswer.buttonClass
                : styles.NotVisitedBehaviourBtns;

          return (
            <View key={q.question_id} style={styles.questionNumberRow}>
              <TouchableOpacity
                style={[
                  styles.questionBtn,
                  index === activeQuestionIndex && styles.activeBtn,
                  answerClass,
                ]}
                onPress={() => handleQuestionClick(index)}
                disabled={isDisabled}
              >
                <Text style={styles.questionBtnText}>{index + 1}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      <View style={showSidebar ? styles.mainContainer : styles.fullWidth}>
        <View style={styles.typeHolder}>
          <Text>
            Question Type: <Text style={styles.boldText}>{questionType}</Text>
          </Text>
          <View style={styles.marksContainer}>
            <Text>
              Marks for Correct Answer: <Text style={styles.correctMarks}>{marks}</Text>
            </Text>
            <Text style={styles.separator}> | </Text>
            <Text>
              Negative Marks: <Text style={styles.negativeMarks}>{negativeMarks}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.questionNumberContainer}>
          <Text>Question No. {activeQuestionIndex + 1}</Text>
        </View>

        <ScrollView
          ref={questionScrollRefDesktop}
          style={
            isParagraphPresent
              ? styles.questionSplitContainer
              : styles.optionsScroll
          }
        >
          {isParagraphPresent && (
            <View style={styles.paragraphContainer}>
              {paragraph?.paragraphImgName ? (
                <Image
                  source={{ uri: paragraph.paragraphImgName }}
                  style={styles.paragraphImage}
                />
              ) : (
                <Text>Loading...</Text> // Replace with Skeleton if needed
              )}
            </View>
          )}

          <View ref={questionScrollRefMobile} style={styles.questionContainer}>
            {renderQuestion(question)}
            <QuestionOptionsContainer
              options={question?.options || []}
              optPatternId={testData?.opt_pattern_id}
              questionTypeId={question?.questionType?.quesionTypeId}
              onSelectOption={setSelectedOption}
              savedAnswer={savedAnswer}
              selectedOption={selectedOption}
              questionId={question?.question_id}
              selectedOptionsArray={selectedOptionsArray}
              setSelectedOptionsArray={setSelectedOptionsArray}
              natValue={natValue}
              setNatValue={setNatValue}
              selectedSubjects={selectedSubjects}
              isDisabled={isDisabled}
            />
          </View>
        </ScrollView>

        {showSidebar && (
          <View style={styles.chevronButton}>
            <TouchableOpacity onPress={handleLeftClickMain}>
              {/* <FaChevronLeft /> Use VectorIcon here in real RN app */}erwr
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};


export default QuestionsMainContainer;
