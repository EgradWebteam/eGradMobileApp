import React ,{useState,useEffect}from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import Footer from '../components/Footer';
import { LoginHomeHeader } from '../components/LoginHomeHeader';
import { backEndUrl, frontEndUrl } from "../apiConfig.js";

import MobileFooter from './StudentDashboardScreens/MobileFooter.jsx';
const { width, height } = Dimensions.get('window');
const portalImageDefault = require('../assets/EGTLogoExamHeaderCompressed.png');

const HomeScreen = (props) => {
    const isTablet = width > 768;
      const [portalData, setPortalData] = useState({
        portalId: null,
        logoText: 'eGRADTutor',
        logoImg: null,
      });
   const fetchPortalData = async () => {
     try {
       const response = await fetch(`${backEndUrl}/navbar/get-logo`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ domain: frontEndUrl }),
       });
       const data = await response.json();
       if (data.portalId) {
         setPortalData({
           portalId: data.portalId,
           logoText: data.instituteName || 'eGRADTutor',
           logoImg: data.logo,
         });
       }
     } catch (error) {
       console.error('Failed to fetch portal info:', error);
     }
   };
 
   useEffect(() => {
 
     fetchPortalData();
 
   }, []);
    return (
        <View style={styles.container}>
            {/* <LoginHomeHeader /> */}
            
            {/* Main Content */}
            <View style={styles.mainContent}>
                {/* Logo/Brand Section */}
           

                {/* Welcome Text */}
                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeText}>Welcome to</Text>
                       <View style={styles.logoSection}>
                    
                                <Image
                                    source={portalData.logoImg ? { uri: portalData.logoImg } : portalImageDefault}
                                    style={styles.logo}
                                  
                                />
                            </View>
              
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity 
                        style={[styles.button, styles.loginButton]}
                        onPress={() => props.navigation.navigate("login")}
                    >
                        <Text style={styles.loginButtonText}>LOGIN</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.button, styles.registerButton]}
                        onPress={() => props.navigation.navigate("register")}
                    >
                        <Text style={styles.registerButtonText}>REGISTER</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.button, styles.mockTestButton]}
                        onPress={() => props.navigation.navigate('QBScreen', { name: "VeenaRagi" })}
                    >
                        <Text style={styles.mockTestButtonText}>MOCKTEST</Text>
                    </TouchableOpacity>
                </View>

                {/* Footer Text */}
                {/* <View style={styles.footerTextContainer}>
                   <Text style={styles.footerText}>
  By using {portalData.logoText}, you agree to our{' '}
  <Text style={styles.linkText}>Terms and Conditions</Text>,{' '}
  <Text style={styles.linkText}>Privacy Policy</Text>,
  and <Text style={styles.linkText}>Refund Policy</Text>.
</Text>

                </View> */}
                <MobileFooter portalData={portalData}/>
            </View>

            {/* <Footer /> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffffff',
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
logoSection: {
  alignItems: 'center',
  width: width,    // full device width
  marginBottom: 30,
},
 container: {
        flex: 1,
        backgroundColor: '#ffffffff',
    },
logo: {
width: width*0.7,
  height: undefined,    // AUTO height
  aspectRatio: 3,
  resizeMode: 'contain',
},


    welcomeSection: {
        alignItems: 'center',
        width: '100%',
        marginBottom: 50,
    },
    welcomeText: {
        fontSize: 26,
        color: '#666',
        marginBottom: 5,
        fontFamily: 'System',
    },
    brandText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 8,
        fontFamily: 'System',
    },
    tagline: {
        fontSize: 16,
        color: '#7f8c8d',
        fontFamily: 'System',
        letterSpacing: 1,
    },
    buttonsContainer: {
        width: '100%',
        maxWidth: 300,
        marginBottom: 40,
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    loginButton: {
        backgroundColor: '#3498db',
    },
    registerButton: {
        backgroundColor: '#6c757d',
    },
    mockTestButton: {
        backgroundColor: '#6c757d',
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'System',
    },
    registerButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'System',
    },
    mockTestButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'System',
    }
});

export default HomeScreen;