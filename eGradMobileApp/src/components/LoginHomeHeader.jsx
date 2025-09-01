import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, View, StyleSheet, TouchableOpacity, Text } from 'react-native';

export const LoginHomeHeader = () => {
     const navigation = useNavigation();
    return (
        <View style={styles.pc}>
            <TouchableOpacity   onPress={() => navigation.navigate("Home")}>
            <View style={styles.container}>
                <Image
                    source={require('../assets/EGTLogoExamHeaderCompressed.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
            </TouchableOpacity>
            <View>
                <TouchableOpacity  onPress={() => navigation.navigate('login')}style={styles.button} >
                    <Text style={styles.buttonText}> Login </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    pc: {
        flexDirection: 'row',        // needed for space-between horizontally
        justifyContent: 'space-between',
        //   borderColor: 'black',
        //   borderWidth: 2,       
        padding: 10,
        alignItems: 'center',
        backgroundColor: "white",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        // Android shadow
        elevation: 5,
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', // optional
    },
    logo: {
        width: 190,  // adjust as needed
    },
    button: {
        backgroundColor: '#000', // black background
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginVertical: 10,
    },
    buttonContent: {
        flexDirection: 'row',
        justifyContent: 'space-between', // space between text and icon
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
