import React, { createContext, useContext, useEffect, useState } from "react";

// Instead of CSS classes, define status constants here or import them from a constants file
const ANSWERED = "answered";
const MARKED_FOR_REVIEW = "markedForReview";
const ANSWERED_AND_MARKED_FOR_REVIEW = "answeredAndMarkedForReview";
const NOT_ANSWERED = "notAnswered";

const QuestionStatusContext = createContext();

export const useQuestionStatus = () => useContext(QuestionStatusContext);

const QuestionStatusProvider = ({
  testData,
  userAnswers,
  children,
}) => {
  const [statusCounts, setStatusCounts] = useState({
    answeredCount: 0,
    answeredAndMarkedForReviewCount: 0,
    markedForReviewCount: 0,
    notAnsweredCount: 0,
    notVisitedCount: 0,
    visitedCount: 0,
    totalQuestionsInTest: 0,
  });

  useEffect(() => {
    if (!testData || !Array.isArray(testData.subjects)) return;

    let totalQuestionsInTest = 0;
    let answered = 0;
    let answeredAndMarkedForReview = 0;
    let markedForReview = 0;
    let notAnswered = 0;
    let visited = 0;
    let notVisited = 0;

    testData.subjects.forEach((subject) => {
      subject.sections.forEach((section) => {
        section.questions.forEach((question) => {
          totalQuestionsInTest++;
          const qid = question.question_id;
          const answer = userAnswers[qid];

          if (answer) {
            const status = answer.status; // Assuming userAnswers[qid] contains a 'status' string instead of CSS class

            if (status === ANSWERED) {
              answered++;
              visited++;
            } else if (status === MARKED_FOR_REVIEW) {
              markedForReview++;
              visited++;
            } else if (status === ANSWERED_AND_MARKED_FOR_REVIEW) {
              answeredAndMarkedForReview++;
              visited++;
            } else if (status === NOT_ANSWERED) {
              notAnswered++;
              visited++;
            }
          } else {
            notVisited++;
          }
        });
      });
    });

    setStatusCounts({
      answeredCount: answered,
      answeredAndMarkedForReviewCount: answeredAndMarkedForReview,
      markedForReviewCount: markedForReview,
      notAnsweredCount: notAnswered,
      notVisitedCount: notVisited,
      visitedCount: visited,
      totalQuestionsInTest,
    });
  }, [testData, userAnswers]);

  return (
    <QuestionStatusContext.Provider value={statusCounts}>
      {children}
    </QuestionStatusContext.Provider>
  );
};

export default QuestionStatusProvider;
