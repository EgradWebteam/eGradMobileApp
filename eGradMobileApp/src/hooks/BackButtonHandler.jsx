// BackButtonsHandler.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { backEndUrl } from "../apiConfig";

const BackButtonsHandler = () => {
  const navigation = useNavigation();
  const [showPopup, setShowPopup] = useState(false);
  const pendingActionRef = useRef(null);
  const allowNavigationRef = useRef(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (allowNavigationRef.current) return;

      e.preventDefault();
      pendingActionRef.current = e.data.action;
      setShowPopup(true);
    });

    return unsubscribe;
  }, [navigation]);

  // ⭐ YES BUTTON = LOGOUT + API CALL + CLEAR SESSION + GO TO LOGIN
  const handleYes = async () => {
    setShowPopup(false);
    allowNavigationRef.current = true;

    try {
      const sessionId = await AsyncStorage.getItem("sessionId");
      console.log("Attempting logout, Session ID:", sessionId);

      if (!sessionId) {
        await AsyncStorage.clear();
        Alert.alert("Session Error", "No session found. Please log in again.");
        navigation.reset({
          index: 0,
          routes: [{ name: "login" }],
        });
        return;
      }

      const response = await fetch(`${backEndUrl}/login/studentLogout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();
      console.log("Logout response:", data);

      // Always clear async storage
      await AsyncStorage.clear();

      navigation.reset({
        index: 0,
        routes: [{ name: "login" }],
      });
    } catch (error) {
      console.error("Logout Error:", error);
      await AsyncStorage.clear();

      navigation.reset({
        index: 0,
        routes: [{ name: "login" }],
      });
    }
  };

  // ❌ NO BUTTON → close popup only
  const handleNo = () => {
    setShowPopup(false);
    pendingActionRef.current = null;
  };

  if (!showPopup) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.popup}>
        <Text style={styles.message}>Are you sure you want to logout?</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.yesButton} onPress={handleYes}>
            <Text style={styles.btnText}>Yes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.noButton} onPress={handleNo}>
            <Text style={styles.btnText}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default BackButtonsHandler;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  message: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  yesButton: {
    width: "40%",
    backgroundColor: "#1976d2",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  noButton: {
    width: "40%",
    backgroundColor: "#E53935",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
  },
});
