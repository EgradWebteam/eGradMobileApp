import React, { useEffect, useState ,useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  CheckBox
} from "react-native";
import { styles } from "../../styles/OTSStyles";
 import { backEndUrl, frontEndUrl,backEndPort } from "../../apiConfig.js";
import { saveCurrentQuestionProgress } from "./saveCurrentQuestionProgress.jsx";
console.log(styles)
const SubjectsAndSectionsContainer = ({
  testData,
  activeSubject,
  setActiveSubject,
  activeSection,
  setActiveSection,
  autoSaveNATIfNeeded,
  setActiveQuestionIndex,
  activeQuestionIndex,
  userAnswers,
  realCourseId,
  realStudentId,
  realTestId,
  setUserAnswers,
  getElapsedTimeForCurrentQuestion,
  showResetTable,
  setShowResetTable,
  showUnselectWarning,
  setShowUnselectWarning,
  selectedSubjects,
  setSelectedSubjects,
}) => {
  const [subjectToUnselect, setSubjectToUnselect] = useState(null);
  const [pendingSubjectToAdd, setPendingSubjectToAdd] = useState(null);
  const subjects = testData?.subjects || [];
  const typeOfTestId = testData?.courseTypeOfTestId || 0;

  const getSections = (subjectName) => {
    const subject = subjects.find((sub) => sub.SubjectName === subjectName);
    return subject?.sections || [];
  };

  const getDisplaySubjectName = (subject) => {
    if (typeOfTestId === 1 && subject.chapter_name) return subject.chapter_name;
    if (typeOfTestId === 2 && subject.topic_name) return subject.topic_name;
    return subject.SubjectName;
  };

  const isOptionalSubject = (subjectName) => {
    const subject = subjects.find((s) => s.SubjectName === subjectName);
    return subject?.sectionType === "Optional";
  };


const nonOptionalSubjects = useMemo(
  () => subjects.filter((s) => s.sectionType === "Normal"),
  [subjects]
);


  useEffect(() => {
    if (nonOptionalSubjects.length > 0) {
      const defaultSubject = nonOptionalSubjects[0];
      setActiveSubject(defaultSubject.SubjectName);
      const defaultSections = getSections(defaultSubject.SubjectName);
      if (defaultSections.length > 0) {
        setActiveSection(defaultSections[0].SectionName);
        setActiveQuestionIndex(0);
      } else {
        setActiveSection(null);
      }
    }
  }, [testData]);

  useEffect(() => {
    const fetchSelectedOptionalSubjects = async () => {
      const studentId = realStudentId;
      const testId = testData?.testId;
      if (!studentId || !testId) return;

      try {
        const res = await fetch(`${backEndUrl}/OTSTestPaper/GetSelectedSubjects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            realStudentId: studentId,
            realTestId: testId,
            realCourseId: realCourseId,
          }),
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.selectedOptionalSubjects)) {
          setSelectedSubjects(data.selectedOptionalSubjects);
          if (data.selectedOptionalSubjects.length > 0) {
            const first = data.selectedOptionalSubjects[0];
            setActiveSubject(first);
            const subjectSections = getSections(first);
            setActiveSection(subjectSections[0]?.SectionName || null);
            setActiveQuestionIndex(0);
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    if (testData?.testId) {
      fetchSelectedOptionalSubjects();
    }
  }, [testData]);
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
  answered = "1", // default to '1' for answered, pass '2' for review
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
      TimeSpentOnQuestion,
    };

    const res = await fetch(`${backEndUrl}/OTSTestPaper/SaveResponse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in saveUserResponse:", error);
    return { success: false, message: "Network error" };
  }
};
  const getAnsweredStatusFromButtonClass = (buttonClass) => {
    switch (buttonClass) {
      case `AnswerdBtnCls`:
        return "1"; // Answered
      case `AnsMarkedForReview`:
        return "2"; // Marked and Answered
      case `NotAnsweredBtnCls`:
        return "3"; // Not Answered
      case `MarkedForReview`:
        return "4"; // Marked Only
      default:
        return "3"; // Default to Not Answered
    }
  };
 const handleSubjectBtnClick = async (subjectName) => {
    // this is to save current question progress.
    console.log("hii")
    await saveCurrentQuestionProgress({
      testData,
      activeSubject,
      activeSection,
      activeQuestionIndex,
      userAnswers,
      setUserAnswers,
      getElapsedTimeForCurrentQuestion,
      getAnsweredStatusFromButtonClass,
      saveUserResponse,
      realStudentId,
      realTestId,
      realCourseId,
      autoSaveNATIfNeeded
    });
    console.log(subjectName, "this is the subject name");
    console.log("hi2");
    // 2. Proceed with subject change after time is saved
    setActiveSubject(subjectName);
    console.log("hi3");
    const subject = testData?.subjects?.find((subj) => subj.SubjectName === subjectName);
    console.log(subject, "this is the subject, ", subject?.subjectId);
    const subject_id = subject?.subjectId;

    // if the subject contains sections then we are setting the active index to 0
    // even if the subject do not contains sec, the below will be true
    if (subject?.sections?.length > 0) {
      console.log(subject?.sections?.length, "subject?.sections?.length", subject?.sections)
      setActiveSection(subject.sections[0].SectionName);
      console.log("giir")
      setActiveQuestionIndex(0);
      const firstSection = subject.sections[0];
      const firstQuestionId = firstSection.questions?.[0]?.question_id ?? null;
      const firstQuestion = firstSection.questions?.[0];
      const firstQuestionTypeId = firstQuestion?.questionType?.quesionTypeId ?? null;
      const existingAnswer = userAnswers?.[firstQuestionId];
      console.log(existingAnswer)
      const timeSpent = getElapsedTimeForCurrentQuestion() + (existingAnswer?.TimeSpentOnQuestion ?? 0);
     if(!existingAnswer){
      await saveUserResponse({
        realStudentId,
        realTestId,
        realCourseId,
        subject_id,
        section_id: firstSection?.sectionId ?? null,
        question_id: firstQuestionId,
        TimeSpentOnQuestion: timeSpent,
        question_type_id: firstQuestionTypeId,
        optionIndexes1:  [],
        optionIndexes1CharCodes: [],
        calculatorInputValue:  "",
        answered: "3",
      }
    
      );}
      // answered: existingAnswer
      //     ? (existingAnswer.optionId || existingAnswer.optionIndexes1 ? "1" : "3")
      //     : "3",
      console.log(subject.sections[0].SectionName, "thisi s the current subjects section name  ");
      // await
    } else {
      setActiveSection(null);
    }


  };
  const handleSubjectSelect = (subjectName) => {
    console.log("hi1");
    const isSelected = selectedSubjects.includes(subjectName);
    if (isSelected) {
      setShowResetTable(false); // 🧹 Make sure reset table is hidden
      setSubjectToUnselect(subjectName);
      setShowUnselectWarning(true);
      return;
    }
        console.log("hi2");
    autoSaveNATIfNeeded();
    const optionalSelected = selectedSubjects.filter((s) =>
      isOptionalSubject(s)
    );
    if (isOptionalSubject(subjectName) && optionalSelected.length >= 2) {
      //  Deselect warning must not be showing when we show reset table
      setShowUnselectWarning(false); // 🧹 Hide warning
      setSubjectToUnselect(null);
      setPendingSubjectToAdd(subjectName);
      setShowResetTable(true);
      return;
    }
    const updated = [...selectedSubjects, subjectName];
    setSelectedSubjects(updated);
    console.log("hi3");
    setActiveSubject(subjectName);
            console.log("hi4");
    const subjectSections = getSections(subjectName);
    setActiveSection(subjectSections[0]?.SectionName || null);
    setActiveQuestionIndex(0);
  };

  const handleUnselectSubject = async (subjectName) => {
    const subject = subjects.find((s) => s.SubjectName === subjectName);
    if (!subject) return;
    const subjectId = subject.subjectId;

    try {
      await fetch(`${backEndUrl}/OTSTestPaper/ResetSubjectResponses`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: realStudentId,
          testId: testData?.testId,
          subjectId,
        }),
      });
    } catch (error) {
      console.error("Error resetting subject:", error);
    }

    const updatedAnswers = { ...userAnswers };
    subject?.sections?.forEach((section) => {
      section.questions?.forEach((q) => {
        delete updatedAnswers[q.QuestionID || q.question_id];
      });
    });
    setUserAnswers(updatedAnswers);

    const updatedSelected = selectedSubjects.filter((s) => s !== subjectName);
    setSelectedSubjects(updatedSelected);

    if (pendingSubjectToAdd) {
      const newSubjects = [...updatedSelected, pendingSubjectToAdd];
      setSelectedSubjects(newSubjects);
      setActiveSubject(pendingSubjectToAdd);
      const subjectSections = getSections(pendingSubjectToAdd);
      setActiveSection(subjectSections[0]?.SectionName || null);
      setPendingSubjectToAdd(null);
    } else {
      const newActive = updatedSelected[0] || "";
      setActiveSubject(newActive);
      const newSections = getSections(newActive);
      setActiveSection(newSections[0]?.SectionName || null);
      setActiveQuestionIndex(0);
    }

    setShowUnselectWarning(false);
    setShowResetTable(false);
  };
  const cancelUnselectSubject = () => {
    setShowUnselectWarning(false);
    setSubjectToUnselect(null);
  };
  const handleSectionChange = async (section) => {
    await saveCurrentQuestionProgress({
      testData,
      activeSubject,
      activeSection,
      activeQuestionIndex,
      userAnswers,
      setUserAnswers,
      getElapsedTimeForCurrentQuestion,
      saveUserResponse,
      getAnsweredStatusFromButtonClass,
      realStudentId,
      realTestId,
      realCourseId,
      autoSaveNATIfNeeded
    });

    setActiveSection(section.SectionName);
    setActiveQuestionIndex(0);
      const subject = testData?.subjects?.find(
    (subj) => subj.SubjectName === activeSubject
  );

  const subject_id = subject?.subjectId;
          const firstQuestionId = section.questions?.[0]?.question_id ?? null;
      const firstQuestion = section.questions?.[0];
      const firstQuestionTypeId = firstQuestion?.questionType?.quesionTypeId ?? null;
      const existingAnswer = userAnswers?.[firstQuestionId];
      console.log(existingAnswer)
      const timeSpent = getElapsedTimeForCurrentQuestion() + (existingAnswer?.TimeSpentOnQuestion ?? 0);
     if(!existingAnswer){
      await saveUserResponse({
        realStudentId,
        realTestId,
        realCourseId,
        subject_id,
        section_id: section?.sectionId ?? null,
        question_id: firstQuestionId,
        TimeSpentOnQuestion: timeSpent,
        question_type_id: firstQuestionTypeId,
        optionIndexes1:  [],
        optionIndexes1CharCodes: [],
        calculatorInputValue:  "",
        answered: "3",
      }
    
      );}
  };

  return (
    <View >
   <View style={styles.subjectContainer}>
    <ScrollView horizontal style={styles.questionNumberRow}>
      {/* <Text style={styles.title}>Subjects</Text> */}

      {subjects.map((subject, index) => {
        const subjectName = subject.SubjectName;
        const isOptional = subject.sectionType === "Optional";
        const isChecked = selectedSubjects.includes(subjectName);
        const displayName = getDisplaySubjectName(subject);

        return (
          <View key={index} >
            {isOptional && (
              <CheckBox
                value={isChecked}
                onValueChange={() => handleSubjectSelect(subjectName)}
              />
            )}
            <TouchableOpacity
              style={[
                styles.subjectButton,
                activeSubject === subjectName && styles.activeButton,
              ]}
              onPress={() => handleSubjectBtnClick(subjectName)}
            >
              <Text 
               style={[
                styles.subjectText,
                activeSubject === subjectName && styles.activeSubjectText,
              ]}
           >{displayName}</Text>
            </TouchableOpacity>
          </View>
        );
      })}
</ScrollView>
      {/* <Text style={styles.title}>Sections</Text> */}
       { activeSection &&(<ScrollView horizontal style={styles.questionNumberRow}>
 {activeSection && getSections(activeSubject).map((section, idx) => (
        <TouchableOpacity
          key={idx}
          style={[
            styles.sectionButton,
            activeSection === section.SectionName && styles.activeButton,
          ]}
          onPress={() => handleSectionChange(section)}
        >
          <Text style={styles.sectionText}>{section.SectionName}</Text>
        </TouchableOpacity>
      ))}
      </ScrollView>)}
      </View>
{showResetTable && pendingSubjectToAdd && (
  <View style={styles.ResetableinOptionalSub}>
    <Text style={styles.warningTitle}>WARNING:</Text>
    <Text style={styles.warningText}>
      You have chosen to change the optional section. You are required to reset the previously chosen optional sections by tapping on the corresponding checkbox below and then tapping on the RESET button.{"\n\n"}
      Please be aware that by resetting one of the previously chosen optional Sections, all the answers you have provided for questions in that Section will be DELETED. (If you choose to come back to this section later, you have to start answering this Section afresh.){"\n"}
      Are you sure that you want to reset an optional section now?
    </Text>

    <Text style={styles.note}>
      ⚠️ Attempt any 2 of the 4 optional sections. Please tap the Check Box to attempt the section.
    </Text>

    {/* Table header */}
    <View style={styles.tableHeader}>
      <Text style={styles.cellHeader}>Subject Name</Text>
      <Text style={styles.cellHeader}>AMFr</Text>
      <Text style={styles.cellHeader}>Answered</Text>
      <Text style={styles.cellHeader}>NotAnswered</Text>
      <Text style={styles.cellHeader}>MFR</Text>
      <Text style={styles.cellHeader}>Reset</Text>
    </View>

    {/* Table rows */}
    {selectedSubjects
      .filter((subjectName) => isOptionalSubject(subjectName))
      .map((subjectName) => {
        const subject = subjects.find(
          (s) => s.SubjectName === subjectName
        );
        const sections = subject?.sections || [];

        let answeredCount = 0;
        let notAnsweredCount = 0;
        let markedForReviewCount = 0;
        let answeredAndMarkedForReviewCount = 0;

        sections.forEach((section) => {
          section.questions?.forEach((q) => {
            const savedAnswer = userAnswers?.[q.QuestionID || q.question_id];
            const cls = savedAnswer?.buttonClass;

            if (cls === AnswerdBtnCls) {
              answeredCount++;
            } else if (cls === MarkedForReview) {
              markedForReviewCount++;
            } else if (cls === AnsMarkedForReview) {
              answeredAndMarkedForReviewCount++;
            } else {
              notAnsweredCount++;
            }
          });
        });

        return (
          <View key={subjectName} style={styles.tableRow}>
            <Text style={styles.cell}>{subjectName}</Text>
            <Text style={styles.cell}>{answeredAndMarkedForReviewCount}</Text>
            <Text style={styles.cell}>{answeredCount}</Text>
            <Text style={styles.cell}>{notAnsweredCount}</Text>
            <Text style={styles.cell}>{markedForReviewCount}</Text>
            <CheckBox
              value={subjectToUnselect === subjectName}
              onValueChange={() => setSubjectToUnselect(subjectName)}
            />
          </View>
        );
      })}

    {/* Buttons */}
    <View style={styles.resetCancelBtns}>
      <TouchableOpacity
        style={[
          styles.button,
          !subjectToUnselect && styles.buttonDisabled
        ]}
        disabled={!subjectToUnselect}
        onPress={() => {
          setShowResetTable(false);
          setShowUnselectWarning(true);
        }}
      >
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowResetTable(false)}
      >
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  </View>
)}

      {showUnselectWarning && subjectToUnselect && (
        <View style={styles.warningBox}>
          <Text>⚠️ Are you sure you want to deselect {subjectToUnselect}?</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={() => handleUnselectSubject(subjectToUnselect)}>
              <Text style={styles.confirmText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={cancelUnselectSubject}>
              <Text style={styles.cancelText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    
    </View>
  );
};

export default SubjectsAndSectionsContainer;
