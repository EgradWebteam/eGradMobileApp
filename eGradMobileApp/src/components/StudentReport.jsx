import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { PieChart } from "react-native-gifted-charts"; // RN-friendly charts

const StudentReport = ({
  testId,
  studentId,
  data,
  subjectMarks,
  course_portal_id,
  course_id,
}) => {
  const [loading, setLoading] = useState(false);
console.log("dataa",data);
console.log("subjectMarkssssss",subjectMarks);
  // Parse HH:MM:SS → seconds
  const parseTimeToSeconds = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string") return 0;
    const [h = 0, m = 0, s = 0] = timeStr.split(":").map(Number);
    return h * 3600 + m * 60 + s;
  };

  // Format seconds → HH:MM:SS
  const formatToHHMMSS = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
  };

  if (!data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  const {
    duration,
    TimeLeft,
    rank_position,
    totalAttemptedStudents,
    test_total_marks,
    totalQuestions,
    test_total_Questions,
    totalCorrect,
    totalWrong,
    sumStatus1,
    sumStatus0,
  } = data;

  const timeLeftSec = parseTimeToSeconds(TimeLeft);
  const totalDurationSec = duration * 60;
  const timeSpentSec = totalDurationSec - timeLeftSec;

  const notAttempted =
    (totalQuestions ?? test_total_Questions ?? 0) -
    (totalCorrect ?? 0) -
    (totalWrong ?? 0);

  const correctMarks = parseInt(sumStatus1) || 0;
  const wrongMarks = parseInt(sumStatus0) || 0;
  const totalDifference = correctMarks - Math.abs(wrongMarks);
  let percentage = test_total_marks
    ? (totalDifference / test_total_marks) * 100
    : 0;
  percentage = Math.max(0, Number(percentage.toFixed(2)));

  const pieData1 = [
    { value: totalCorrect ?? 0, color: "#308752", text: "Correct" },
    { value: totalWrong ?? 0, color: "#dc3545", text: "Wrong" },
    { value: notAttempted, color: "rgba(119,135,138,0.7)", text: "Not Attempted" },
  ];

  const pieData2 = [
    { value: percentage, color: "#3e98c7", text: "Score" },
    { value: 100 - percentage, color: "#ffe9e9", text: "Remaining" },
  ];
console.log("pieData1", pieData1);
console.log("pieData2", pieData2);

  return (
    <ScrollView style={styles.container}>
      {/* AIR */}
      {course_portal_id === 1 && (
        <Text style={styles.rank}>
          AIR: {rank_position ?? 0}/{totalAttemptedStudents ?? 0}
        </Text>
      )}

      {/* Time progress */}
      <View style={styles.timeRow}>
        <View style={styles.timeBox}>
          <Text style={styles.timeValue}>{formatToHHMMSS(timeSpentSec)}</Text>
          <Text style={styles.timeLabel}>Time Spent</Text>
        </View>
        <View style={styles.timeBox}>
          <Text style={styles.timeValue}>{formatToHHMMSS(timeLeftSec)}</Text>
          <Text style={styles.timeLabel}>Time Left</Text>
        </View>
      </View>

      {/* Subject Wise Report */}
      <Text style={styles.sectionHeading}>Subject Wise Report</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.th}>Subject</Text>
          <Text style={styles.th}>Total Qs</Text>
          <Text style={styles.th}>Correct</Text>
          <Text style={styles.th}>Wrong</Text>
          <Text style={styles.th}>+ve</Text>
          <Text style={styles.th}>-ve</Text>
          <Text style={styles.th}>Marks</Text>
        </View>
        {(subjectMarks || []).map((s) => (
          <View key={s.subject_id} style={styles.tr}>
            <Text style={styles.td}>{s.subject_name}</Text>
            <Text style={styles.td}>{s.total_questions}</Text>
            <Text style={styles.td}>{s.total_correct}</Text>
            <Text style={styles.td}>{s.total_incorrect}</Text>
            <Text style={styles.td}>{s.positive_marks}</Text>
            <Text style={styles.td}>{s.negative_marks}</Text>
            <Text style={styles.td}>{s.total_marks}</Text>
          </View>
        ))}
      </View>

      {/* Charts */}
     <View style={{ alignItems: "center", marginVertical: 20 }}>
  <PieChart
    data={[
      { value: Number(totalCorrect) || 0, color: "#308752", text: "Correct" },
      { value: Number(totalWrong) || 0, color: "#dc3545", text: "Wrong" },
      { value: Number(notAttempted) || 0, color: "rgba(119,135,138,0.7)", text: "Not Attempted" },
    ]}
    donut
    showText
    radius={80}
    innerRadius={50}
    textSize={12}
    textColor="#000"
    textBackgroundColor="#fff"
  />
</View>

<View style={{ alignItems: "center", marginVertical: 20 }}>
  <PieChart
    data={[
      { value: Number(percentage) || 0, color: "#3e98c7", text: "Score" },
      { value: 100 - (Number(percentage) || 0), color: "#ffe9e9", text: "Remaining" },
    ]}
    donut
    showText
    radius={90}
    innerRadius={60}
    textSize={16}
    textColor="#000"
    centerLabelComponent={() => (
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        {Number(percentage).toFixed(2)}%
      </Text>
    )}
  />
</View>

    </ScrollView>
  );
};

export default StudentReport;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  rank: { fontSize: 16, fontWeight: "bold", marginVertical: 8 },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 12,
  },
  timeBox: { alignItems: "center" },
  timeValue: { fontSize: 18, fontWeight: "bold" },
  timeLabel: { fontSize: 14, color: "gray" },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  table: { borderWidth: 1, borderColor: "#ddd" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    padding: 6,
  },
  th: { flex: 1, fontWeight: "bold", fontSize: 12 },
  tr: { flexDirection: "row", padding: 6, borderBottomWidth: 1, borderColor: "#eee" },
  td: { flex: 1, fontSize: 12 },
});
