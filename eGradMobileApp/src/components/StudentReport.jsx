import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { PieChart } from "react-native-gifted-charts"; 

const StudentReport = ({
  testId,
  studentId,
  data,
  subjectMarks,
  course_portal_id,
  course_id,
}) => {
  const [loading, setLoading] = useState(false);
   const [selectedSlice, setSelectedSlice] = useState(null);
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
        <ActivityIndicator size="large" color="#01c3ff" />
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
    test_total_questions,
    totalCorrect,
    totalWrong,
    sumStatus1,
    sumStatus0,
  } = data;

  const timeLeftSec = parseTimeToSeconds(TimeLeft);
  const totalDurationSec = duration * 60;
  const timeSpentSec = totalDurationSec - timeLeftSec;

  const notAttempted =
    (totalQuestions ?? test_total_questions ?? 0) -
    (totalCorrect ?? 0) -
    (totalWrong ?? 0);

  const correctMarks = parseInt(sumStatus1) || 0;
  const wrongMarks = parseInt(sumStatus0) || 0;
  const totalDifference = correctMarks - Math.abs(wrongMarks);
  let percentage = test_total_marks
    ? (totalDifference / test_total_marks) * 100
    : 0;
  percentage = Math.max(0, Number(percentage.toFixed(2)));

// Add this flag:
const isAllZero =
  (totalCorrect ?? 0) + (totalWrong ?? 0) + (notAttempted ?? 0) === 0;

const pieData1 = [
  {
    value: totalCorrect ?? 0,
    color: "#308752",
    label: "Correct",
    onPress: () => setSelectedSlice({ label: "Correct", value: totalCorrect }),
  },
  {
    value: totalWrong ?? 0,
    color: "#dc3545",
    label: "Wrong",
    onPress: () => setSelectedSlice({ label: "Wrong", value: totalWrong }),
  },
  {
    value: notAttempted,
    color: "rgba(119,135,138,0.7)",
    label: "Not Attempted",
    onPress: () =>
      setSelectedSlice({ label: "Not Attempted", value: notAttempted }),
  },
];


  const pieData2 = [
    { value: percentage, color: "#3e98c7", text: "Score" },
    { value: 100 - percentage, color: "#ffe9e9", text: "Remaining" },
  ];
console.log("pieData1", pieData1);
console.log("pieData2", pieData2);

  return (
  <ScrollView
   style={styles.container}
>
  {/* AIR / Rank */}
  {course_portal_id === 1 && (
    <Text style={styles.rank}>
      AIR: {rank_position ?? 0}/{totalAttemptedStudents ?? 0}
    </Text>
  )}

  {/* Time Progress */}
  <View style={styles.timeRow}>
    <View style={styles.timeBox}>
      <Text style={styles.timeValue}>{formatToHHMMSS(timeSpentSec)}</Text>
      <Text style={styles.timeLabel}>Time Left</Text>
    </View>
    <View style={styles.timeBox}>
      <Text style={styles.timeValue}>{formatToHHMMSS(timeLeftSec)}</Text>
      <Text style={styles.timeLabel}>Time Spent</Text>
    </View>
  </View>

  {/* Subject Wise Table */}
<Text style={styles.sectionHeading}>Subject Wise Report</Text>

<ScrollView horizontal showsHorizontalScrollIndicator={true}>
  <View style={styles.table}>
    {/* Table Header */}
   <View style={styles.tableHeader}>
  <Text style={styles.thSubject}>Subject</Text>
  <Text style={styles.thNumber}>Total Qs</Text>
  <Text style={styles.thNumber}>Correct</Text>
  <Text style={styles.thNumber}>Wrong</Text>
  <Text style={styles.thNumber}>+ve</Text>
  <Text style={styles.thNumber}>-ve</Text>
  <Text style={styles.thNumber}>Marks</Text>
</View>

{(subjectMarks || []).map((s, index) => (
  <View
    key={s.subject_id}
    style={[
      styles.tr,
      index % 2 === 0 ? styles.rowEven : styles.rowOdd,
    ]}
  >
    <Text style={styles.tdSubject}>{s.subject_name}</Text>
    <Text style={styles.tdNumber}>{s.total_questions}</Text>
    <Text style={styles.tdNumber}>{s.total_correct}</Text>
    <Text style={styles.tdNumber}>{s.total_incorrect}</Text>
    <Text style={styles.tdNumber}>{s.positive_marks}</Text>
    <Text style={styles.tdNumber}>{s.negative_marks}</Text>
    <Text style={styles.tdNumber}>{s.total_marks}</Text>
  </View>
))}

  </View>
</ScrollView>


{/* Correct/Wrong/Not Attempted Pie */}
<View style={styles.chartContainer}>
  {isAllZero ? (
    <>
      <PieChart
        data={[{ value: 1, color: "#d3d3d3" }]} // full grey circle
        radius={80}
        showText={false}
      />
      <Text style={styles.noDataText}>No Answer Data</Text>
    </>
  ) : (
    <>
      <PieChart data={pieData1} radius={80} showText={false} />
      {/* Legend below */}
      <View style={styles.legendContainer}>
        {pieData1.map((slice, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: slice.color }]} />
            <Text style={styles.legendLabel}>
              {slice.label}: {slice.value}
            </Text>
          </View>
        ))}
      </View>
    </>
  )}
