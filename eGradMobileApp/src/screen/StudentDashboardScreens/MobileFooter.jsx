import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MobileFooter = ({ portalData }) => {
  return (
            <View style={styles.footerTextContainer}>
                   <Text style={styles.footerText}>
  By using {portalData.logoText}, you agree to our{' '}
  <Text style={styles.linkText}>Terms and Conditions</Text>,{' '}
  <Text style={styles.linkText}>Privacy Policy</Text>,
  and <Text style={styles.linkText}>Refund Policy</Text>.
</Text>

                </View>
  );
};

const styles = StyleSheet.create({
   footerTextContainer: {
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
    },
    footerText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#95a5a6',
        lineHeight: 18,
        fontFamily: 'System',
    },
    linkText: {
        color: '#3498db',
        textDecorationLine: 'underline',
    },
});

export default MobileFooter;
