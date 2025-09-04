import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // for IoIosAlert
import DocIcon from "react-native-vector-icons/MaterialCommunityIcons"; // for document icon
import { styles } from '../../styles/OTSStyles';
import OTSQuestionPaper from "./OTSQuestionPaper"; // Implement these as RN components
import OTSInstructions from "./OTSInstructions";

const OTSNavbar = ({ testName, testData, realTestId, realCourseId }) => {
  const [showQuestions, setShowQuestions] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [questionData, setQuestionData] = useState([]);

  const openQuestionPaper = () => {
    setQuestionData(testData);
    setShowQuestions(true);
    setShowInstructions(false);
  };

  const openInstructions = () => {
    setShowInstructions(true);
    setShowQuestions(false);
  };

  const closeAllModals = () => {
    setShowQuestions(false);
    setShowInstructions(false);
  };

  return (
    <View style={styles.navbarcontainer}>
      <View style={styles.testNameHolder}>
        <Text style={styles.testName}>{testName}</Text>
      </View>

      <View style={styles.buttonHolder}>
        <TouchableOpacity style={styles.button} onPress={openQuestionPaper}>
          <Icon name="alert-circle" size={22} color="#f39c12" />
          <Text style={styles.buttonText}>View Questions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={openInstructions}>
          <DocIcon name="file-document-outline" size={22} color="#2980b9" />
          <Text style={styles.buttonText}>View Instructions</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Questions */}
      <Modal visible={showQuestions} animationType="slide">
        <OTSQuestionPaper
          testName={testName}
          testData={testData}
          questionData={questionData}
          realTestId={realTestId}
          realCourseId={realCourseId}
          closeQuestionPaper={closeAllModals}
        />
      </Modal>

      {/* Modal for Instructions */}
      <Modal visible={showInstructions} animationType="slide">
        <OTSInstructions closeInstructions={closeAllModals} />
      </Modal>
    </View>
  );
};

export default OTSNavbar;


