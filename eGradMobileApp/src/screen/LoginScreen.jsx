import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = async () => {
         console.log("handleLogin called ✅");
        if (!email || !password) {
            Alert.alert("Validaion Error, Please enter email and password");
            return;
        }
        console.log(password,email,"these r password nd emails");
        console.log()
        try {
            const response = await fetch("http://192.168.0.106:5003/login/studentLogin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,password,
                    instituteOrDomain:"http://192.168.0.106:19000"
                }),
            });
            console.log(response,"this is the responseee");

        } catch (error) {
            console.log(error,"error while login")
        }
    }
    return (
        <View>
            <Text style={styles.title}>LoginScreen</Text>
            <TextInput style={styles.input} placeholder='Email' value={email} onChangeText={setEmail} />
            <TextInput value={password} secureTextEntry onChangeText={setPassword} style={styles.input} placeholder='Password' />
            <TouchableOpacity style={styles.qbBtn} onPress={handleLogin}>
                <Text >
                    Login
                </Text>
            </TouchableOpacity>
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