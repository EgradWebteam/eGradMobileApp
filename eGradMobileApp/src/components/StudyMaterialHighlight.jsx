// StudyMaterialHighlightRN.js
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import Pdf from "react-native-pdf";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const StudyMaterialHighlight = ({ fileUrl, onClose }) => {
  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>

      {/* PDF Viewer */}
      <Pdf
        source={{ uri: fileUrl }}
        style={styles.pdf}
        enablePaging
        trustAllCerts={false}
      />
    </View>
  );
};

export default StudyMaterialHighlight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  pdf: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: "#00000080",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});
