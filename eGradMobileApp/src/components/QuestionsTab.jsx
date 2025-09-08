import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";

const QuestionsTab = ({ testId, studentId, userData, course_id, questionData }) => {
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

  if (!questionData?.subjects?.length) {
    return (
      <View style={styles.centered}>
        <Text>No question performance data available.</Text>
      </View>
    );
  }

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

  return (
    <ScrollView style={styles.container}>
      {/* Subject Buttons */}
      <View style={styles.buttonRow}>{renderSubjectButtons()}</View>

      {/* Section Buttons */}
      {selectedSubject && <View style={styles.buttonRow}>{renderSectionButtons()}</View>}

      {/* Questions List */}
      {selectedSection?.questions?.length ? (
        <View>
          {/* Table Header */}
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.headerText]}>Q. No</Text>
            <Text style={[styles.cell, styles.headerText]}>Status</Text>
            <Text style={[styles.cell, styles.headerText]}>User Time</Text>
            <Text style={[styles.cell, styles.headerText]}>Fastest</Text>
            <Text style={[styles.cell, styles.headerText]}>Corrected By</Text>
            <Text style={[styles.cell, styles.headerText]}>Incorrected By</Text>
            <Text style={[styles.cell, styles.headerText]}>Unattempted By</Text>
          </View>

          <FlatList
            data={selectedSection.questions}
            renderItem={renderQuestionItem}
            keyExtractor={(item) => String(item.question_id)}
          />
        </View>
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
  activeButton: { backgroundColor: "#007bff" },
  buttonText: { color: "#000" },
  activeButtonText: { color: "#fff", fontWeight: "bold" },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
  },
  cell: { flex: 1, fontSize: 12, textAlign: "center" },
  headerRow: { backgroundColor: "#f0f0f0" },
  headerText: { fontWeight: "bold" },
});
