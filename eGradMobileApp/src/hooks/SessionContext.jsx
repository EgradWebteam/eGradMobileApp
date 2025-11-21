import React, { createContext, useContext } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { backEndUrl } from "../../src/apiConfig";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const navigation = useNavigation();

  /* ===========================================================
     VALIDATE SESSION (with Navigation)
  =========================================================== */
  const validateSession = async () => {
    const sessionId = await AsyncStorage.getItem("sessionId");
    if (!sessionId) return;

    try {
      const response = await fetch(`${backEndUrl}/login/verifySession`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();

      if (!data.success) {
        Alert.alert(
          "Logged Out",
          "You have been logged out due to login from another device."
        );

        await clearSessionData();

        navigation.navigate("login");
        return false;
      }

      return true;
    } catch (err) {
      console.error("Session check failed", err);
      return false;
    }
  };

  /* ===========================================================
     VALIDATE SESSION WITHOUT NAVIGATION (Admin Support)
  =========================================================== */
  const validateSessionWithoutNavigation = async () => {
    const sessionId = await AsyncStorage.getItem("sessionId");
    const adminRole = await AsyncStorage.getItem("adminRole");

    const isAdmin = adminRole === "admin";
    if (isAdmin) return true;

    if (!sessionId) return false;

    try {
      const response = await fetch(`${backEndUrl}/login/verifySession`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) return false;

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("JSON parse failed:", jsonError);
        return false;
      }

      if (!data.success) {
        Alert.alert(
          "Logged Out",
          "You have been logged out due to login from another device."
        );

        await clearSessionData();
        return false;
      }

      return true;
    } catch (err) {
      console.error("Session check failed:", err);
      return false;
    }
  };

  /* ===========================================================
     CLEAR SESSION DATA
  =========================================================== */
  const clearSessionData = async () => {
    await AsyncStorage.multiRemove([
      "decryptedId",
      "accessToken",
      "sessionId",
      "userId",
      "studentData",
      "OTS_FormattedTime",
      "studentDashboardState",
      "navigationToken",
    ]);
  };

  return (
    <SessionContext.Provider
      value={{ validateSession, validateSessionWithoutNavigation }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
