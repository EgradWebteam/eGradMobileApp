import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";

const QuestionsTab = ({ testId, studentId, userData, course_id, questionData,loading }) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  // Initialize subject and section
  useEffect(() => {
    if (questionData?.subjects?.length > 0) {
      const firstSubject = questionData.subjects[0];
      setSelectedSubjectId((prev) => prev || firstSubject.subjectId);

      const firstSection = firstSubject.sections?.[0];
      setSelectedSectionId((prev) => prev || firstSection?.sectionId || null);

      if (firstSection?.questions?.[0]) {
        console.log("First question object:", firstSection.questions[0]);
      }
    }
  }, [questionData]);

  // Helpers
  const formatTime = (totalSeconds) => {
    const seconds = parseInt(totalSeconds, 10);
    if (isNaN(seconds) || seconds < 0) return "-";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const pad = (num) => num.toString().padStart(2, "0");
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  const selectedSubject = useMemo(
    () => questionData?.subjects?.find((s) => s.subjectId === selectedSubjectId),
    [questionData, selectedSubjectId]
  );

  const selectedSection = useMemo(
    () => selectedSubject?.sections?.find((sec) => sec.sectionId === selectedSectionId),
    [selectedSubject, selectedSectionId]
  );

  // if (!questionData?.subjects?.length) {
  //   return (
  //     <View style={styles.centered}>
  //       <Text>No question performance data available.</Text>
  //     </View>
  //   );
  // }


  // Render Subject Buttons
  const renderSubjectButtons = () =>
    questionData.subjects.map((subject) => (
      <TouchableOpacity
        key={subject.subjectId}
        style={[
          styles.subjectButton,
          selectedSubjectId === subject.subjectId && styles.activeButton,
        ]}
        onPress={() => {
          setSelectedSubjectId(subject.subjectId);
          const firstSectionId = subject.sections?.[0]?.sectionId || null;
          setSelectedSectionId(firstSectionId);
        }}
      >
        <Text
          style={[
            styles.buttonText,
            selectedSubjectId === subject.subjectId && styles.activeButtonText,
          ]}
        >
          {subject.SubjectName}
        </Text>
      </TouchableOpacity>
    ));

  // Render Section Buttons
  const renderSectionButtons = () =>
    selectedSubject?.sections
      ?.filter((section) => section.sectionId != null && section.SectionName != null)
      .map((section) => (
        <TouchableOpacity
          key={section.sectionId}
          style={[
            styles.sectionButton,
            selectedSectionId === section.sectionId && styles.activeButton,
          ]}
          onPress={() => setSelectedSectionId(section.sectionId)}
        >
          <Text
            style={[
              styles.buttonText,
              selectedSectionId === section.sectionId && styles.activeButtonText,
            ]}
          >
            {section.SectionName}
          </Text>
        </TouchableOpacity>
      ));

  // Render Questions List
  const renderQuestionItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>
        {item.question_sort_id}
        {item.subject_type === "1" ? "-Extra" : ""}
      </Text>
      <Text style={styles.cell}>
        {item.student_answer_status === 1
          ? "Correct"
          : item.student_answer_status === 0
          ? "Wrong"
          : item.student_answer_status === 2
          ? "Partially Correct"
          : "Not Attempted"}
      </Text>
      <Text style={styles.cell}>{formatTime(item.time_spent_on_question)}</Text>
      <Text style={styles.cell}>{formatTime(item.fastest_correct_time)}</Text>
      <Text style={styles.cell}>{item.corrected_by}</Text>
      <Text style={styles.cell}>{item.incorrected_by}</Text>
      <Text style={styles.cell}>{item.unattempted_by}</Text>
    </View>
  );

