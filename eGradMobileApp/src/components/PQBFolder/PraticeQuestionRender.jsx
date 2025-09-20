import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, StyleSheet ,Modal} from 'react-native';
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
console.log(isAnswered,qId,answeredQuestions)
  useEffect(() => {
    const scrollTarget = questionScrollRefMobile.current;

    if (scrollTarget) {
      scrollTarget.scrollTo({ y: 0, animated: true });
    }
  }, [currentQuestionIdx]);

  const scrollViewRef = useRef(null);

  // useEffect(() => {
  //   if (showSol && solutionRefs.current[qId]) {
  //     const solutionEl = solutionRefs.current[qId];
      
  //     // Get the position of the solution container
  //     solutionEl.measureLayout(scrollViewRef.current, (x, y, width, height) => {
  //       // Scroll to the position of the solution container
  //       scrollViewRef.current.scrollTo({ y: y, animated: true });
  //     });
  //   }
  // }, [showSol, qId]);

  const getLabel = (indexedDB, optionIndex) => {
    if (OptionPatternId === 1) return `(${optionIndex.toUpperCase()})`;
    if (OptionPatternId === 2) return `(${optionIndex.toLowerCase()})`;
    if (OptionPatternId === 3) return `(${indexedDB + 1})`;
    return `(${optionIndex})`;
  };

  // Check if Save Answer should be disabled
  const saveDisabled =
     isAnswered !== null||
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
              const isAnswered = answeredQuestions[qId];
        return (
            <View key={opt.option_index} style={styles.optionRow}>
            {isAnswered !==null ? (
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
                {isAnswered !== null ? (
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

             {isAnswered !== null && ["NATI", "NATD"].includes(qtype) && (
        <View style={styles.natFeedback}>
          {answeredQuestions[qId] === "correct" ? (
            <Text style={styles.correctText}>
              ✅ Correct Answer: <Text style={{ fontWeight: 'bold' }}>{question.correctAnswer}</Text>
            </Text>
          ) : (
            <Text style={styles.wrongText}>
              ❌ Wrong Answer ✅ <Text style={{ fontWeight: 'bold' }}>Correct Answer:</Text> {question.correctAnswer}
            </Text>
          )}
        </View>
      )}

      {/* Solution Modal */}
    {isAnswered !== null && showSolutionModal && (
      <Modal
          transparent={true}
          animationType="fade"
          visible={showSolutionModal}
          onRequestClose={() => setShowSolutionModal(false)}
        >

   
        <TouchableOpacity
          style={styles.modalCloseBtn}
          onPress={() => setShowSolutionModal(false)}
        >
          <Text style={{ fontSize: 20 }}>×</Text>
        </TouchableOpacity>

        <View style={styles.solutionContainer}>
          {/* Display solution based on tabs */}
          {hasImage || hasVideo ? (
            <>
              <View style={styles.solutionTabs}>
                {hasImage && (
                  <TouchableOpacity
                    onPress={() => setActiveSolutionTab('image')}
                    style={
                      activeSolutionTab === 'image'
                        ? styles.activeSolutionTab
                        : styles.solutionTab
                    }
                  >
                    <Text>View Image Solution</Text>
                  </TouchableOpacity>
                )}
                {hasVideo && (
                  <TouchableOpacity
                    onPress={() => setActiveSolutionTab('video')}
                    style={
                      activeSolutionTab === 'video'
                        ? styles.activeSolutionTab
                        : styles.solutionTab
                    }
                  >
                    <Text>View Video Solution</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.solutionTitle}>Solution</Text>

              {/* Display Image or Video based on active tab */}
              {activeSolutionTab === 'image' && hasImage && (
                <View style={styles.solutionImage}>
                  <Image
                    source={{ uri: imageSolution }}
                    style={styles.imageSolution}
                  />
                </View>
              )}

              {activeSolutionTab === 'video' && hasVideo && (
                <View style={styles.videoContainer}>
                  <WebView
                    source={{ uri: videoSolution }}
                    style={{ width: '100%', height: 315 }}
                  />
                </View>
              )}
            </>
          ) : (
            <Text>No solution available.</Text>
          )}
        </View>
   
 </Modal>
)}



          </ScrollView>
        </View>
      </ScrollView>
    </ScrollView>

    </View>
    <View style={styles.footerContainerpqb}>
      <View style={styles.QuestionNavigationButtonsMainContainer}>
        <View style={styles.btnsSubContainer}>
          <View style={styles.solutionToggle}>
            {/* Previous Button */}
            <TouchableOpacity
              style={styles.NavigationButton}
              onPress={handleWithSession(onPrevQuestion)}
            >
              <Text 
              // style={styles.buttonText}
              >Previous</Text>
            </TouchableOpacity>

            {/* Save Answer Button */}
            
              <TouchableOpacity
                style={[
                  styles.NavigationButton,
                  saveDisabled ? styles.disabledButton : null,
                ]}
                disabled={saveDisabled}
                onPress={handleWithSession(() => onSaveAnswer(question))}
              >
                <Text 
                // style={styles.buttonText}
                >Check Answer</Text>
              </TouchableOpacity>
           

            {/* View/Hide Solution Button */}
           
              <TouchableOpacity
                style={[
                  styles.NavigationButton,
                  isAnswered ===null ? styles.disabledButton : null,
                ]}
                disabled={!isAnswered ===null}
                onPress={handleWithSession(() => {
                  if (!isAnswered ===null) return;
                  onToggleSolution(qId);
                  setActiveSolutionTab("image");
                  setShowSolutionModal(true);
                })}
              >
                <Text 
                // style={styles.buttonText}
                >View Solution</Text>
              </TouchableOpacity>
          
          </View>

          {/* Question Counter */}
          <Text style={styles.questionCounter}>
            Question {currentQuestionIdx + 1} of {totalQuestions}
          </Text>

          {/* Next Button */}
          <TouchableOpacity
            style={styles.NavigationButton}
            onPress={handleWithSession(onNextQuestion)}
          >
            <Text>Next</Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <View style={styles.submitBtnCls}>
         
          <TouchableOpacity
            onPress={handleWithSession(onFinalSubmit)}
            style={styles.NavigationButton}
          >
            <Text>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
         </View>
  </View>
  );
};
  export default PracticeQuestionRender