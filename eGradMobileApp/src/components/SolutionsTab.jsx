import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome";
import { WebView } from "react-native-webview";
import { backEndUrl } from "../apiConfig";
import AutoSizedImage from "./AutoSizedImage";
import { styles } from "../styles/StudentDashboardStyles";
import ResponsiveImage from './OTSFolder/ResponsiveImage';  
import renderVideo from "./renderVideo";
const SolutionsTab = ({
  testId,
  userData,
  course_id,
  studentId,
  testPaperData,
  bookmarkedQuestions,
  setBookmarkedQuestions,
  selectedSubjectSection,
  setSelectedSubjectSection,
}) => {
  const [visibleSolutions, setVisibleSolutions] = useState({});
  const [videoPopup, setVideoPopup] = useState(null);

  const handleDropdownChange = (subjectIdx, sectionIdx) => {
    const subject = testPaperData.subjects[subjectIdx];
    const section =
      sectionIdx !== null && subject?.sections
        ? subject.sections[sectionIdx]
        : {
          SectionName: null,
          questions: subject?.sections?.[0]?.questions || [],
        };

    setSelectedSubjectSection({
      SubjectName: subject.SubjectName,
      SectionName: section?.SectionName,
      questions: section?.questions || [],
    });
  };

  const toggleSolutionVisibility = (questionId) => {
    setVisibleSolutions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const toggleBookmark = async (questionId) => {
    try {
      const response = await fetch(
        `${backEndUrl}/MyResults/bookmark/${questionId}/${testId}/${studentId}/${course_id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        if (bookmarkedQuestions.includes(questionId)) {
          setBookmarkedQuestions(
            bookmarkedQuestions.filter((id) => id !== questionId)
          );
        } else {
          setBookmarkedQuestions([...bookmarkedQuestions, questionId]);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const SCREEN_WIDTH = Dimensions.get("window").width;

  const renderQuestion = ({ item, index }) => {
    return (
      <View style={styles.questionContainer}>
         <View style={styles.headerRow}>
              <Text>Question No: {index + 1}</Text>
              <TouchableOpacity onPress={() => toggleBookmark(item.question_id)}>
                <Icon
                  name={
                    bookmarkedQuestions.includes(item.question_id)
                      ? "bookmark"
                      : "bookmark-o"
                  }
                  size={22}
                  color="blue"
                />
              </TouchableOpacity>
            </View>
        {/* Scrollable content */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          nestedScrollEnabled={true}
        >
          {/* Each page must be full screen width */}
          <View style={{ width: SCREEN_WIDTH, padding: 10 }}>
            {/* Header Row */}
           

            {/* Paragraph */}
            {item.paragraph?.paragraphImgName && (
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
                  Paragraph:
                </Text>
                 <ResponsiveImage
                  uri={item.paragraph.paragraphImgName}
              
                />
              </View>
            )}

            {/* Question */}
            {item.questionImgName && (
             <ResponsiveImage
                 uri={item.questionImgName}
              />
            )}

            {/* Options */}
            <View style={{ marginTop: 10 }}>
              {item.options?.map((option) => {
                const isCorrect = item.answer?.split(",").includes(option.option_index);
                const isUserAnswer = item.userAnswer?.user_answer
                  ?.split(",")
                  .includes(option.option_index);

                let icon = "⭕";
                if (isCorrect && isUserAnswer) icon = "✅";
                else if (!isCorrect && isUserAnswer) icon = "❌";
                else if (isCorrect) icon = "✅";

                return (
                  <View key={option.option_id} style={styles.optionRow}>
                    <Text>
                      {icon} ({option.option_index})
                    </Text>
                    {option.optionImgName && (
                      <ResponsiveImage
                        uri={option.optionImgName}
                    
                      />
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
    <View style={styles.solutionButtons}>
        {/* Solution Section (outside scroll so it sticks below) */}
        {item.solution?.solutionImgName && (
          <TouchableOpacity
            style={styles.solutionBtn}
            onPress={() => toggleSolutionVisibility(item.question_id)}
          >
            <Text style={styles.btnText}>
              {visibleSolutions[item.question_id]
                ? "Hide Solution"
                : "Solution"}
            </Text>
          </TouchableOpacity>
        )}
       {item.solution?.video_solution_link && (
          <TouchableOpacity
              style={styles.solutionBtn}
            onPress={() => {
              setVideoPopup(videoPopup === item.question_id ? null : item.question_id);
         setVisibleSolutions((prev) => ({
    ...prev,
    [item.question_id]: false,
  }));
            }
          }
          >
            <Text style={styles.btnText}>Video Solution</Text>
          </TouchableOpacity>
        )}</View>
        {visibleSolutions[item.question_id] && item.solution?.solutionImgName && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            nestedScrollEnabled={true}
            style={{ marginTop: 10 }}
          >
            <ResponsiveImage
              uri={item.solution.solutionImgName}
         
            />
          </ScrollView>
        )}

    
 
      </View>
    );
  };


  return (
    <View style={{ flex: 1 }}>
    <View style={styles.pickerContainer}>
      <Picker
   
        selectedValue={
          selectedSubjectSection
            ? (() => {
              const subjectIdx = testPaperData.subjects?.findIndex(
                (s) => s.SubjectName === selectedSubjectSection.SubjectName
              );
              const sectionIdx =
                testPaperData.subjects?.[subjectIdx]?.sections?.findIndex(
                  (sec) => sec?.SectionName === selectedSubjectSection.SectionName
                ) ?? "null";

              return `${subjectIdx}-${sectionIdx !== -1 ? sectionIdx : "null"}`;
            })()
            : ""
        }
        onValueChange={(itemValue) => {
          const [subjectIdx, sectionIdx] = itemValue.split("-");
          handleDropdownChange(
            parseInt(subjectIdx, 10),
            sectionIdx === "null" ? null : parseInt(sectionIdx, 10)
          );
        }}
      >
        {testPaperData.subjects?.map((subject, subjIndex) =>
          subject.sections && subject.sections.length > 0 ? (
            subject.sections.map((section, secIndex) => (
              <Picker.Item
                key={`${subjIndex}-${secIndex}`}
                label={`${subject.SubjectName}${section.SectionName ? ` - ${section.SectionName}` : ""
                  }`}
                value={`${subjIndex}-${secIndex}`}
              />
            ))
          ) : (
            <Picker.Item
              key={`${subjIndex}-null`}
              label={subject.SubjectName}
              value={`${subjIndex}-null`}
            />
          )
        )}
      </Picker>

</View>
      {/* Questions */}
     <FlatList
  data={selectedSubjectSection?.questions || []}
  keyExtractor={(item) => item.question_id.toString()}
  renderItem={renderQuestion}
/>

{videoPopup && (
  <Modal
    visible
    transparent={false}
    onRequestClose={() => setVideoPopup(null)}
  >
    <View style={styles.modalContent}>
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => setVideoPopup(null)}
      >
        <Text style={{ fontSize: 18 }}>✖ Close</Text>
      </TouchableOpacity>
      <View style={{ backgroundColor: "#fff"}}>
        {renderVideo(
          selectedSubjectSection.questions.find(
            (q) => q.question_id === videoPopup
          )?.solution?.video_solution_link
        )}
      </View>
    </View>
  </Modal>
)}


    </View>
  );
};

export default SolutionsTab;

