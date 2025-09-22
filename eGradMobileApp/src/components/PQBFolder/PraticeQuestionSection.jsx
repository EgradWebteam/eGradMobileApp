import React, { useState, useRef, useCallback } from 'react';
import { View, Alert, Text, TouchableOpacity, TextInput, ScrollView, FlatList, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // or AntDesign, MaterialIcons, etc.

import { styles } from "../../styles/OTSStyles.js"; // Custom styles should be redefined for React Native
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
  const cursorRef = useRef(0); // default cursor position 0

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

  // const getQuestionButtonClass = (question) => {
  //   const qId = question.question_id;
  //   const status = answeredQuestions[qId];

  //   if (!status) return styles.questionPaletteBtn;

  //   if (typeof status === 'string') {
  //     if (status === "correct") return styles.correctQuestion;
  //     if (status === "incorrect") return styles.incorrectQuestion;
  //     return styles.questionPaletteBtn;
  //   }

  //   if (typeof status === 'object') {
  //     if (status.status === "completed") return styles.correctQuestion;
  //     if (status.status === "failed") return styles.incorrectQuestion;
  //     if (status.status === "partial") return styles.partialCorrectQuestion;

  //     if (status.correctSelected && status.correctSelected.length > 0) {
  //       if (status.wrong && status.wrong.length === 0) {
  //         return styles.partialCorrectQuestion;
  //       }
  //       return styles.incorrectQuestion;
  //     }
  //   }

  //   return styles.questionPaletteBtn;
  // };
  const getQuestionButtonClass = (question) => {
    const qId = question.question_id;
    const status = answeredQuestions[qId];

    if (!status) {
      return {
        image: null,
        textColor: "#000",
        style: styles.questionPaletteBtn,
      };
    }

    if (typeof status === "string") {
      if (status === "correct")
        return {
          image: require("../../assets/Answered.png"),
          textColor: "#fff",
          style: styles.correctQuestion,
        };
      if (status === "incorrect")
        return {
          image: require("../../assets/NotAnswered.png"),
          textColor: "#fff",
          style: styles.incorrectQuestion,
        };
    }

    if (typeof status === "object") {
      if (status.status === "completed")
        return {
          image: require("../../assets/Answered.png"),
          textColor: "#fff",
          style: styles.correctQuestion,
        };
      if (status.status === "failed")
        return {
          image: require("../../assets/NotAnswered.png"),
          textColor: "#fff",
          style: styles.incorrectQuestion,
        };
      if (status.status === "partial")
        return {
          image: require("../../assets/partialImg.png"),
          textColor: "#000",
          style: styles.partialCorrectQuestion,
        };
    }

    return {
      image: null,
      textColor: "#000",
      style: styles.questionPaletteBtn,
    };
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

  inputElement.focus(); // Focus the input field

  let newCursorPos = cursorPos || 0;

  // Move cursor left
  if (direction === "left" && newCursorPos > 0) {
    newCursorPos -= 1;
  }
  // Move cursor right
  else if (direction === "right" && newCursorPos < natAnswers[qId].length) {
    newCursorPos += 1;
  }

  // Update the cursor position in the state
  onSetCursorPos(newCursorPos);

  // setTimeout(() => {
  //   // Sync the cursor visually with the new position
  //   inputElement.setSelectionRange(newCursorPos, newCursorPos);
  // }, 0);
};


const handleCalculatorInput = (qId, val, qtype) => {
  const inputElement = inputRef.current[qId];
  if (!inputElement) return;

  inputElement.focus(); // Focus the input field

  let currentValue = natAnswers[qId] || "";
  let newCursorPos = cursorPos[qId] || 0;

  if (val === "ClearAll") {
    currentValue = "";
    onSetNatAnswers((prev) => ({ ...prev, [qId]: "" }));
    onSetCursorPos(0);
    return;
  }

  if (val === "BackSpace") {
    if (newCursorPos > 0) {
      currentValue = currentValue.slice(0, newCursorPos - 1) + currentValue.slice(newCursorPos);
      newCursorPos -= 1; // Move cursor back
      onSetNatAnswers((prev) => ({ ...prev, [qId]: currentValue }));
    }
    return;
  }

  if (val === "-") {
    // Only allow "-" at the start
    if (!currentValue.includes("-") && newCursorPos === 0) {
      currentValue = "-" + currentValue;
      onSetNatAnswers((prev) => ({ ...prev, [qId]: currentValue }));
      newCursorPos += 1; // Move cursor after the minus sign
    }
    return;
  }

  if (val === ".") {
    const numericPart = currentValue.startsWith("-") ? currentValue.slice(1) : currentValue;
    if (numericPart.includes(".")) return;

    if (currentValue === "" || currentValue === "-") {
      val = "0."; // Automatically prepend 0 before dot
    }
  }

  // 🚫 Prevent inserting before the minus sign
  if (currentValue.startsWith("-") && newCursorPos === 0) {
    return;
  }

  // Insert the value at the cursor position
  const updatedValue = currentValue.slice(0, newCursorPos) + val + currentValue.slice(newCursorPos);
  newCursorPos += val.length; // Update cursor position after inserting the value

  onSetNatAnswers((prev) => ({ ...prev, [qId]: updatedValue }));

    // Move the cursor to the new position after a timeout to ensure the input updates first
    cursorRef.current = cursorPos; // Update cursor position
  };

  // const handleSaveAnswer = (q) => {
//     const qId = q.question_id;
//     const qtype = q.questionType?.qtype_text;
//     let isCorrect = false;

//     const userAnswerRaw = selectedOption[qId] || "";
//     const correctAnswerRaw = q.correctAnswer?.toString()?.trim() || "";

//     if (["MCQ", "MCQ4", "MCQ5", "TF", "CTQ"].includes(qtype)) {
//       isCorrect = userAnswerRaw === correctAnswerRaw;

//       onSetAnsweredQuestions((prev) => ({
//         ...prev,
//         [qId]: isCorrect ? "correct" : "incorrect",
//       }));

//     } else if (qtype === "MSQ") {
//       const userAnswers = Array.isArray(selectedOption[qId])
//         ? selectedOption[qId].map(String)
//         : (selectedOption[qId] || "").toString().split(",").map(a => a.trim());

//       const correctAnswers = Array.isArray(q.correctAnswer)
//         ? q.correctAnswer.map(String)
//         : correctAnswerRaw.split(",").map(a => a.trim());

//       const correctSelected = userAnswers.filter(ans => correctAnswers.includes(ans));
//       const wrongSelected = userAnswers.filter(ans => !correctAnswers.includes(ans));

//       let status = "failed";
//       if (correctSelected.length === correctAnswers.length && wrongSelected.length === 0) {
//         status = "completed";
//       }

//       onSetAnsweredQuestions((prev) => ({
//         ...prev,
//         [qId]: {
//           status,
//           accuracy: status === "completed" ? 1 : 0,
//           correctSelected,
//           wrong: wrongSelected,
//         },
//       }));

//     } else if (qtype === "MSQN") {
//       const userAnswers = Array.isArray(selectedOption[qId])
//         ? selectedOption[qId].map(String)
//         : (selectedOption[qId] || "").toString().split(",").map(a => a.trim());

//       const correctAnswers = Array.isArray(q.correctAnswer)
//         ? q.correctAnswer.map(String)
//         : correctAnswerRaw.split(",").map(a => a.trim());

//       const correctSelected = userAnswers.filter(ans => correctAnswers.includes(ans));
//       const wrongSelected = userAnswers.filter(ans => !correctAnswers.includes(ans));

//       let status = "failed";
//       if (correctSelected.length === correctAnswers.length && wrongSelected.length === 0) {
//         status = "completed";
//       } else if (correctSelected.length > 0 && wrongSelected.length === 0) {
//         status = "partial";
//       }

//       const accuracy = correctAnswers.length > 0 ? correctSelected.length / correctAnswers.length : 0;

//       onSetAnsweredQuestions((prev) => ({
//         ...prev,
//         [qId]: {
//           status,
//           accuracy,
//           correctSelected,
//           wrong: wrongSelected,
//         },
//       }));

//     } else if (["NATI", "NATD"].includes(qtype)) {
//       let userAnswer = natAnswers[qId]?.toString()?.trim() || "";

//       if (qtype === "NATI") userAnswer = userAnswer.replace(/[^0-9]/g, "");
//       if (qtype === "NATD") userAnswer = userAnswer.replace(/[^0-9.\-]/g, "");

//       if (correctAnswerRaw.includes("-")) {
//         const [minStr, maxStr] = correctAnswerRaw.split("-").map(s => s.trim());
//         const min = parseFloat(minStr);
//         const max = parseFloat(maxStr);
//         const userNum = parseFloat(userAnswer);

//         isCorrect = !isNaN(userNum) && !isNaN(min) && !isNaN(max) && userNum >= min && userNum <= max;
//       } else {
//         const userNum = parseFloat(userAnswer);
//         const correctNum = parseFloat(correctAnswerRaw);
//         isCorrect = !isNaN(userNum) && !isNaN(correctNum) && userNum === correctNum;
//       }

//       onSetAnsweredQuestions((prev) => ({
//         ...prev,
//         [qId]: isCorrect ? "correct" : "incorrect",
//       }));

//       onSetNatAnswers((prev) => ({ ...prev, [qId]: userAnswer }));
//     }
//   };

  const handleSaveAnswer = (q) => {
    const qId = q.question_id;
    const qtype = q.questionType?.qtype_text;
    let isCorrect = false;

    const userAnswerRaw = selectedOption[qId] || "";
    const correctAnswerRaw = q.correctAnswer?.toString()?.trim() || "";

    if (["MCQ", "MCQ4", "MCQ5", "TF", "CTQ"].includes(qtype)) {
      isCorrect = userAnswerRaw === correctAnswerRaw;

      onSetAnsweredQuestions((prev) => ({
        ...prev,
        [qId]: isCorrect ? "correct" : "incorrect",
      }));

    } else if (qtype === "MSQ") {
      // --- MSQ: no partial, only completed or failed ---
      const userAnswers = Array.isArray(selectedOption[qId])
        ? selectedOption[qId].map(String)
        : (selectedOption[qId] || "").toString().split(",").map(a => a.trim());

      const correctAnswers = Array.isArray(q.correctAnswer)
        ? q.correctAnswer.map(String)
        : correctAnswerRaw.split(",").map(a => a.trim());

      const correctSelected = userAnswers.filter(ans => correctAnswers.includes(ans));
      const wrongSelected = userAnswers.filter(ans => !correctAnswers.includes(ans));

      let status = "failed";
      if (correctSelected.length === correctAnswers.length && wrongSelected.length === 0) {
        status = "completed";
      } else {
        status = "failed"; // ✅ no partial for MSQ
      }

      onSetAnsweredQuestions((prev) => ({
        ...prev,
        [qId]: {
          status,
          accuracy: status === "completed" ? 1 : 0,
          correctSelected,
          wrong: wrongSelected,
        },
      }));

    } else if (qtype === "MSQN") {
      // --- MSQN: allow partial ---
      const userAnswers = Array.isArray(selectedOption[qId])
        ? selectedOption[qId].map(String)
        : (selectedOption[qId] || "").toString().split(",").map(a => a.trim());

      const correctAnswers = Array.isArray(q.correctAnswer)
        ? q.correctAnswer.map(String)
        : correctAnswerRaw.split(",").map(a => a.trim());

      const correctSelected = userAnswers.filter(ans => correctAnswers.includes(ans));
      const wrongSelected = userAnswers.filter(ans => !correctAnswers.includes(ans));

      let status = "failed";
      if (correctSelected.length === correctAnswers.length && wrongSelected.length === 0) {
        status = "completed";
      } else if (correctSelected.length > 0 && wrongSelected.length === 0) {
        status = "partial"; // ✅ only MSQN allows partial
      } else {
        status = "failed";
      }

      const accuracy = correctAnswers.length > 0 ? correctSelected.length / correctAnswers.length : 0;

      onSetAnsweredQuestions((prev) => ({
        ...prev,
        [qId]: {
          status,
          accuracy,
          correctSelected,
          wrong: wrongSelected,
        },
      }));
    } else if (["NATI", "NATD"].includes(qtype)) {
      let userAnswer = natAnswers[qId]?.toString()?.trim() || "";

      if (qtype === "NATI") userAnswer = userAnswer.replace(/[^0-9]/g, "");
      if (qtype === "NATD") userAnswer = userAnswer.replace(/[^0-9.\-]/g, "");

      if (correctAnswerRaw.includes("-")) {
        const [minStr, maxStr] = correctAnswerRaw.split("-").map(s => s.trim());
        const min = parseFloat(minStr);
        const max = parseFloat(maxStr);
        const userNum = parseFloat(userAnswer);

        isCorrect = !isNaN(userNum) && !isNaN(min) && !isNaN(max) && userNum >= min && userNum <= max;
      } else {
        const userNum = parseFloat(userAnswer);
        const correctNum = parseFloat(correctAnswerRaw);
        isCorrect = !isNaN(userNum) && !isNaN(correctNum) && userNum === correctNum;
      }

      onSetAnsweredQuestions((prev) => ({
        ...prev,
        [qId]: isCorrect ? "correct" : "incorrect",
      }));

      onSetNatAnswers((prev) => ({ ...prev, [qId]: userAnswer }));
    }
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
                <Text style={[
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
            {/* <TouchableOpacity
              style={styles.scrollBtn}
              onPress={handleWithSession(() => scrollPalette('left'))}
            >
              <Icon name="chevron-left" size={24} color="black" />
            </TouchableOpacity> */}

            <ScrollView
              horizontal
              contentContainerStyle={styles.questionPalette}
              ref={paletteRef}
              showsHorizontalScrollIndicator={false}
            >
              {getCurrentSection().questions.map((q, idx) => {
                const { image, textColor, style } = getQuestionButtonClass(q);

                return (
                  <TouchableOpacity
                    key={q.question_id}
                    onPress={handleWithSession(() => onQuestionChange(idx))}
                  >
                    <ImageBackground
                      source={image}
                      style={[style, idx === currentQuestionIdx && styles.activeQuestion]}
                      resizeMode="contain"
                    >
                      <Text style={{ color: textColor }}>{idx + 1}</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* <TouchableOpacity
              style={styles.scrollBtn}
              onPress={handleWithSession(() => scrollPalette('right'))}
            >
              <Icon name="chevron-right" size={24} color="black" />
            </TouchableOpacity> */}
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