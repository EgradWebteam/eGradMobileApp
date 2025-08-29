import React from "react";
import { View, Text, TouchableOpacity, Linking, StyleSheet, ScrollView } from "react-native";
// import { FontAwesome, Ionicons, MaterialIcons } from "react-native-vector-icons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

 const Footer = () => {
  return (
    <ScrollView style={styles.footerMain}>
      <View style={styles.footerDiv}>
        {/* Brand */}
        <View style={styles.footeregradDiv}>
          <Text style={styles.footerTitleColor2}>
            eGRADTutor
            <Text style={styles.registered}>®</Text>
          </Text>
        </View>

        {/* Terms & Policies */}
        <View style={[styles.footerLinksDiv, styles.footerTerms]}>
          <TouchableOpacity 
          onPress={() => Linking.openURL("/terms")}
            >
            <Text style={styles.linkText}>Terms and Conditions</Text>
          </TouchableOpacity>
          <TouchableOpacity 
          onPress={() => Linking.openURL("/policy")}
          >
            <Text style={styles.linkText}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity 
          onPress={() => Linking.openURL("/CancellationRefundPolicy")}
          >
            <Text style={styles.linkText}>Pricing & Refund Policy</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Info */}
        <View style={[styles.footerLinksDiv, styles.footerContact]}>
          <View style={styles.footerLinksDiv1}>
            <MaterialIcons name="call" size={20} color="#fff" />
            <TouchableOpacity onPress={() => Linking.openURL("tel:+917993270532")}>
              <Text style={styles.contactText}>+91-7993270532</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footerLinksDiv1}>
            <Ionicons name="mail" size={20} color="#fff" />
            <TouchableOpacity onPress={() => Linking.openURL("mailto:contact@egradtutor.in")}>
              <Text style={styles.contactText}>contact@egradtutor.in</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Corporate Address */}
        <View style={[styles.footeregradDiv, styles.footeregradContactUs]}>
          <Text style={styles.footerTitleColor2}>Contact Us</Text>
          <Text style={styles.footerTitleCorporate}>Corporate Office:</Text>
          <View style={styles.addressDiv}>
            <Text>eGRADTutor (eGATETutor Academy)</Text>
            <Text>R.K Nivas, 2nd Floor, Shivam Road,</Text>
            <Text>New Nallakunta, Hyderabad - 500044</Text>
          </View>
        </View>
      </View>

      {/* Social Icons & Copyright */}
      <View style={styles.footerCopyright}>
        <View style={styles.footerEgradFollowUs}>
          <View style={styles.footerIconsDiv}>
            <TouchableOpacity
            //  onPress={() => Linking.openURL("https://www.facebook.com/")}
              >
              <FontAwesome name="facebook" size={25} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
            // onPress={() => Linking.openURL("https://www.instagram.com/egradtutor/")}
            >
              <FontAwesome name="instagram" size={25} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
            // onPress={() => Linking.openURL("https://www.linkedin.com/")}
            >
              <FontAwesome name="linkedin" size={25} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
            // onPress={() => Linking.openURL("https://www.youtube.com/@eGRADTutor")}
            >
              <FontAwesome name="youtube" size={25} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.copyrightText}>
          Copyright © 2024 eGRADTutor All rights reserved
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  footerMain: {
    width: "100%",
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingTop: 16,
    color: "#fff",
  },
  footerDiv: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 20,
    paddingVertical: 10,
  },
  footeregradDiv: {
    flexDirection: "column",
    gap: 5,
    paddingBottom: 8,
  },
  footeregradContactUs: {
    marginTop: 10,
  },
  footerLinksDiv: {
    flexDirection: "column",
    gap: 8,
  },
  footerTerms: {
    color: "#c4c6c7",
  },
  footerContact: {
    paddingTop: 20,
  },
  footerLinksDiv1: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 5,
  },
  contactText: {
    color: "#fff",
  },
  footerTitleColor2: {
    color: "#279eff",
    fontSize: 20,
    fontWeight: "700",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 9 },
    textShadowRadius: 8,
  },
  footerTitleCorporate: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
  addressDiv: {
    color: "#c4c6c7",
    marginTop: 5,
  },
  footerCopyright: {
    borderTopWidth: 1,
    borderTopColor: "#c4c6c7",
    paddingTop: 8,
    alignItems: "center",
    marginTop: 10,
  },
  footerEgradFollowUs: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerIconsDiv: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 8,
  },
  registered: {
    fontSize: 12,
  },
  copyrightText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
  },
  linkText: {
    color: "#c4c6c7",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default Footer;
