import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions
} from "react-native";

import { styles } from '../../styles/OTSStyles';
import axios from 'axios';
import { backEndUrl, frontEndUrl,backEndPort } from "../../apiConfig";
const { height } = Dimensions.get("window");

const OTSQuestionPaper = ({ testName, realTestId, closeQuestionPaper, questionData, forView, realCourseId }) => {
  const scrollRef = useRef(null);
  const [logoSrc, setLogoSrc] = useState(null);
  const [isLogoLoaded, setIsLogoLoaded] = useState(false);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.post(`${backEndUrl}/navbar/get-logo`, { domain: frontEndUrl});

        if (response.data?.logo) {
          setLogoSrc({ uri: response.data.logo });
        } else {
          setLogoSrc(require("../../images/EGTLogoExamHeaderCompressed.png"));
        }
      } catch (error) {
        console.error("Failed to fetch logo:", error);
        setLogoSrc(require("../../images/EGTLogoExamHeaderCompressed.png"));
      } finally {
        setIsLogoLoaded(true);
      }
    };

    fetchLogo();
  }, []);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          {logoSrc && <Image source={logoSrc} style={styles.logo} resizeMode="contain" />}
          <View style={styles.headerRight}>
            <Text style={styles.testName}>{testName}</Text>
            <TouchableOpacity onPress={closeQuestionPaper} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>

        {!forView && (
          <Text style={styles.alertText}>
            Note that the timer is ticking while you read the Questions. Close this page to return to answering the questions.
          </Text>
        )}

        {/* Questions */}
        {questionData.subjects?.map((subject) => {
          let questionCounter = 1;

          return (
            <View key={subject.subjectId}>
              {subject.sections && subject.sections.length > 0 ? (
                subject.sections.map((section) => (
                  <View key={section.sectionId}>
                    <Text style={styles.sectionHeader}>
                      {subject.SubjectName} : {section.SectionName}
                    </Text>
                    {section.questions.map((question) => {
                      const currentQuestionNumber = questionCounter++;
                      const paragraphId = question?.paragraph?.paragraph_id;
                      const paragraph = (questionData?.paragraphs || []).find(
                        (p) => p.paragraph_id === paragraphId
                      );

                      return (
                        <View key={question.question_id} style={styles.questionContainer}>
                          <Text style={styles.questionNumber}>Question No: {currentQuestionNumber}</Text>

                          {paragraph?.paragraphImgName && (
                            <Image
                              source={{ uri: paragraph.paragraphImgName }}
                              style={styles.image}
                            />
                          )}

                          <Image source={{ uri: question.questionImgName }} style={styles.image} />

                          {question.options.map((option) => (
                            <View key={option.option_id} style={styles.optionRow}>
                              <Text style={styles.optionIndex}>({option.option_index})</Text>
                              <Image
                                source={{ uri: option.optionImgName }}
                                style={styles.optionImage}
                              />
                            </View>
                          ))}
                        </View>
                      );
                    })}
                  </View>
                ))
              ) : (
                <>
                  <Text style={styles.sectionHeader}>{subject.SubjectName}</Text>
                  {subject.questions?.map((question) => {
                    const currentQuestionNumber = questionCounter++;
                    return (
                      <View key={question.question_id} style={styles.questionContainer}>
                        <Text style={styles.questionNumber}>Question No: {currentQuestionNumber}</Text>
                        <Image source={{ uri: question.questionImgName }} style={styles.image} />
                        {question.options.map((option) => (
                          <View key={option.option_id} style={styles.optionRow}>
                            <Text style={styles.optionIndex}>({option.option_index})</Text>
                            <Image
                              source={{ uri: option.optionImgName }}
                              style={styles.optionImage}
                            />
                          </View>
                        ))}
                      </View>
                    );
                  })}
                </>
              )}
            </View>
          );
        })}

        {/* Scroll To Top Button */}
        <TouchableOpacity style={styles.scrollButton} onPress={scrollToTop}>
          <Text style={styles.scrollButtonText}>Scroll to Top</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default OTSQuestionPaper;

