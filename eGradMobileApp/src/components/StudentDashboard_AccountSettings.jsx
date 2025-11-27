import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Use Ionicons
import defaultImage from '../images/studentimage.png';
import { backEndUrl, frontEndUrl } from "../apiConfig";

const StudentDashboard_AccountSettings = ({ userData, setActiveSubSection, activeSubSection }) => {
  const [showPassword, setShowPassword] = useState({ new: false, confirm: false });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [touched, setTouched] = useState({ newPassword: false, confirmPassword: false });

  const togglePasswordVisibility = (field) => setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));

  const studentName = userData?.candidate_name;
  const studentEmail = userData?.email_id;
  const studentContact = userData?.mobile_no;
  const studentProfile = userData?.uploaded_photo;

  const checkPasswordCriteria = (password) => ({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    specialChar: /[^A-Za-z0-9]/.test(password),
  });

  const passwordCriteria = checkPasswordCriteria(newPassword);

  const isPasswordValid = (criteria) =>
    criteria.length && criteria.uppercase && criteria.lowercase && criteria.number && criteria.specialChar;

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      setErrorMessage("Please fill out both password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (!isPasswordValid(passwordCriteria)) {
      setErrorMessage("Password does not meet the required criteria.");
      return;
    }

    const resetPasswordData = { email: studentEmail, newPassword, instituteOrDomain: frontEndUrl };

    try {
      const response = await fetch(`${backEndUrl}/login/ChangingStudentPwd`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resetPasswordData),
      });

      const data = await response.json();

      if (response.ok) {
        setPopupMessage("Password changed successfully!");
        setShowPopup(true);
        setErrorMessage("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        if (data.message === "New password must be different from the current password.") {
          Alert.alert("Error", "New password cannot be the same as the old one.");
        } else {
          setErrorMessage(data.message || "Failed to reset password.");
        }
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={studentProfile ? { uri: studentProfile } : defaultImage } style={styles.profileImage} />

        <View style={styles.subSectionButtons}>
          <TouchableOpacity
            style={[styles.button, activeSubSection === "profile" && styles.activeButton]}
            onPress={() => setActiveSubSection("profile")}
          >
            <Text style={[styles.btntext, activeSubSection === "profile" && styles.btntextactive]}>Profile Info</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, activeSubSection === "password" && styles.activeButton]}
            onPress={() => setActiveSubSection("password")}
          >
            <Text style={[styles.btntext, activeSubSection === "profile" && styles.btntextactive]}>Change Password</Text>
          </TouchableOpacity>
        </View>

        {activeSubSection === "profile" && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailText}><Text style={styles.labelBold}>Name: </Text>{studentName}</Text>
            <Text style={styles.detailText}><Text style={styles.labelBold}>Email: </Text>{studentEmail}</Text>
            <Text style={styles.detailText}><Text style={styles.labelBold}>Mobile: </Text>{studentContact}</Text>
          </View>
        )}

        {activeSubSection === "password" && (
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Enter New Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showPassword.new}
                onBlur={() => setTouched(prev => ({ ...prev, newPassword: true }))}
              />
              <TouchableOpacity onPress={() => togglePasswordVisibility("new")}>
                <Icon name={showPassword.new ? "eye-off-outline" : "eye-outline"} size={24} />
              </TouchableOpacity>
            </View>
{newPassword && (
  <View style={styles.criteriaContainer}>
    {Object.entries(passwordCriteria).map(([key, valid]) => {
      const isTouched = touched.newPassword;
      // Only render if valid or field is touched
      if (!valid && !isTouched) return null;

      let text = "";
      switch (key) {
        case "length":
          text = "At least 8 characters";
          break;
        case "uppercase":
          text = "At least one uppercase letter";
          break;
        case "lowercase":
          text = "At least one lowercase letter";
          break;
        case "number":
          text = "At least one number";
          break;
        case "specialChar":
          text = "At least one special character";
          break;
      }

      return (
        <Text key={key} style={{ color: valid ? "green" : "red" }}>
          {text}
        </Text>
      );
    })}
  </View>
)}

            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword.confirm}
                onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
              />
              <TouchableOpacity onPress={() => togglePasswordVisibility("confirm")}>
                <Icon name={showPassword.confirm ? "eye-off-outline" : "eye-outline"} size={24} />
              </TouchableOpacity>
            </View>

            {/* Password criteria checklist */}
            

            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

            <TouchableOpacity
              style={[styles.submitButton, (!isPasswordValid(passwordCriteria) || newPassword !== confirmPassword) && styles.disabledButton]}
              onPress={handlePasswordChange}
              disabled={!isPasswordValid(passwordCriteria) || newPassword !== confirmPassword}
            >
              <Text style={styles.submitText}>Change Password</Text>
            </TouchableOpacity>
          </View>
        )}

        {showPopup && (
          <View style={styles.popup}>
            <Text>{popupMessage}</Text>
            <TouchableOpacity onPress={() => setShowPopup(false)}>
              <Text style={styles.closePopup}>Close</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default StudentDashboard_AccountSettings;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16},
  profileContainer: {
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
  subSectionButtons: { flexDirection: "row", marginBottom: 20 },
  button: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: "#424242", // light blue shade
    alignItems: "center",
  },
  activeButton: { backgroundColor: "#01c3ff" }, // darker blue
  buttonText: { color: "#fff", fontWeight: "bold" },
  detailsContainer: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    flexDirection:"column",
    gap:10,
    backgroundColor: "#fff",
    marginBottom: 20,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Android shadow
    elevation: 3,
  },
  detailText: { fontSize: 16, padding: 10 ,backgroundColor:"#f5f3f3"},
  label: { fontWeight: "bold", marginBottom: 5 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Android shadow
    elevation: 2,
  },
  labelBold: {
    fontWeight: "bold",
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  eyeIcon: { marginRight: 10 },
  criteriaContainer: { marginBottom: 15 },
  error: { color: "red", marginBottom: 10 },
  submitButton: {
    backgroundColor: "#444444",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Android shadow
    elevation: 3,
  },
  btntext: { color: "#fff", fontWeight: "bold" },
  disabledButton: { backgroundColor: "#444444" },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  popup: {
    position: "absolute",
    top: "40%",
    left: "10%",
    right: "10%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    // Android shadow
    elevation: 6,
  },
  closePopup: { marginTop: 15, color: "#3399ff", fontWeight: "bold" },
});

