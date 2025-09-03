import axios from "axios";
import { BASE_URL } from "../../ConfigFile/ApiConfigURL.js";

export const saveCurrentQuestionProgress = async ({
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
  autoSaveNATIfNeeded,
}) => {
  const currentSubject = testData?.subjects?.find(
    (sub) => sub.SubjectName === activeSubject
  );
  const currentSection = currentSubject?.sections?.find(
    (sec) => sec.SectionName === activeSection
  );
  const currentQuestion = currentSection?.questions?.[activeQuestionIndex];

  const qTypeId = currentQuestion?.questionType?.quesionTypeId;
  const qid = currentQuestion?.question_id;
  const subjectId = currentSubject?.subjectId;
  const sectionId = currentSection?.sectionId;

  if (currentQuestion && subjectId && qid && ![5, 6].includes(qTypeId)) {
    const existingAnswer = userAnswers?.[qid];
    const timeSpent =
      getElapsedTimeForCurrentQuestion() +
      (existingAnswer?.TimeSpentOnQuestion ?? 0);
    const buttonClass = existingAnswer?.buttonClass;
    const answeredStatus = getAnsweredStatusFromButtonClass(buttonClass);

    // Update local state
    setUserAnswers((prev) => ({
      ...prev,
      [qid]: {
        ...(prev[qid] || {}),
        subjectId,
        sectionId,
        questionId: qid,
        TimeSpentOnQuestion: timeSpent,
        type: prev[qid]?.type || "",
        buttonClass: prev[qid]?.buttonClass,
      },
    }));

    // Save time to backend using axios
    try {
      await axios.patch(`${BASE_URL}/OTSTestPaper/SaveTimeOnly`, {
        realStudentId,
        realTestId,
        realCourseId,
        question_id: qid,
        time_spent_on_question: timeSpent,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("Error saving time on subject change:", err);
    }
  } else if ([5, 6].includes(qTypeId)) {
    autoSaveNATIfNeeded();
  }
};
