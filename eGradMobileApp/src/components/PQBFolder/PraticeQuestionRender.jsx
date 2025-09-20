import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
// import { FaCalculator } from 'react-icons/fa'; // React Native does not support this directly
// import ScientificCalculator from './ScientificCalculator'; // Adjust this as per your needs
import correctImg from '../../images/correctImg.png';
import wrongImg from '../../images/wrongImg.png';
import { RadioButton } from 'react-native-paper';
import CheckBox from '@react-native-community/checkbox';
import {styles} from "../../styles/OTSStyles.js"; 
import ResponsiveImage from '../OTSFolder/ResponsiveImage.js';
const { width, height } = Dimensions.get('window');

const PracticeQuestionRender = ({
  question,
  currentQuestionIdx,
  selectedOption,
  natAnswers,
  answeredQuestions,
  showSolution,
  showScientificCalc,
  cursorPos,
  OptionPatternId,
  inputRef,
  solutionRefs,
  showSolutionModal,
  setShowSolutionModal,
  onToggleCalculator,
  onMCQSelection,
  onMSQSelection,
  onNATInput,
  onArrowInput,
  onCalculatorInput,
  onToggleSolution,
  onSaveAnswer,
  onPrevQuestion,
  onNextQuestion,
  onFinalSubmit,
  totalQuestions,
  onSetCursorPos,
  handleWithSession,
  showSidebar,
}) => {
  // const [showUp, setShowUp] = useState(false);
  // const [showDown, setShowDown] = useState(false);
  const questionScrollRefMobile = useRef(null);
  
  const [isMobile, setIsMobile] = useState(width <= 600 || height <= 700);
  const [activeSolutionTab, setActiveSolutionTab] = useState('image');
  const imageSolution = question?.solution?.solutionImgName;
  const videoSolution = question?.solution?.video_solution_link;
  const hasImage = !!imageSolution;
  const hasVideo = !!videoSolution;

  if (!question) return <Text>⚠️ No question found</Text>;

  const qId = question.question_id;
  const qtype = question?.questionType?.qtype_text;
  const isAnswered = answeredQuestions[qId];
  const showSol = showSolution[qId];

  useEffect(() => {
    const scrollTarget = questionScrollRefMobile.current;

    if (scrollTarget) {
      scrollTarget.scrollTo({ y: 0, animated: true });
    }
  }, [currentQuestionIdx]);

  useEffect(() => {
    if (showSol) {
      const solutionEl = solutionRefs.current[qId];
      if (!solutionEl) return;

      const img = solutionEl.querySelector('img');
      if (img && !img.complete) {
        img.onload = () => {
          solutionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
      } else {
        requestAnimationFrame(() => {
          solutionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    }
  }, [showSol, qId]);

  const getLabel = (indexedDB, optionIndex) => {
    if (OptionPatternId === 1) return `(${optionIndex.toUpperCase()})`;
    if (OptionPatternId === 2) return `(${optionIndex.toLowerCase()})`;
    if (OptionPatternId === 3) return `(${indexedDB + 1})`;
    return `(${optionIndex})`;
  };

  // Check if Save Answer should be disabled
  const saveDisabled =
    isAnswered ||
    (['MCQ4', 'MCQ5', 'TF', 'CTQ'].includes(qtype) && selectedOption[qId] === undefined) ||
    (['MSQ', 'MSQN'].includes(qtype) && (!selectedOption[qId] || selectedOption[qId].length === 0)) ||
    (['NATI', 'NATD'].includes(qtype) && (!natAnswers[qId] || natAnswers[qId].trim() === ''));

  // const updateScrollButtons = () => {
  //   const scrollTarget = questionScrollRefMobile.current;
  //   if (!scrollTarget) return;

  //   const { contentOffset, contentSize } = scrollTarget._scrollMetrics;
  //   setShowUp(contentOffset.y > 50);
  //   setShowDown(contentOffset.y + height < contentSize.height - 50);
  // };
    const keys = ["7","8","9","4","5","6","1","2","3","0",".","-"];
  
  return(
<View style={styles.mainContainer}>
      <View style={showSidebar ? styles.mainContainer : styles.fullWidth}>
      <Text style={styles.Textbold}>
        Question No.<Text style={styles.boldText}> {currentQuestionIdx + 1}</Text>
        {/* ({qtype}) */}
      </Text>

      {/* <View style={styles.rightControls}>
        <TouchableOpacity
          onPress={handleWithSession(onToggleCalculator)}
          accessibilityLabel="Calculator"
        >
          <FontAwesome name="calculator" size={28} color="black" />
        </TouchableOpacity>

        {showScientificCalc && (
          <View style={styles.scientificCalculatorContainer}>
            <ScientificCalculator onClose={onToggleCalculator} />
          </View>
        )}
      </View> */}
        <ScrollView
       style={
                 qtype === "CTQ"
                    ? styles.questionSplitContainer
                    : styles.optionsScroll
                }
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Left Column: Paragraph */}
        {qtype === "CTQ" && question.paragraph?.paragraphImgName && (
          <View style={styles.paragraphContainer}>
           
            <ResponsiveImage uri={question.paragraph.paragraphImgName} />
          </View>
        )}

        {/* Right Column */}
        <View style={styles.questionContainer}>
          {/* Question Image */}
          {question.questionImgName && (
          
              <ResponsiveImage uri={question.questionImgName} />
          )}
    <ScrollView contentContainerStyle={styles.excercisecontainer}>
          {/* Example MCQ Options */}
          {["MCQ4", "MCQ5", "TF", "CTQ"].includes(qtype) && (
            <RadioButton.Group
      onValueChange={(value) => onMCQSelection(qId, value)}
      value={selectedOption[qId]}
    >
      {question.options.map((opt, idx) => {
        const isCorrectOption = opt.option_index === question.correctAnswer;
        const isSelected = selectedOption[qId] === opt.option_index;

        return (
            <View key={opt.option_index} style={styles.optionRow}>
            {isAnswered ? (
              isCorrectOption ? (
                <Image source={correctImg} style={styles.optIcon} />
              ) : isSelected ? (
                <Image source={wrongImg} style={styles.optIcon} />
              ) : (
                <RadioButton.Item
                  label={getLabel(idx, opt.option_index)}
                  value={opt.option_index}
                  disabled
                 style={styles.radioItem}
                 labelStyle={styles.optionLabel}
                />
              )
            ) : (
              <RadioButton.Item
                label={getLabel(idx, opt.option_index)}
                value={opt.option_index}
                style={styles.radioItem}
              />
            )}
            {opt.optionImgName && (

               <ResponsiveImage uri={opt.optionImgName} />
            )}
          </View>
        );
      })}
    </RadioButton.Group>
          )}
            {["MSQ", "MSQN"].includes(qtype) && (
        <View style={styles.optionsContainer}>
          {question.options.map((opt, idx) => {
            const selectedList = selectedOption[qId] || [];
            const correctAnswers = question.correctAnswer
              ? question.correctAnswer.split(",").map((a) => a.trim())
              : [];

            const isCorrect = correctAnswers.includes(opt.option_index);
            const isSelected = selectedList.includes(opt.option_index);

            return (
              <View key={opt.option_index} style={styles.optionRow}>
                {isAnswered ? (
                  <>
                    {isCorrect && isSelected && (
                      <Image source={correctImg} style={styles.optIcon} />
                    )}
                    {!isCorrect && isSelected && (
                      <Image source={wrongImg} style={styles.optIcon} />
                    )}
                    {isCorrect && !isSelected && (
                      <Image source={correctImg} style={styles.optIcon} />
                    )}
                    {!isCorrect && !isSelected && (
                      <Checkbox status="unchecked" disabled />
                    )}
                    <Text style={styles.optionText}>
                      {getLabel(idx, opt.option_index)}
                    </Text>
                  </>
                ) : (
                  <>
                    <Checkbox
                      status={isSelected ? "checked" : "unchecked"}
                      onValueChange={() => onMSQSelection(qId, opt.option_index)}
                    />
                    <Text style={styles.optionText}>
                      {getLabel(idx, opt.option_index)}
                    </Text>
                  </>
                )}
                {opt.optionImgName && (
                  <ResponsiveImage uri={opt.optionImgName} />
                )}
              </View>
            );
          })}
        </View>
      )}
          {/* NAT Questions (TextInput + Keypad) */}
          {["NATI", "NATD"].includes(qtype) && (
            <View style={styles.natContainer}>
              <TextInput
                style={styles.natInput}
                value={natAnswers[question.question_id] || ""}
                onChangeText={(val) =>
                  onNATInput(question.question_id, val)
                }
                editable={!answeredQuestions[question.question_id]}
              />
              {question.exercise_answer_unit && (
                <Text style={styles.answerUnit}>
                  {question.exercise_answer_unit}
                </Text>
              )}
                      <View style={styles.backSpaceBtn}>
      {/* Backspace */}
      <TouchableOpacity
       style={styles.backSpaceButton}
        onPress={() => onCalculatorInput(questionId, "BackSpace", qtype)}
        disabled={isDisabled}
      >
        <Text style={styles.calcText}>BACK SPACE</Text>
      </TouchableOpacity>
 </View>
      {/* Keypad */}
      <View style={styles.CalculatorBox}>
        {keys.map((key) => (
          <TouchableOpacity
            key={key}
            style={styles.calcButton}
            onPress={() => onCalculatorInput(questionId, key, qtype)}
            disabled={!!answeredQuestions[questionId]}
          >
            <Text style={styles.calcText}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Left / Right Arrows */}
   <View style={styles.arrowBtns}>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => onArrowInput(questionId, "left")}
          disabled={!!answeredQuestions[questionId]}
        >
          <Text style={styles.arrowText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity
        style={styles.arrowButton}
          onPress={() => onArrowInput(questionId, "right")}
          disabled={!!answeredQuestions[questionId]}
        >
          <Text style={styles.arrowText}>→</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.backSpaceBtn}>
      {/* Clear All */}
      <TouchableOpacity
        style={styles.backSpaceButton}
        onPress={() => onCalculatorInput(questionId, "ClearAll", qtype)}
        disabled={!!answeredQuestions[questionId]}
      >
        <Text style={styles.calcText}>CLEAR ALL</Text>
      </TouchableOpacity></View>
    </View>
           
          )}

          {/* Solution Modal Example */}
          {isAnswered && showSolutionModal && (
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setShowSolutionModal(false)}
                >
                  <Text style={{ fontSize: 20 }}>×</Text>
                </TouchableOpacity>

                {hasImage && (
                  <Image
                    source={{ uri: imageSolution }}
                    style={styles.solutionImage}
                    resizeMode="contain"
                  />
                )}

                {hasVideo && (
                  <View style={styles.videoContainer}>
                    <WebView
                      source={{ uri: videoSolution }}
                      style={{ height: 300 }}
                    />
                  </View>
                )}
              </View>
            </View>
          )}
          </ScrollView>
        </View>
      </ScrollView>
    </ScrollView>
    </View>
  </View>
  );
};
  export default PracticeQuestionRender