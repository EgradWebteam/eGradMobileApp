import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const DefaultTermsContent = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Terms and Conditions</Text>

      <Text style={styles.p}>
        We at egradtutor value your trust. We follow ethical standards in
        gathering, using, and safeguarding information. We aim to offer you a
        safe and useful online experience.
      </Text>

      <Text style={styles.p}>
        This policy applies to all users who access or visit our platform. By
        accessing our app, you agree to be bound by this policy.
      </Text>

      <Text style={styles.subHeading}>1. Information We Collect</Text>

      <Text style={styles.p}>
        The type and amount of information we collect depends entirely on how
        you use our application. Information may include:
      </Text>

      <View style={styles.list}>
        <Text style={styles.li}>• Name, age, gender, email, phone</Text>
        <Text style={styles.li}>
          • Transaction-related information when making purchases or accessing
          study materials
        </Text>
        <Text style={styles.li}>
          • Information submitted during tests, discussions, or classes
        </Text>
        <Text style={styles.li}>• Information provided when contacting support</Text>
      </View>

      <Text style={styles.p}>
        You should not submit information that you do not want stored by us.
      </Text>

      <Text style={styles.subHeading}>2. Automatically Collected Information</Text>

      <Text style={styles.p}>
        We may automatically collect non-personal information such as website
        navigation data, IP address, timestamps, device type, and clickstream
        patterns for internal research and user experience improvement.
      </Text>

      <Text style={styles.subHeading}>3. Communications</Text>

      <Text style={styles.p}>
        Personal communications such as emails or support requests may be stored
        on our servers for service improvement.
      </Text>

      <Text style={styles.subHeading}>4. Sharing of Information</Text>

      <View style={styles.list}>
        <Text style={styles.li}>
          • Trusted partners assisting in communication and marketing
        </Text>
        <Text style={styles.li}>• Legal requests (court orders, subpoenas)</Text>
        <Text style={styles.li}>
          • Prevention of fraud, illegal activity, or potential threats
        </Text>
        <Text style={styles.li}>
          • If the company is acquired or merged with another entity
        </Text>
      </View>

      <Text style={styles.subHeading}>System Requirements</Text>

      <View style={styles.list}>
        <Text style={styles.li}>
          • Ensure pop-ups are not blocked on Safari or Firefox
        </Text>
        <Text style={styles.li}>
          • On macOS, switching to fullscreen mode is recommended
        </Text>
      </View>

      <Text style={styles.subHeading}>5. Data Retention</Text>

      <Text style={styles.p}>
        Personal information is stored only as long as necessary for legal,
        contractual, or operational reasons. After that period, data is deleted
        or archived.
      </Text>

      <Text style={styles.subHeading}>6. Cookies</Text>

      <Text style={styles.p}>
        Cookies help track preferences and identify user trends. Disabling
        cookies may impact certain functionalities.
      </Text>

      <Text style={styles.subHeading}>7. External Websites</Text>

      <Text style={styles.p}>
        We are not responsible for the policies of third-party websites linked
        from our application.
      </Text>

      <Text style={styles.subHeading}>8. Updates to Policy</Text>

      <Text style={styles.p}>
        This policy may evolve. Continued usage of the app implies acceptance of
        any updates.
      </Text>

      <Text style={styles.subHeading}>9. Grievances</Text>

      <Text style={styles.p}>
        For issues, email us at: info@egradtutor.in
      </Text>

      <Text style={styles.heading}>Cancellation & Refund Policy</Text>

      <View style={styles.list}>
        <Text style={styles.li}>• No cancellation or refund after purchase.</Text>
        <Text style={styles.li}>
          • Damaged shipment replacement is provided after proof submission.
        </Text>
        <Text style={styles.li}>
          • Extra payments made due to multiple transactions will be refunded if
            received by us.
        </Text>
      </View>

      <Text style={styles.heading}>Pricing Policy</Text>

      <View style={styles.list}>
        <Text style={styles.li}>
          • No cancellation, modification, or refund after subscription.
        </Text>
        <Text style={styles.li}>
          • All enrollments are final and non-refundable.
        </Text>
      </View>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff", flex: 1 },
  heading: { fontSize: 20, fontWeight: "700", marginBottom: 10 },
  subHeading: { fontSize: 16, fontWeight: "600", marginTop: 16, marginBottom: 6 },
  p: { fontSize: 14, color: "#444", lineHeight: 20, marginBottom: 8 },
  list: { marginLeft: 10, marginBottom: 10 },
  li: { fontSize: 14, lineHeight: 20, color: "#444", marginBottom: 4 },
});

export default DefaultTermsContent;
