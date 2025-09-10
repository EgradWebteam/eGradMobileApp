import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import Footer from '../components/Footer';
import { LoginHomeHeader } from '../components/LoginHomeHeader';
import { backEndPort, frontEndUrl,backEndUrl } from '../apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStudent } from '../hooks/StudentContext';
export const LoginScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
     const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetCode, setResetCode] = useState("");
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [isResetPassword, setIsResetPassword] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [isSendingResetCode, setIsSendingResetCode] = useState(false);
 const { setStudentData } = useStudent();
 const handleLogin = async () => {
//   console.log("handleLogin called ✅");
  // await AsyncStorage.clear();
  if (!email || !password) {
    Alert.alert("Validation Error", "Please enter email and password");
    return;
  }

  console.log(password, email, "these r password nd emails");
console.log("url",frontEndUrl,backEndPort)
  try {
    const response = await fetch(`${frontEndUrl}:${backEndPort}/login/studentLogin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        instituteOrDomain: `${frontEndUrl}`
      }),
    });
console.log("url",frontEndUrl,backEndPort)
    const data = await response.json();
    console.log(data.message, "this is the responseee");

    if (response.ok && data.user_Id) {
      // Save session tokens & user data to AsyncStorage
      try {
            // await AsyncStorage.clear();
        await AsyncStorage.setItem('accessToken', data.accessToken);
     await AsyncStorage.setItem('decryptedId', String(data.decryptedId || ''));

        await AsyncStorage.setItem('sessionId', String(data.sessionId || ''));
        await AsyncStorage.setItem('userId', String(data.user_Id || ''));
        setStudentData(data);
      } catch (storageError) {
        console.error('AsyncStorage saving error:', storageError);
      }
navigation.navigate("studentDashboard", { userId: data.user_Id });
    //   Alert.alert("Success", "Login successful", [
    //     {
    //       text: "Go to Dashboard",
    //       onPress: () => navigation.navigate("studentDashboard", { userId: data.user_Id }),
    //     },
    //   ]);
    } else {
      setFailedAttempts((prev) => prev + 1);

      if (failedAttempts >= 2) {
        Alert.alert("Error", "Too many failed attempts. Reset password.");
        setIsForgotPassword(true);
        return;
      }

      Alert.alert("Error", data.message || "Invalid credentials");
    }
  } catch (error) {
    console.log(error, "error while login");
    Alert.alert("Error", "Something went wrong during login. Please try again.");
  }
};
     const handleSendResetCode = async () => {
    if (!email) {
      Alert.alert('Validation Error', 'Please enter your email first');
      return;
    }

    setIsSendingResetCode(true);
    try {
      const response = await fetch(
        `${frontEndUrl}:${backEndPort}/login/forgot-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email,instituteOrDomain:`${frontEndUrl}` }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Reset code sent to your email');
        setIsResetPassword(true);
      } else {
        console.log()
        Alert.alert('Error', data.message || 'Failed to send reset code');
      }
    } catch (err) {
      console.log(err, 'error while sending reset code');
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setIsSendingResetCode(false);
    }
  };
  const handleResetPassword = async () => {
    if (!resetCode || !newPassword || !confirmPassword) {
      Alert.alert("Validation Error", "Please enter reset code, new password, and confirm password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match.");
      return;
    }

    const resetPasswordData = {
      email: username,
      resetCode,
      newPassword,
      instituteOrDomain: frontEndURL,
    };

    console.log("resetPasswordData", resetPasswordData);

    try {
      const response = await fetch(`${backEndUrl}/login/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resetPasswordData),
      });

      const text = await response.text();
      console.log("Raw response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: "Invalid server response" };
      }

      if (response.ok) {
        Alert.alert("Success", "Password has been reset successfully. You can now log in.", [
          { text: "OK", onPress: () => navigation.navigate("Login") },
        ]);
      } else {
        Alert.alert("Error", data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.log("Reset password error:", error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
  };
 return (
    <View >
      <LoginHomeHeader />
      <Text style={styles.title}>Login Screen</Text>

      {/* 🔹 Normal Login */}
      {!isForgotPassword && !isResetPassword && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            style={styles.input}
            placeholder="Password"
          />

          <TouchableOpacity style={styles.qbBtn} onPress={handleLogin}>
            <Text style={styles.btnText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsForgotPassword(true)}>
            <Text style={styles.link}>Forgot Password?</Text>
          </TouchableOpacity>
        </>
      )}

      {/* 🔹 Forgot Password */}
      {isForgotPassword && !isResetPassword && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
          />

          <TouchableOpacity
            style={styles.qbBtn}
            onPress={handleSendResetCode}
            disabled={isSendingResetCode}
          >
            <Text style={styles.btnText}>
              {isSendingResetCode ? 'Sending...' : 'Send Reset Code'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsForgotPassword(false)}>
            <Text style={styles.link}>Back to Login</Text>
          </TouchableOpacity>
        </>
      )}

      {/* 🔹 Reset Password */}
      {isResetPassword && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter reset code"
            value={resetCode}
            onChangeText={setResetCode}
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            secureTextEntry
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity style={styles.qbBtn} onPress={handleResetPassword}>
            <Text style={styles.btnText}>Reset Password</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsResetPassword(false)}>
            <Text style={styles.link}>Back to Forgot Password</Text>
          </TouchableOpacity>
        </>
      )}

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  qbBtn: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
  link: { color: '#007bff', textAlign: 'center', marginTop: 10 },
});