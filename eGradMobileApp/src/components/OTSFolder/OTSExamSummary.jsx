import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  BackHandler,
} from "react-native";
import { useQuestionStatus } from "../../hooks/CountsContext";
// import { useAlert } from "../../hooks/AlertContext.jsx";
import { styles } from '../../styles/OTSStyles';
import axios from 'axios';
import { backEndUrl, frontEndUrl,backEndPort } from "../../apiConfig";
// import { useSession } from "../../StudentDashboard/hooks/SessionContext";

const OTSExamSummary = ({
  onCancelSubmit,
  realTestId,
  realCourseId,
  realStudentId,
  isSubmitClicked,
  isAutoSubmitted,
  setShowExamSummary,
  navigation, // React Navigation prop
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

//   const { validateSessionWithoutNavigation } = useSession();
  // const { alert } = useAlert();

  const [showSubmittedPopup, setShowSubmittedPopup] = useState(false);

  const isSubmittingRef = useRef(false);

  // Handle Android hardware back button to show exam summary if needed
  useEffect(() => {
    const backAction = () => {
      // Simulate sessionStorage.getItem("examSummaryEntered") === "true"
      // You can replace with async storage or a context state in your app
      if (showSubmittedPopup) {
        setShowExamSummary(true);
        return true; // prevent default behavior
      }
      return false;
    };

    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, [showSubmittedPopup]);

  const handleConfirmSubmit = async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    try {
      if (!realTestId || !realStudentId || !realCourseId) {
        console.warn("Missing test/student ID, skipping submission process.");
        setShowSubmittedPopup(true);
        isSubmittingRef.current = false;
        return;
      }

    //   const isValid = await validateSessionWithoutNavigation();
    //   if (!isValid) {
        // You may want to navigate to login or exit app
        // Alert.alert("Session invalid", "Please login again.");
        // isSubmittingRef.current = false;
        // return;
    //   }

      setShowSubmittedPopup(true);

      const postData = {
        courseCreationId: realCourseId,
        test_status: "completed",
        connection_status: "disconnected",
      };

      const updateResponse = await fetch(
        `${backEndUrl}/studentmycourses/updateTestStatusDetails/${realStudentId}/${realTestId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
        }
      );

      if (!updateResponse.ok) {
        const errorMessage = await updateResponse.text();
        console.error("Error details:", errorMessage);
        throw new Error("Status update failed: " + errorMessage);
      }

      const updateResult = await updateResponse.json();

      if (updateResult.message?.includes("No matching")) {
        Alert.alert(
          "Alert",
          "Your test attempt status could not be updated in the database."
        );
        isSubmittingRef.current = false;
        return;
      }

      // Fetch summary + marks in parallel
      const token = ""; // Fetch token from secure storage/context

      const [summaryRes, marksRes] = await Promise.allSettled([
        fetch(
          `${backEndUrl}/OTSExamSummary/FetchExamSummaryCounts/${realTestId}/${realStudentId}/${realCourseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        fetch(
          `${backEndUrl}/OTSExamSummary/FetchStudentMarks/${realTestId}/${realStudentId}/${realCourseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ]);

      const examSummary =
        summaryRes.status === "fulfilled" ? await summaryRes.value.json() : null;
      const studentMarks =
        marksRes.status === "fulfilled" ? await marksRes.value.json() : null;

      if (!examSummary) {
        Alert.alert("Error", "Failed to fetch exam summary.");
        isSubmittingRef.current = false;
        return;
      }

      if (!studentMarks) {
        Alert.alert("Error", "Failed to fetch student marks.");
        isSubmittingRef.current = false;
        return;
      }

      // Handle further processing or navigation here...

    } catch (error) {
      console.error("Unexpected error during submission process:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const handleViewReport = () => {
    // Clear stored flags or data here
    // Navigation to reports or dashboard - adjust to your app's navigation structure

    // Example:
    setShowExamSummary(false);
    if (navigation) {
      navigation.navigate("StudentDashboard", { userId: realStudentId });
    }
  };

  // Render table-like summary using flexbox
  const SummaryRow = ({ label, value }) => (
    <View style={styles.row}>
      <Text style={styles.cellLabel}>{label}</Text>
      <Text style={styles.cellValue}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {!showSubmittedPopup ? (
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.title}>Exam Summary</Text>
          <View style={styles.summaryContainer}>
            <SummaryRow label="Total Questions" value={totalQuestionsInTest} />
            <SummaryRow label="Answered" value={answeredCount} />
            <SummaryRow
              label="Answered & Marked for Review"
              value={answeredAndMarkedForReviewCount}
            />
            <SummaryRow label="Marked for Review" value={markedForReviewCount} />
            <SummaryRow label="Not Answered" value={notAnsweredCount} />
            <SummaryRow label="Visited" value={visitedCount} />
            <SummaryRow label="Not Visited" value={notVisitedCount} />
          </View>

          {isAutoSubmitted ? (
            <View style={styles.messageContainer}>
              <Text style={styles.heading}>Your Time is up!</Text>
              <Text style={styles.subHeading}>
                Your test is automatically submitted successfully.
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={handleConfirmSubmit}
                disabled={isSubmittingRef.current}
              >
                <Text style={styles.buttonText}>Okay</Text>
              </TouchableOpacity>
            </View>
          ) : (
            isSubmitClicked && (
              <View style={styles.messageContainer}>
                <Text style={styles.confirmationText}>
                  Are you sure you want to submit? No changes will be allowed after
                  submission.
                </Text>
                <View style={styles.buttonGroup}>
                  <TouchableOpacity
                    style={[styles.button, styles.yesButton]}
                    onPress={handleConfirmSubmit}
                    disabled={isSubmittingRef.current}
                  >
                    <Text style={styles.buttonText}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.noButton]}
                    onPress={onCancelSubmit}
                    disabled={isSubmittingRef.current}
                  >
                    <Text style={styles.buttonText}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          )}
        </ScrollView>
      ) : (
        <View style={styles.submissionPopup}>
          <Text style={styles.submissionTitle}>Your Test has been Submitted!</Text>
          <Text style={styles.submissionText}>You can now view your report.</Text>
          <TouchableOpacity style={styles.button} onPress={handleViewReport}>
            <Text style={styles.buttonText}>View Report</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default OTSExamSummary;

