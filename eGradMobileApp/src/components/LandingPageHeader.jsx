import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Modal, FlatList, TextInput, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, FontAwesome } from 'react-native-vector-icons';
const ALL_POSSIBLE_TABS = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "register", label: "Register" },
  { key: "courses", label: "Courses" },
  { key: "contact", label: "Contact" },
  { key: "enroll", label: "How To Enroll" },
  { key: "mocktest", label: "Mock Test" },
  { key: "schedulepage", label: "Test Schedule" },
];

const LandingPageHeader = ({ logo, isAdmin = false }) => {
  const [activeTab, setActiveTab] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [navTabsModalOpen, setNavTabsModalOpen] = useState(false);

  const [logoImage, setLogoImage] = useState(logo);
  const [navItems, setNavItems] = useState(ALL_POSSIBLE_TABS);
  const navigation = useNavigation();

  const handleScrollOrNavigate = (key) => {
    setActiveTab(key);
    setMobileMenuOpen(false);

    // Simple navigation logic
    if (key === "register") navigation.navigate("StudentRegistrationPage");
    else if (key === "enroll") navigation.navigate("HowToEnrollPage");
    else if (key === "mocktest") navigation.navigate("MockTestPage");
    else navigation.navigate(key); // for static pages like Home, About, Courses
  };

  const toggleTabSelection = (key) => {
    setNavItems((prev) =>
      prev.map((tab) => (tab.key === key ? { ...tab, selected: !tab.selected } : tab))
    );
  };

  return (
    <View style={styles.headerContainer}>
      {/* Logo */}
      <TouchableOpacity onPress={() => handleScrollOrNavigate("home")} style={styles.logoWrapper}>
        <Image source={logoImage} style={styles.logo} />
        {isAdmin && (
    <FontAwesome name="edit" size={30} color="black" />
        )}
      </TouchableOpacity>

      {/* Hamburger & Nav Menu */}
      <TouchableOpacity onPress={() => setMobileMenuOpen(!mobileMenuOpen)} style={styles.hamburgerBtn}>
    <Ionicons name="menu" size={30} color="black" />
      </TouchableOpacity>

      {mobileMenuOpen && (
        <View style={styles.navMenu}>
          {navItems.map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              onPress={() => handleScrollOrNavigate(key)}
              style={[styles.navItem, activeTab === key && styles.activeTab]}
            >
              <Text>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Logo Modal */}
      <Modal visible={logoModalOpen} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text>Edit Logo</Text>
            <TextInput placeholder="Enter new logo URL" onChangeText={setLogoImage} value={logoImage} style={styles.input} />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setLogoModalOpen(false)} style={styles.button}>
                <Text>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setLogoModalOpen(false)} style={styles.button}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Nav Tabs Modal */}
      <Modal visible={navTabsModalOpen} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text>Edit Navigation Tabs</Text>
            <FlatList
              data={ALL_POSSIBLE_TABS}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => {
                const isChecked = navItems.find((tab) => tab.key === item.key)?.selected ?? true;
                return (
                  <View style={styles.navEditRow}>
                    <TextInput value={item.label} style={styles.input} editable={isChecked} />
                    <TouchableOpacity onPress={() => toggleTabSelection(item.key)}>
                      <Text>{isChecked ? "✅" : "❌"}</Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setNavTabsModalOpen(false)} style={styles.button}>
                <Text>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setNavTabsModalOpen(false)} style={styles.button}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LandingPageHeader;

const styles = StyleSheet.create({
  headerContainer: { flexDirection: "row", alignItems: "center", padding: 10, backgroundColor: "#fff", justifyContent: "space-between" },
  logoWrapper: { flexDirection: "row", alignItems: "center" },
  logo: { width: 100, height: 40, resizeMode: "contain" },
  editIcon: { marginLeft: 8 },
  hamburgerBtn: { padding: 8 },
  navMenu: { position: "absolute", top: 60, right: 0, backgroundColor: "#eee", padding: 10, borderRadius: 5 },
  navItem: { padding: 10 },
  activeTab: { backgroundColor: "#ccc" },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 10, width: "80%" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  button: { padding: 10, backgroundColor: "#ddd", borderRadius: 5 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginVertical: 5 },
  navEditRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
});