if (loading) {
  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color="#01c3ff" />
    </View>
  );
}
  
  if (!questionData || !questionData.subjects || questionData.subjects.length === 0) {
  return (
    <View style={styles.centered}>
      <Text>No question performance data available.</Text>
    </View>
  );
}
  return (
    <ScrollView style={styles.container}>
      {/* Subject Buttons */}
      <View style={styles.buttonRow}>{renderSubjectButtons()}</View>

      {/* Section Buttons */}
      {selectedSubject && <View style={styles.buttonRow}>{renderSectionButtons()}</View>}

      {/* Questions List */}
     {/* Questions List */}
{!selectedSection ? (
  <View style={styles.centered}>
    <ActivityIndicator size="small" color="#01c3ff" />
  </View>
) : selectedSection?.questions?.length ? (
  <ScrollView horizontal showsHorizontalScrollIndicator>
<View style={styles.table}>
    {/* Header */}
    <View style={[styles.row, styles.headerRow]}>
      <Text style={[styles.cell, styles.cellSmall, styles.headerText]}>Q. No</Text>
      <Text style={[styles.cell, styles.cellLarge, styles.headerText]}>Response Status</Text>
      <Text style={[styles.cell, styles.cellLarge, styles.headerText]}>Time Spent (HH:MM:SS)</Text>
      <Text style={[styles.cell, styles.cellLarge, styles.headerText]}>Fastest Correct (HH:MM:SS)</Text>
      <Text style={[styles.cell, styles.cellMedium, styles.headerText]}>Correct Responses</Text>
      <Text style={[styles.cell, styles.cellMedium, styles.headerText]}>Incorrect Responses</Text>
      <Text style={[styles.cell, styles.cellMedium, styles.headerText]}>Unattempted Responses</Text>
    </View>

    <FlatList
      data={selectedSection.questions}
      keyExtractor={(item) => String(item.question_id)}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={[styles.cell, styles.cellSmall]}>
            {item.question_sort_id}
            {item.subject_type === "1" ? "-Extra" : ""}
          </Text>

          <Text style={[styles.cell, styles.cellLarge]}>
            {item.student_answer_status === 1
              ? "Correct"
              : item.student_answer_status === 0
              ? "Wrong"
              : item.student_answer_status === 2
              ? "Partially Correct"
              : "Not Attempted"}
          </Text>

          <Text style={[styles.cell, styles.cellLarge]}>
            {formatTime(item.time_spent_on_question)}
          </Text>

          <Text style={[styles.cell, styles.cellLarge]}>
            {formatTime(item.fastest_correct_time)}
          </Text>

          <Text style={[styles.cell, styles.cellMedium]}>{item.corrected_by}</Text>
          <Text style={[styles.cell, styles.cellMedium]}>{item.incorrected_by}</Text>
          <Text style={[styles.cell, styles.cellMedium]}>{item.unattempted_by}</Text>
        </View>
      )}
    />
  </View>
  </ScrollView>
) : (
  <Text>No questions available in this section.</Text>
)}

    </ScrollView>
  );
};

export default QuestionsTab;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 8,
  },
  subjectButton: {
    padding: 10,
    margin: 5,
    backgroundColor: "#eee",
    borderRadius: 6,
  },
  sectionButton: {
    padding: 8,
    margin: 5,
    backgroundColor: "#ddd",
    borderRadius: 6,
  },
  activeButton: { backgroundColor: "#01c3ff" },
  buttonText: { color: "#000" },
  activeButtonText: { color: "#fff", fontWeight: "bold" },
 row: {
  flexDirection: "row",
  alignItems: "center",
  borderBottomWidth: 1,
  borderColor: "#ddd",
  minHeight: 40,
},

cell: {
  paddingVertical: 8,
  paddingHorizontal: 6,
  fontSize: 12,
  textAlign: "center",
  justifyContent: "center",
  alignItems: "center",
},

table: {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 8,
  overflow: "hidden",
  backgroundColor: "#fff",
},

cellSmall: { width: 60 },
cellMedium: { width: 100 },
cellLarge: { width: 130 },


headerText: {
  fontWeight: "bold",
},

  headerRow: { backgroundColor: "#f0f0f0" },
  headerText: { fontWeight: "bold" },
});
