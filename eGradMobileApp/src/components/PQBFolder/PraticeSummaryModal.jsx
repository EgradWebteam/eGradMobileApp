import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const PracticeSummaryModal = ({ summary, onAttemptNow, onClose }) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.modalContainer}>
        <Text style={styles.header}>Exam Summary</Text>

        <View style={styles.summaryStatsContainer}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>⏱ Time Spent: {summary.timeSpent}</Text>
          </View>

          <View style={styles.statsList}>
            <View style={styles.row}>
              <Text>Total Correct Answers </Text>
              <Text>: </Text>
              <Text style={styles.count}>{summary.correct}</Text>
            </View>

            <View style={styles.row}>
              <Text>Total Incorrect Answers </Text>
              <Text>: </Text>
              <Text style={styles.count}>{summary.incorrect}</Text>
            </View>

            <View style={styles.row}>
              <Text>Total Partial Answers </Text>
              <Text>: </Text>
              <Text style={styles.count}>{summary.partial}</Text>
            </View>

            <View style={styles.row}>
              <Text>Total Unattempted Questions </Text>
              <Text>: </Text>
              <Text style={styles.count}>{summary.unattempted}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          {summary.unattempted > 0 ? (
            <>
              <Text style={styles.warningText}>
                You still have <Text style={styles.bold}>{summary.unattempted}</Text>{" "}
                {summary.unattempted === 1 ? "question" : "questions"} unattempted.{"\n"}
                Do you want to attempt them now, or just{" "}
                <Text style={styles.bold}>submit without attempting</Text>?
              </Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.attemptBtn} onPress={onAttemptNow}>
                  <Text style={styles.buttonText}>Attempt Now</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.submitBtn} onPress={onClose}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.centerButton}>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    elevation: 5,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  summaryStatsContainer: {
    marginBottom: 20,
  },
  timeContainer: {
    marginBottom: 10,
  },
  timeText: {
    fontSize: 16,
    fontWeight: "600",
  },
  statsList: {
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
  },
  count: {
    fontWeight: "bold",
    marginLeft: 4,
  },
  actions: {
    marginTop: 10,
  },
  warningText: {
    textAlign: "center",
    marginBottom: 15,
    fontSize: 14,
  },
  bold: {
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  attemptBtn: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  submitBtn: {
    backgroundColor: "#f44336",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeBtn: {
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  centerButton: {
    alignItems: "center",
  },
});

export default PracticeSummaryModal;