</View>




  <View style={styles.chartContainer}>
    <PieChart
      data={pieData2}
      donut
       showText={false} 
      radius={90}
      innerRadius={60}
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
  container: {
  backgroundColor: "#fff",
},
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rank: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#000",
    marginVertical: 10,
    textAlign: "center",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  timeBox: {
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  timeValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  timeLabel: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 12,
    color: "#333",
  },
 table: {
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 8,
  overflow: "hidden",
  marginBottom: 20,
  minWidth: "100%", // force horizontal scroll if screen is smaller
},

tableHeader: {
  flexDirection: "row",
  backgroundColor: "#198754",
  paddingVertical: 10,
  paddingHorizontal: 6,
},

th: {
  flex: 1,
  fontWeight: "bold",
  fontSize: 14,
  textAlign: "center",
  color: "#fff", // white text for header
},

tr: {
  flexDirection: "row",
  paddingVertical: 10,
  paddingHorizontal: 6,
  borderBottomWidth: 1,
  borderColor: "#eee",
},

td: {
  flex: 1,
  fontSize: 13,
  textAlign: "center",
  color: "#333",
},

rowEven: {
  backgroundColor: "#f9f9f9", // light gray
},

rowOdd: {
  backgroundColor: "#fff",
},
thSubject: {
  minWidth: 200, // wide enough for long subject names
  fontWeight: "bold",
  fontSize: 14,
  textAlign: "left",
  color: "#fff",
  paddingLeft: 8,
},

thNumber: {
  minWidth: 80, // fixed width for numbers
  fontWeight: "bold",
  fontSize: 14,
  textAlign: "right",
  color: "#fff",
  paddingRight: 8,
},

tdSubject: {
  minWidth: 170,
  fontSize: 13,
  color: "#333",
  textAlign: "left",
  paddingLeft: 8,
},

tdNumber: {
  minWidth: 80,
  fontSize: 13,
  color: "#333",
  textAlign: "right",
  paddingRight: 8,
},


  chartContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  legendContainer: {
  flexDirection: "row", 
  justifyContent: "center",
  flexWrap: "wrap", // allows wrapping to next line if too long
  marginTop: 12,
},

legendItem: {
  flexDirection: "row",
  alignItems: "center",
  marginHorizontal: 10, // spacing between items
  marginBottom: 6,
},

legendDot: {
  width: 14,
  height: 14,
  borderRadius: 3, // square box with rounded corners
  marginRight: 6,
},

legendLabel: {
  fontSize: 14,
  color: "#333",
  fontWeight: "500",
},

});
