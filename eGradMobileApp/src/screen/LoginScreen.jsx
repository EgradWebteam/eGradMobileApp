import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert("Validaion Error, Please enter email and password");
            return
        }
        try {
            
        } catch (error) {
            
        }
    }
    return (
        <View>
            <Text style={styles.title}>LoginScreen</Text>
            <TextInput style={styles.input} placeholder='Email' value={email} onChange={setEmail} />
            <TextInput value={password} secureTextEntry onChange={setPassword} style={styles.input} placeholder='Password' />
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