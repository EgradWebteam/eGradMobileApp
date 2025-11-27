import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { backEndUrl, frontEndUrl } from "../../apiConfig";

// Normalize string to compare
const normalizeKey = (str) => str?.toLowerCase().replace(/\s+/g, "");

const MobileFooter = ({ portalData }) => {
  const navigation = useNavigation();

  const [policyLinks, setPolicyLinks] = useState({
    terms: null,
    privacy: null,
    refund: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPDFLinks = async () => {
      try {
        const res = await fetch(
          `${backEndUrl}/landingpagefooter/footer-configuration/footermobilelinks`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ domain: frontEndUrl || "" }),
          }
        );

        const data = await res.json();
        const docs = data.policy_documents || [];
        console.log("Fetched policy documents:", docs);

        // Helper function to find document by type
        const findDoc = (name) =>
          docs.find((d) => normalizeKey(d.document_type) === normalizeKey(name));

        setPolicyLinks({
          terms: findDoc("terms and conditions")?.pdf_url || null,
          privacy: findDoc("privacy policy")?.pdf_url || null,
          refund: findDoc("refund policy")?.pdf_url || null,
        });
      } catch (err) {
        console.log("Failed to load policy links:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPDFLinks();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="small" color="#555" />
      </View>
    );
  }

  return (
    <View style={styles.footerTextContainer}>
      <Text style={styles.footerText}>
        By using {portalData?.logoText}, you agree to our{" "}
        
        {/* Terms & Conditions */}
        <Text
          style={styles.linkText}
          onPress={() =>
            navigation.navigate("TermsAndConditions", {
              pdfUrl: policyLinks.terms,
              title: "Terms & Conditions",
            })
          }
        >
          Terms & Conditions
        </Text>
        ,{" "}

        {/* Privacy Policy */}
        <Text
          style={styles.linkText}
          onPress={() =>
            navigation.navigate("PrivacyPolicy", {
              pdfUrl: policyLinks.privacy,
              title: "Privacy Policy",
            })
          }
        >
          Privacy Policy
        </Text>
        ,{" "}

        {/* Refund Policy */}
        <Text
          style={styles.linkText}
          onPress={() =>
            navigation.navigate("RefundPolicy", {
              pdfUrl: policyLinks.refund,
              title: "Refund Policy",
            })
          }
        >
          Refund Policy
        </Text>
        .
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footerTextContainer: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
    color: "#95a5a6",
    lineHeight: 18,
  },
  linkText: {
    color: "#3498db",
    textDecorationLine: "underline",
  },
  loading: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});

export default MobileFooter;
