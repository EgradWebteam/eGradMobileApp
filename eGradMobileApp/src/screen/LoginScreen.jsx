import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import Footer from '../components/Footer';
import { LoginHomeHeader } from '../components/LoginHomeHeader';

export const LoginScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = async () => {
        console.log("handleLogin called ✅");
        if (!email || !password) {
            Alert.alert("Validaion Error, Please enter email and password");
            return;
        }
        console.log(password, email, "these r password nd emails");
        try {
            const response = await fetch("http://192.168.0.106:5003/login/studentLogin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email, password,
                    instituteOrDomain: "http://192.168.0.106:19000"
                }),
            });
            const data = await response.json();
            console.log(data.message, "this is the responseee");
            if (response.ok) {
                // Alert.alert("Login successfull  ");
                Toast.show({
                    type: "success",
                    text1: "Login Successful",
                    text2: `Welcome ${data.userDetails.candidate_name}`,
                    position: 'top',
                    visibilityTime: 2000,
                    autoHide: true,
                    onHide: () => navigation.navigate("studentDashboard")

                })
                console.log("Login successful", data);
            } else {
                console.error("Login failed", data);
            }

        } catch (error) {
            console.log(error, "error while login")
        }
    }
    return (
        <View>
            <LoginHomeHeader/>
            <Text style={styles.title}>LoginScreen</Text>
            <TextInput style={styles.input} placeholder='Email' value={email} onChangeText={setEmail} />
            <TextInput value={password} secureTextEntry onChangeText={setPassword} style={styles.input} placeholder='Password' />
            <TouchableOpacity style={styles.qbBtn} onPress={handleLogin}>
                <Text >
                    Login
                </Text>
            </TouchableOpacity>
            <Footer/>
        </View>
    )
}
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20 },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
});