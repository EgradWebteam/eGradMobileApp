import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  BackHandler,
  Dimensions,
  ActivityIndicator,
 
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import { styles } from '../styles/OTSStyles.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStudent } from '../hooks/StudentContext.jsx';
// import { useSession } from '../../StudentDashboard/hooks/SessionContext';
import { decryptBatch, encryptBatch } from '../utils/CryptoUtils.jsx';
import axios from 'axios';
import defaultImage from '../images/studentimage.png';
import adminCapImg from '../images/capImg.png';
import OTSHeader from "../components/OTSFolder/OTSHeader";
 import { backEndUrl, frontEndUrl,backEndPort } from "../apiConfig.js";
 import RenderHtml from 'react-native-render-html';
const ExamInstructionsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { testId, studentId, courseId } = route.params || {};
//   const { validateSessionWithoutNavigation } = useSession();
  const [realTestId, setRealTestId] = useState('');
  const [realStudentId, setRealStudentId] = useState('');
  const [realCourseId, setRealCourseId] = useState('');
  const [instructionsData, setInstructionsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const logoutHandledRef = useRef(false);

  const { studentData } = useStudent();
  const userData = studentData?.userDetails;
  const studentName = userData?.candidate_name;
  const studentProfile = userData?.uploaded_photo;

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const getAdminRole = async () => {
      const role = await AsyncStorage.getItem('adminRole');
      setIsAdmin(role === 'admin');
    };
    getAdminRole();
  }, []);
useEffect(() => {
  const onBackPress = async() => {
     const userId = await AsyncStorage.getItem('userId');
    Alert.alert(
      "Exit Exam Instructions",
      "Are you sure you want to exit the Exam Instructions?",
      [
        {
          text: "No",
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'studentDashboard', params: { userId } }],
            });
          }
        }
      ]
    );
    return true; // Block the default behavior
  };
  BackHandler.addEventListener("hardwareBackPress", onBackPress);
  return () => {
    BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  };
}, []);
  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        let decryptedTestId = '';
        let decryptedStudentId = '';
        let decryptedCourseId = '';

        if (studentId) {
          const [dTestId, dStudentId, dCourseId] = await decryptBatch([
            decodeURIComponent(testId),
            decodeURIComponent(studentId),
            decodeURIComponent(courseId),
          ]);
          decryptedTestId = dTestId;
          decryptedStudentId = dStudentId;
          decryptedCourseId = dCourseId;
        } else {
          [decryptedTestId] = await decryptBatch([decodeURIComponent(testId)]);
        }

        setRealTestId(decryptedTestId);
        setRealStudentId(decryptedStudentId);
        setRealCourseId(decryptedCourseId);
// console.log(decryptedTestId)
        const token = isAdmin
          ? await AsyncStorage.getItem('adminToken')
          : await AsyncStorage.getItem('accessToken');

        const response = await axios.get(`${backEndUrl}/studentmycourses/instructions/${decryptedTestId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status !== 200) throw new Error('Failed to fetch instructions');
        const data = response.data;
        setInstructionsData(data);
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'Failed to load instructions.');
        navigation.navigate('ErrorScreen');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstructions();
  }, [testId, studentId, courseId]);

  const handleBeginTest = async () => {
    // const isValid = await validateSessionWithoutNavigation();
    // if (isValid) {
      setIsSaving(true);
      // await AsyncStorage.setItem('navigationToken', 'valid');
      try {
        const encrypted = studentId
          ? await encryptBatch([realTestId, realStudentId, realCourseId])
          : await encryptBatch([realTestId]);

        navigation.navigate('TestScreen', {
          testId: encodeURIComponent(encrypted[0]),
          studentId: studentId ? encodeURIComponent(encrypted[1]) : null,
          courseId: courseId ? encodeURIComponent(encrypted[2]) : null,
        });
      } catch (error) {
        console.error('Encryption failed:', error);
        navigation.navigate('ErrorScreen');
      } finally {
        setIsSaving(false);
      }
    // } else {
    //   Alert.alert('Session expired', 'Your session is no longer valid.');
    // }
  };

  const handlePrevious = async () => {
    // const isValid = await validateSessionWithoutNavigation();
    // if (isValid) {
      const encrypted = studentId
        ? await encryptBatch([realTestId, realStudentId, realCourseId])
        : await encryptBatch([realTestId]);

      navigation.navigate('GeneralInstructions', {
        testId: encodeURIComponent(encrypted[0]),
        studentId: studentId ? encodeURIComponent(encrypted[1]) : null,
        courseId: courseId ? encodeURIComponent(encrypted[2]) : null,
      });
    // }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000080" />
      </View>
    );
  }

  const instructionHeading = instructionsData[0]?.instruction_heading || 'Exam Instructions';
  const instructionPoints = instructionsData[0]?.instruction_points || [];
// console.log(instructionPoints.join('') )
  return (
    <ScrollView contentContainerStyle={styles.containergi}>
      <OTSHeader />
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Text style={styles.heading}>{instructionHeading}</Text>

     
     
        <RenderHtml
          contentWidth={Dimensions.get('window').width}
          source={{ html: instructionPoints.join('') }} // Join if the instruction points are an array of strings
          tagsStyles={{
            p: { fontSize: 16, lineHeight: 24, marginBottom: 10 },
            ul: { marginBottom: 10 },
            ol: { marginBottom: 10 },
            li: { fontSize: 16, color: '#555', marginBottom: 5 },
            strong: { fontWeight: 'bold' },
            em: { fontStyle: 'italic' },
            h1: { fontSize: 28, fontWeight: 'bold', marginBottom: 15 },
            h2: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
            h3: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
            h4: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
            h5: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
            h6: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
            u: { textDecorationLine: 'underline' },
            a: { color: 'blue' },
            img: { width: '100%', height: undefined, aspectRatio: 1 },
            table: { borderWidth: 1, borderColor: '#ddd', marginBottom: 10 },
            th: { padding: 5, backgroundColor: '#f0f0f0' },
            td: { padding: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' },
            pre: { backgroundColor: '#f4f4f4', padding: 10, marginBottom: 10 },
            code: { fontFamily: 'monospace', backgroundColor: '#f4f4f4', padding: 5 },
          }}
   renderers={{
      
          // Make sure src is defined and valid
  img: ({ width, height, ...props }) => {
    //  console.log('Image props:', props); 
      const { tnode } = props;
  console.log('Full tnode:', tnode);
  // Log the src to debug the value
  const src = tnode?.domNode?.attribs?.src;

  console.log('Image src:', src);

  if (!src) {
    console.warn('Image src is missing or undefined');
    return null;
  }

  const isBase64 = src.startsWith('data:image/');
  return isBase64 ? (
    <Image
      style={[styles.image, { width: width || 100, height: height || 100 }]}
      source={{ uri: src }}
      {...props}
    />
  ) : (
    <Image
      style={[styles.image, { width: width || 100, height: height || 100 }]}
      source={{ uri: src }}
      {...props}
    />
  );
},

        
      }}
        />
   


</ScrollView>
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={acceptedTerms}
          onValueChange={setAcceptedTerms}
        />
        <Text style={styles.checkboxLabel}>
          I have carefully read and understood all the instructions. I am fully aware of the rules and promise to follow them sincerely throughout the test.
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={handlePrevious} style={styles.buttonSecondary}>
          <Text style={styles.buttonText}>← Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleBeginTest}
          disabled={!acceptedTerms || isSaving}
          style={[styles.buttonPrimary, (!acceptedTerms || isSaving) && styles.disabledButton]}
        >
          <Text style={styles.buttonText}>I am ready to begin →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ExamInstructionsScreen;

