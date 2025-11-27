import React, { useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import Pdf from "react-native-pdf";
import DefaultTermsContent from "./DefaultTermsContent.js";

const TermsAndConditions = () => {
  const route = useRoute();

  const pdfUrl = route.params?.pdfUrl || null;
//   const portalData = route.params?.portalData || null;
  const title = route.params?.title || "Terms & Conditions";

  const [pdfError, setPdfError] = useState(false);

  return (
    <View style={styles.container}>
      {/* If PDF URL exists, try loading it */}
      {pdfUrl && !pdfError ? (
        <Pdf
          trustAllCerts={false}
          source={{ uri: pdfUrl }}
          style={styles.pdf}
          onError={(error) => {
            console.log("PDF Loading Error:", error);
            setPdfError(true);
          }}
          activityIndicator={<ActivityIndicator size="large" color="#000" />}
        />
      ) : (
        <DefaultTermsContent />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  pdf: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default TermsAndConditions;
