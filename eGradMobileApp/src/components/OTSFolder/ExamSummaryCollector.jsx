import React, { useEffect } from 'react';
import { useQuestionStatus } from '../../hooks/CountsContext';
import { useTimer } from '../../hooks/TimerContext';

const ExamSummaryCollector = ({
  onDataReady,
  realStudentId,
  realTestId,
  summaryData,
}) => {
  const {
    answeredCount,
    answeredAndMarkedForReviewCount,
    markedForReviewCount,
    notAnsweredCount,
    notVisitedCount,
    visitedCount,
    totalQuestionsInTest,
  } = useQuestionStatus();

  const { timeSpent } = useTimer();

  useEffect(() => {
    // Update the ref value instead of state
    summaryData.current = {
      realStudentId,
      realTestId,
      answeredCount,
      answeredAndMarkedForReviewCount,
      markedForReviewCount,
      notAnsweredCount,
      notVisitedCount,
      visitedCount,
      totalQuestionsInTest,
      timeSpent,
    };

    if (onDataReady) {
      summaryData = summaryData.current;
    }
  }, [
    realStudentId,
    realTestId,
    answeredCount,
    answeredAndMarkedForReviewCount,
    markedForReviewCount,
    notAnsweredCount,
    notVisitedCount,
    visitedCount,
    totalQuestionsInTest,
    timeSpent,
    onDataReady,
    summaryData,
  ]);

  return null;
};

export default ExamSummaryCollector;
