// DefaultRefundContent.jsx
import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

const DefaultRefundContent = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.heading}>CANCELLATION & REFUND POLICY</Text>
      
      <View style={styles.listContainer}>
        <Text style={styles.li}>• We do not accept cancellation of the order or refund claims.</Text>
        <Text style={styles.li}>
          • We do not accept refund for damaged shipment. If the shipment is damaged, please bring it
          to our notice and provide proof for a replacement.
        </Text>
        <Text style={styles.li}>
          • If an amount is debited more than once for the same order, please bring it to our notice.
          We will refund any extra amount received. If we do not receive the extra transaction amount,
          you must contact your bank for the refund.
        </Text>
      </View>

      <Text style={styles.heading}>PRICING POLICY</Text>

      <View style={styles.listContainer}>
        <Text style={styles.li}>
          • Please read the Terms and Conditions and Privacy Policy along with this Refund Policy
          carefully before enrolling/subscribing to any courses.
        </Text>
        <Text style={styles.li}>
          • You cannot change or cancel your enrollment/subscription plan. Once you enroll/subscribe
          and make the payment, it is considered final. No refunds or modifications will be allowed.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 12,
  },
  listContainer: {
    marginBottom: 16,
  },
  li: {
    fontSize: 14,
    lineHeight: 22,
    color: '#444',
    marginBottom: 8,
  },
});

export default DefaultRefundContent;
