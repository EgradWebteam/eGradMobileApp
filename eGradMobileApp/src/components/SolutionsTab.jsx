import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome";
import { WebView } from "react-native-webview";
import { backEndUrl, frontEndUrl } from "../apiConfig";
import { Dimensions } from "react-native";

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
  const studentContact = userData?.mobile_no;
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

  const renderVideo = (url) => {
    if (!url) return null;
    return (
      <WebView
        source={{ uri: url }}
        style={{ width: "100%", height: 300 }}
        javaScriptEnabled
        allowsFullscreenVideo
      />
    );
  };

  const AutoSizedImage = ({ uri, style }) => {
    const [size, setSize] = useState(null);

    useEffect(() => {
      if (uri) {
        Image.getSize(uri, (w, h) => {
          const screenWidth = Dimensions.get("window").width - 40;
          const scaleFactor = w / screenWidth;
          const imageHeight = h / scaleFactor;
          setSize({ width: screenWidth, height: imageHeight });
        });
      }
    }, [uri]);

    if (!size) return null;

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <Image source={{ uri }} style={[style, size]} />
      </ScrollView>
    );
  };

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

        {/* Paragraph (if available) */}
        {/* {item.paragraph?.paragraphImgName && (
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Paragraph:</Text>
            <Image
              source={{ uri: item.paragraph.paragraphImgName }}
              style={styles.paragraphImage}
            />
          </View>
        )} */}

        {/* Question Image */}
        {/* {item.questionImgName && (
    <Image
      source={{ uri: item.questionImgName }}
      style={styles.questionImage}
    />
)} */}

{item.paragraph?.paragraphImgName && (
  <View style={{ marginBottom: 10 }}>
    <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Paragraph:</Text>
    <AutoSizedImage uri={item.paragraph.paragraphImgName} style={styles.paragraphImage} />
  </View>
)}

        {item.questionImgName && (
          <AutoSizedImage uri={item.questionImgName} style={styles.questionImage} />
        )}

        {/* Options based on qTypeId */}
        <View style={{ marginTop: 10 }}>
          {(() => {
            const qTypeId = item.questionType?.quesionTypeId;

            // NAT: Just show text answers
            if (qTypeId === 5 || qTypeId === 6) {
              return (
                <View>
                  <Text>
                    <Text style={{ fontWeight: "bold" }}>Your Answer: </Text>
                    {item.userAnswer?.user_answer || "Not Attempted"}
                  </Text>
                  <Text>
                    <Text style={{ fontWeight: "bold" }}>Correct Answer: </Text>
                    {item.answer}
                  </Text>
                </View>
              );
            }

            // MSQ: Multiple correct
            if (qTypeId === 3 || qTypeId === 4) {
              const correctAnswers = item.answer?.split(",") || [];
              const userAnswers = item.userAnswer?.user_answer?.split(",") || [];

              return item.options?.map((option) => {
                const isCorrect = correctAnswers.includes(option.option_index);
                const isUserSelected = userAnswers.includes(option.option_index);

                let icon = "⭕";
                if (isCorrect && isUserSelected) icon = "✅";
                else if (!isCorrect && isUserSelected) icon = "❌";
                else if (isCorrect) icon = "✅";

                return (
                  <View key={option.option_id} style={styles.optionRow}>
                    <Text>
                      {icon} ({option.option_index})
                    </Text>
                    {option.optionImgName && (
                      <Image
                        source={{ uri: option.optionImgName }}
                        style={styles.optionImage}
                      />
                    )}
                  </View>
                );
              });
            }

            // Default: MCQ
            return item.options?.map((option) => {
              const isCorrect = option.option_index === item.answer;
              const isUserAnswer =
                option.option_index === item.userAnswer?.user_answer;

              let icon = "⭕";
              if (isCorrect && isUserAnswer) icon = "✅";
              else if (isUserAnswer && !isCorrect) icon = "❌";
              else if (isCorrect) icon = "✅";

              return (
                <View key={option.option_id} style={styles.optionRow}>
                  <Text>
                    {icon} ({option.option_index})
                  </Text>
                  {option.optionImgName && (
                    <Image
                      source={{ uri: option.optionImgName }}
                      style={styles.optionImage}
                    />
                  )}
              
                </View>
              );
            });
          })()}
        </View>


        {/* Solution & Video */}
        {item.solution?.solutionImgName && (
          <TouchableOpacity
            style={styles.solutionButton}
            onPress={() => toggleSolutionVisibility(item.question_id)}
          >
            <Text style={styles.btnText}>
              {visibleSolutions[item.question_id]
                ? "Hide Solution"
                : "View Solution"}
            </Text>
          </TouchableOpacity>
        )}

        {/* {visibleSolutions[item.question_id] && (
          <Image
            source={{ uri: item.solution.solutionImgName }}
            style={styles.solutionImage}
          />
        )} */}
{visibleSolutions[item.question_id] && item.solution?.solutionImgName && (
  <AutoSizedImage uri={item.solution.solutionImgName} style={styles.solutionImage} />
)}

        {item.solution?.video_solution_link && (
          <TouchableOpacity
            style={styles.solutionButton}
            onPress={() =>
              setVideoPopup(
                videoPopup === item.question_id ? null : item.question_id
              )
            }
          >
            <Text style={styles.btnText}>View Video Solution</Text>
          </TouchableOpacity>
        )}

        {videoPopup === item.question_id && (
          <Modal
            visible={true}
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
              {renderVideo(item.solution.video_solution_link)}
            </View>
          </Modal>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Subject Picker */}
      <Picker
        selectedValue={
          selectedSubjectSection?.SubjectName || testPaperData.subjects?.[0]
        }
        onValueChange={(itemValue, itemIndex) =>
          handleDropdownChange(itemIndex, 0)
        }
      >
        {testPaperData.subjects?.map((subject, subjIndex) => (
          <Picker.Item
            key={subjIndex}
            label={subject.SubjectName}
            value={subject.SubjectName}
          />
        ))}
      </Picker>

      {/* Questions List */}
      <FlatList
        data={selectedSubjectSection?.questions || []}
        keyExtractor={(item) => item.question_id.toString()}
        renderItem={renderQuestion}
      />
    </View>
  );
};

export default SolutionsTab;

const styles = StyleSheet.create({
  questionContainer: {
    backgroundColor: "#fff",
    padding: 12,
    margin: 8,
    borderRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  // questionImage: {
  //   width: "100%",
  //   height: 150,
  //   resizeMode: "contain",
  //   marginVertical: 10,
  // },
 questionImage: {
  marginVertical: 10,
  resizeMode: "contain",
},
paragraphImage: {
  marginVertical: 6,
  resizeMode: "contain",
},
solutionImage: {
  marginTop: 10,
  resizeMode: "contain",
},
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  optionImage: {
    width: "100%",
    height: 60,
    marginLeft: 8,
    resizeMode: "contain",
  },
  solutionButton: {
    backgroundColor: "#007bff",
    padding: 8,
    borderRadius: 6,
    marginTop: 10,
    alignItems: "center",
  },
  btnText: { color: "#fff" },
  // solutionImage: {
  //   width: "100%",
  //   height: 200,
  //   resizeMode: "contain",
  //   marginTop: 10,
  // },
  modalContent: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  closeBtn: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
});
