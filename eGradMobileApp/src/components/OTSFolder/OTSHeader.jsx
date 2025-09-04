import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, ActivityIndicator } from "react-native";
import { styles } from "../../styles/OTSStyles";
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
      console.log('Sending frontEndUrl:', frontEndUrl);

      const response = await axios.post(`${backEndUrl}/navbar/get-logo`, {  domain: frontEndUrl });

      console.log('Logo fetch response data:', response.data);

      if (response.status === 200 && response.data?.logo) {
        setLogoSrc({ uri: response.data.logo });
      } else {
        setLogoSrc(OTSLogo);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error response:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
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


export default OTSHeader;
