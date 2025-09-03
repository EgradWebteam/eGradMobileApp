import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, ActivityIndicator } from "react-native";

import { backEndUrl, frontEndUrl,backEndPort } from "../../apiConfig";
// Replace this with your local image import or require path
import OTSLogo from "../../images/EGTLogoExamHeaderCompressed.png"; 
import axios from "axios";
// Replace with your actual API base URL

const OTSHeader = () => {
  const [logoSrc, setLogoSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
useEffect(() => {
  const fetchLogo = async () => {
    try {
      const response = await axios.post(`${backEndUrl}/navbar/get-logo`, {
        frontEndUrl
      });

      if (response.status === 200) {
        const data = response.data;
        if (data?.logo) {
          setLogoSrc({ uri: data.logo }); // React Native's remote image format
        } else {
          setLogoSrc(OTSLogo); // Fallback to local asset
        }
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data?.logo) {
        setLogoSrc({ uri: data.logo }); // React Native's remote image format
      } else {
        setLogoSrc(OTSLogo); // Fallback to local asset
      }
    } catch (error) {
      console.error('Failed to fetch logo:', error);
      setLogoSrc(OTSLogo);
    } finally {
      setIsLoading(false);
    }
  };

  fetchLogo();
}, []);


  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoHolder}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <Image
            source={logoSrc}
            style={styles.logo}
            resizeMode="contain"
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logoHolder: {
    width: 200,
    height: 40,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
});

export default OTSHeader;
