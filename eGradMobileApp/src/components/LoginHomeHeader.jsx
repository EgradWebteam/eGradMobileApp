import React from 'react';
import { Image, View, StyleSheet, TouchableOpacity, Text } from 'react-native';

export const LoginHomeHeader = () => {
  return (
    <View style={styles.pc}>
    <View style={styles.container}>
      <Image 
        source={require('../assets/EGTLogoExamHeaderCompressed.png')} 
        style={styles.logo} 
        resizeMode="contain"
      />
    </View>
     <View>
        <TouchableOpacity style={styles.button}>
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
  borderColor: 'black',
  borderWidth: 2,              // just a number, no "px"
  padding: 10,                 // optional padding
  alignItems: 'center', 
  backgroundColor:"white"       // vertically center content
},
  container: {
    // height: 80, // adjust as needed
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // optional
  },
  logo: {
    width: 190,  // adjust as needed
    // height: 60,  // adjust as needed
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
