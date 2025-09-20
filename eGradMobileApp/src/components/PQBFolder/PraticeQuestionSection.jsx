import React, { useState, useRef, useCallback } from 'react';
import { View, Alert,Text, TouchableOpacity, TextInput, ScrollView, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // or AntDesign, MaterialIcons, etc.

import {styles} from "../../styles/OTSStyles.js"; // Custom styles should be redefined for React Native
import PraticeQuestionRender from "./PraticeQuestionRender.jsx";

const PraticeQuestionSection = ({
  practiceQuestionsData,
  activeSubjectIdx,
  activeSectionIdx,
  currentQuestionIdx,
  selectedOption,
  natAnswers,
  answeredQuestions,
  showSolution,
  showScientificCalc,
  cursorPos,
  OptionPatternId,
  showSolutionModal,
  setShowSolutionModal,
  showSidebar,
  onSubjectChange,
  onSectionChange,
  onQuestionChange,
  onToggleCalculator,
  onSetSelectedOption,
  onSetNatAnswers,
  onSetAnsweredQuestions,
  onSetShowSolution,
  onSetCursorPos,
  onSetCurrentQuestionIdx,
  onFinalSubmit,
  getCurrentSubjects,
  getCurrentSections,
  getCurrentSection,
  getCurrentQuestion,
  handleWithSession,
}) => {
  const paletteRef = useRef(null);
  const solutionRefs = useRef({});
  const inputRef = useRef({});
console.log(styles)
  const goToNextQuestion = useCallback(() => {
    const subjects = getCurrentSubjects();
    const currentSubject = subjects[activeSubjectIdx];
    const sections = currentSubject.sections;
    const totalQuestions = sections[activeSectionIdx]?.questions.length;

    const currentQ = sections[activeSectionIdx]?.questions[currentQuestionIdx];
    const qId = currentQ?.question_id;

    // Clear unsaved answers (MCQ + NAT)
    if (qId && !answeredQuestions[qId]) {
      if (selectedOption[qId] !== undefined) {
        onSetSelectedOption(prev => {
          const updated = { ...prev };
          delete updated[qId];
          return updated;
        });
      }

      if (natAnswers[qId] !== undefined) {
        onSetNatAnswers(prev => {
          const updated = { ...prev };
          delete updated[qId];
          return updated;
        });
      }
    }

    if (currentQuestionIdx < totalQuestions - 1) {
      onSetCurrentQuestionIdx(currentQuestionIdx + 1);
    } else if (activeSectionIdx < sections.length - 1) {
      onSectionChange(activeSectionIdx + 1);
      onSetCurrentQuestionIdx(0);
    } else if (activeSubjectIdx < subjects.length - 1) {
      onSubjectChange(activeSubjectIdx + 1);
      onSectionChange(0);
      onSetCurrentQuestionIdx(0);
    } else {
      onSubjectChange(0);
      onSectionChange(0);
      onSetCurrentQuestionIdx(0);
    }
  }, [activeSubjectIdx, activeSectionIdx, currentQuestionIdx, answeredQuestions, selectedOption, natAnswers, onSetSelectedOption, onSetNatAnswers, onSetCurrentQuestionIdx]);

  const goToPrevQuestion = useCallback(() => {
    const subjects = getCurrentSubjects();
    const currentSubject = subjects[activeSubjectIdx];
    const sections = currentSubject.sections;
    const currentQ = sections[activeSectionIdx]?.questions[currentQuestionIdx];
    const qId = currentQ?.question_id;

    if (qId && !answeredQuestions[qId] && selectedOption[qId] !== undefined) {
      onSetSelectedOption(prev => {
        const updated = { ...prev };
        delete updated[qId];
        return updated;
      });

      onSetNatAnswers(prev => {
        const updated = { ...prev };
        delete updated[qId];
        return updated;
      });
    }

    if (currentQuestionIdx === 0 && activeSectionIdx === 0 && activeSubjectIdx === 0) {
      return;
    }

    if (currentQuestionIdx > 0) {
      onSetCurrentQuestionIdx(currentQuestionIdx - 1);
    } else if (activeSectionIdx > 0) {
      const prevSectionIdx = activeSectionIdx - 1;
      onSectionChange(prevSectionIdx);
      const prevSectionQuestions = sections[prevSectionIdx].questions.length;
      onSetCurrentQuestionIdx(prevSectionQuestions - 1);
    } else if (activeSubjectIdx > 0) {
      const prevSubjectIdx = activeSubjectIdx - 1;
      const prevSubjectSections = subjects[prevSubjectIdx].sections;
      const lastSectionIdx = prevSubjectSections.length - 1;
      const lastQuestionIdx = prevSubjectSections[lastSectionIdx].questions.length - 1;

      onSubjectChange(prevSubjectIdx);
      onSectionChange(lastSectionIdx);
      onSetCurrentQuestionIdx(lastQuestionIdx);
    }
  }, [activeSubjectIdx, activeSectionIdx, currentQuestionIdx, answeredQuestions, selectedOption, onSetSelectedOption, onSetNatAnswers, onSetCurrentQuestionIdx, onSectionChange, onSubjectChange]);
  const toggleSolution = (qId) => {
    onSetShowSolution((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };
  const scrollPalette = (direction) => {
    if (paletteRef.current) {
      paletteRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  const getQuestionButtonClass = (question) => {
    const qId = question.question_id;
    const status = answeredQuestions[qId];

    if (!status) return styles.questionPaletteBtn;

    if (typeof status === 'string') {
      if (status === "correct") return styles.correctQuestion;
      if (status === "incorrect") return styles.incorrectQuestion;
      return styles.questionPaletteBtn;
    }

    if (typeof status === 'object') {
      if (status.status === "completed") return styles.correctQuestion;
      if (status.status === "failed") return styles.incorrectQuestion;
      if (status.status === "partial") return styles.partialCorrectQuestion;

      if (status.correctSelected && status.correctSelected.length > 0) {
        if (status.wrong && status.wrong.length === 0) {
          return styles.partialCorrectQuestion;
        }
        return styles.incorrectQuestion;
      }
    }

    return styles.questionPaletteBtn;
  };

  const handleMCQSelection = (qId, optionIdx) => {
    onSetSelectedOption(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleMSQSelection = (qId, optionIdx) => {
    const prevSelected = selectedOption[qId] || [];
    const alreadySelected = prevSelected.includes(optionIdx);

    const newSelected = alreadySelected
      ? prevSelected.filter(x => x !== optionIdx)
      : [...prevSelected, optionIdx];

    onSetSelectedOption(prev => ({ ...prev, [qId]: newSelected }));
  };

  const handleNATInput = (qId, value) => {
    onSetNatAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleArrowInput = (qId, direction) => {
    const inputElement = inputRef.current[qId];
    if (!inputElement) return;

    inputElement.focus();

    const currentPosition = inputElement.selectionStart;
    if (direction === "left" && currentPosition > 0) {
      inputElement.setSelectionRange(currentPosition - 1, currentPosition - 1);
    } else if (direction === "right" && currentPosition < inputElement.value.length) {
      inputElement.setSelectionRange(currentPosition + 1, currentPosition + 1);
    }
  }
  const handleCalculatorInput = (val) => {
    let currentValue = inputValue;
    if (val === "ClearAll") {
      currentValue = '';
      onSetNatAnswers((prev) => ({ ...prev, [qId]: '' }));
    } else if (val === "BackSpace") {
      if (cursorPos > 0) {
        currentValue = currentValue.slice(0, cursorPos - 1) + currentValue.slice(cursorPos);
        onSetNatAnswers((prev) => ({ ...prev, [qId]: currentValue }));
      }
    } else if (val === "-") {
      if (!currentValue.includes("-") && cursorPos === 0) {
        currentValue = "-" + currentValue;
        onSetNatAnswers((prev) => ({ ...prev, [qId]: currentValue }));
      }
    } else if (val === ".") {
      const numericPart = currentValue.startsWith("-") ? currentValue.slice(1) : currentValue;
      if (!numericPart.includes(".")) {
        if (currentValue === "" || currentValue === "-") {
          val = "0.";
        }
      }
    } else {
      currentValue = currentValue.slice(0, cursorPos) + val + currentValue.slice(cursorPos);
      onSetNatAnswers((prev) => ({ ...prev, [qId]: currentValue }));
    }
    setInputValue(currentValue);
  };

  const handleSaveAnswer = (q) => {
    const qId = q.question_id;
    const qtype = q.questionType?.qtype_text;
    let isCorrect = false;

    const userAnswerRaw = natAnswers[qId] || "";
    const correctAnswerRaw = q.correctAnswer?.toString()?.trim() || "";

    if (["MCQ", "MCQ4", "MCQ5", "TF", "CTQ"].includes(qtype)) {
      isCorrect = userAnswerRaw === correctAnswerRaw;
    } else if (qtype === "MSQ" || qtype === "MSQN") {
      const userAnswers = (selectedOption[qId] || "").toString().split(",");
      const correctAnswers = correctAnswerRaw.split(",");

      const correctSelected = userAnswers.filter(ans => correctAnswers.includes(ans));
      const wrongSelected = userAnswers.filter(ans => !correctAnswers.includes(ans));

      if (correctSelected.length === correctAnswers.length && wrongSelected.length === 0) {
        isCorrect = true;
      }
    } else if (["NATI", "NATD"].includes(qtype)) {
      let userAnswer = natAnswers[qId]?.toString()?.trim() || "";

      if (qtype === "NATI") userAnswer = userAnswer.replace(/[^0-9]/g, "");
      if (qtype === "NATD") userAnswer = userAnswer.replace(/[^0-9.\-]/g, "");

      const correctAnswer = parseFloat(correctAnswerRaw);
      const userNum = parseFloat(userAnswer);

      isCorrect = !isNaN(userNum) && userNum === correctAnswer;
    }

    Alert.alert(isCorrect ? "Correct!" : "Incorrect");
  };
   if (!practiceQuestionsData) {
    return <Text>Loading questions...</Text>;
  }

  return (
    <View style={styles.mainContainer}>
     <View style={styles.subjectContainer}>
          <ScrollView horizontal style={styles.questionNumberRow}>
        {getCurrentSubjects().map((subj, idx) =>
          subj?.SubjectName ? (
            <TouchableOpacity
              key={idx}
              style={[
                styles.subjectButton,
                idx === activeSubjectIdx && styles.activeButtontest,
              ]}
              onPress={handleWithSession(() => onSubjectChange(idx))}
            >
              <Text  style={[
                styles.subjectText,
                idx === activeSubjectIdx && styles.activeSubjectText,
              ]}>{subj.SubjectName}</Text>
            </TouchableOpacity>
          ) : null
        )}
        </ScrollView>
    

      {getCurrentSections().length > 0 && (
     <ScrollView horizontal style={styles.questionNumberRow}>
          {getCurrentSections().map((sec, idx) =>
            sec?.SectionName ? (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.sectionButton,
                  idx === activeSectionIdx && styles.activeSubjectAndSectionBtn,
                ]}
                onPress={handleWithSession(() => onSectionChange(idx))}
              >
                <Text>{sec.SectionName}</Text>
              </TouchableOpacity>
            ) : null
          )}
        </ScrollView>)}
  </View>
     <ScrollView horizontal style={styles.questionNumberRow}>
        
            <ScrollView horizontal style={styles.questionNumberRow}>
      <View style={styles.questionPaletteContainer}>
        <TouchableOpacity
          style={styles.scrollBtn}
          onPress={handleWithSession(() => scrollPalette('left'))}
        >
          <Icon name="chevron-left" size={24} color="black" />
        </TouchableOpacity>

        <ScrollView
          horizontal
          contentContainerStyle={styles.questionPalette}
          ref={paletteRef}
          showsHorizontalScrollIndicator={false}
        >
          {getCurrentSection().questions.map((q, idx) => (
            <TouchableOpacity
              key={q.question_id}
              style={[
                getQuestionButtonClass(q), // should return a RN style object
                idx === currentQuestionIdx && styles.activeQuestion,
              ]}
              onPress={handleWithSession(() => onQuestionChange(idx))}
            >
              <Text>{idx + 1}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.scrollBtn}
          onPress={handleWithSession(() => scrollPalette('right'))}
        >
          <Icon name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </ScrollView>
      
   </ScrollView>

      {/* <View style={styles.currentQuestionContainer}> */}
        <PraticeQuestionRender
          question={getCurrentQuestion()}
            OptionPatternId={OptionPatternId}
            currentQuestionIdx={currentQuestionIdx}
            selectedOption={selectedOption}
            natAnswers={natAnswers}
            answeredQuestions={answeredQuestions}
            showSolution={showSolution}
            showScientificCalc={showScientificCalc}
            cursorPos={cursorPos}
            inputRef={inputRef}
            showSidebar={showSidebar}
            solutionRefs={solutionRefs}
            onToggleCalculator={onToggleCalculator}
            onMCQSelection={handleMCQSelection}
            onMSQSelection={handleMSQSelection}
            onNATInput={handleNATInput}
            onArrowInput={handleArrowInput}
            onCalculatorInput={handleCalculatorInput}
            onToggleSolution={toggleSolution}
            onSaveAnswer={handleSaveAnswer}
            onPrevQuestion={goToPrevQuestion}
            onNextQuestion={goToNextQuestion}
            onFinalSubmit={onFinalSubmit}
            totalQuestions={getCurrentSection().questions.length}
             handleWithSession={handleWithSession}
             showSolutionModal={showSolutionModal}
             setShowSolutionModal={setShowSolutionModal}
        />
      {/* </View> */}
    </View>
  );
};



export default PraticeQuestionSection;