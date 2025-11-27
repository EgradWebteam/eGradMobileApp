// DefaultPrivacyContent.js
import React from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";

const DefaultPrivacyContent = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.heading}>PRIVACY POLICY</Text>

      <Text style={styles.paragraph}>
        We at <Text style={styles.bold}>www.egradtutor.in</Text> value your trust. In order to honour that trust,
        we adhere to ethical standards in gathering, using, and safeguarding any information provided by you.
        We are committed to protecting your privacy and work towards offering a safe online experience. This
        Privacy Policy describes how we handle information on this website.
      </Text>

      <Text style={styles.paragraph}>
        By visiting or accessing this website you agree to be bound by this Privacy Policy and consent to the
        collection, use, and processing of your information as set out below.
      </Text>

      <Text style={styles.bold}>1. Information We Collect</Text>
      <Text style={styles.paragraph}>
        The type and amount of information depends on how you use our website. We collect information you
        voluntarily provide, such as:
      </Text>
      <View style={styles.list}>
        <Text style={styles.listItem}>• Your name, email, phone number, password, and educational interests</Text>
        <Text style={styles.listItem}>• Transaction-related information (purchases, offers, downloads)</Text>
        <Text style={styles.listItem}>• Information you provide when contacting us for help</Text>
        <Text style={styles.listItem}>• Information you enter when using services (tests, classes, discussions)</Text>
      </View>

      <Text style={styles.paragraph}>
        Note: Do not submit information you do not want to be retained by us.
      </Text>

      <Text style={styles.bold}>2. Non-Personal Information</Text>
      <Text style={styles.paragraph}>
        We automatically track non-personal info such as navigation data, IP addresses, timestamps, and URLs
        to better understand and serve users.
      </Text>

      <Text style={styles.bold}>3. Communication & Storage</Text>
      <Text style={styles.paragraph}>
        Emails or letters you send may be stored. Other users’ correspondence related to you may also be stored.
      </Text>

      <Text style={styles.bold}>4. Sharing Information</Text>
      <Text style={styles.paragraph}>
        Personal information may only be shared with trusted partners or as required by law. We do not sell
        or rent your personal data.
      </Text>

      <Text style={styles.bold}>5. Security</Text>
      <Text style={styles.paragraph}>
        We adopt reasonable measures to protect your data, including passwords and profile information.
      </Text>

      <Text style={styles.bold}>6. Data Retention</Text>
      <Text style={styles.paragraph}>
        Personal information is kept no longer than necessary and is deleted or archived per legal requirements.
      </Text>

      <Text style={styles.bold}>7. Cookies</Text>
      <Text style={styles.paragraph}>
        Cookies are used to track preferences and improve user experience. Some features may not work if cookies
        are disabled.
      </Text>

      <Text style={styles.bold}>8. Grievances</Text>
      <Text style={styles.paragraph}>
        For concerns regarding your personal information, email us at <Text style={styles.bold}>info@egradtutor.in</Text>.
      </Text>

      <Text style={styles.bold}>9. Arbitration</Text>
      <Text style={styles.paragraph}>
        Any dispute arising out of this Privacy Policy shall be resolved by arbitration in Hyderabad, India.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  contentContainer: { padding: 20 },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  paragraph: { fontSize: 16, marginBottom: 10, lineHeight: 22 },
  bold: { fontWeight: "bold" },
  list: { marginLeft: 15, marginBottom: 10 },
  listItem: { fontSize: 16, lineHeight: 22, marginBottom: 5 },
});

export default DefaultPrivacyContent;
