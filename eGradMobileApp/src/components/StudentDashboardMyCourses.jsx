import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useSession } from '../StudentDashboard/hooks/SessionContext';
 import { backEndUrl, frontEndUrl,backEndPort } from "../apiConfig";
import CourseCards from './CourseCards';
import BundleCourseCard from './BundleCourseCard';
import TestDetailsContainer from './TestDetailsContainer';
import BundleCourseContainer from './BundleCourseContainer';
import Icon from 'react-native-vector-icons/MaterialIcons';
// OR
// import Icon from 'react-native-vector-icons/Feather';

import axios from 'axios';
const StudentDashboardMyCourses = ({ studentId, userData, activeSection }) => {
  const [loading, setLoading] = useState(true);
  const [selectedTestCourse, setSelectedTestCourse] = useState(null);
  const [showQuizContainer, setShowQuizContainer] = useState(true);
  const [showTestContainer, setShowTestContainer] = useState(false);
  const [courseContainer, setCourseContainer] = useState(false);
  const [courseIds, setCourseIds] = useState([]);
  const [portals, setPortals] = useState([]);
  const [selectedPortalId, setSelectedPortalId] = useState(null);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [chapterdetails, setChapterdetails] = useState(null);

//   const { validateSession } = useSession();


useEffect(() => {
  const fetchPurchasedCourses = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const res = await axios.get(`${backEndUrl}/studentmycourses/PurchasedCourses/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      setPortals(data || []);
      if (data.length > 0) {
        const defaultPortal = data[0];
        const defaultExam = defaultPortal.exams[0];
        setSelectedPortalId(defaultPortal.course_portal_id);
        setSelectedExamId(defaultExam?.exam_id || null);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      Alert.alert("Error", "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };
  if (studentId) {
    fetchPurchasedCourses();
  }
}, [studentId]);

  const selectedPortal = useMemo(() => {
    return portals.find(p => p.course_portal_id === selectedPortalId);
  }, [portals, selectedPortalId]);

  const selectedExam = useMemo(() => {
    return selectedPortal?.exams.find(e => e.exam_id === selectedExamId);
  }, [selectedPortal, selectedExamId]);

  const filteredCourses = useMemo(() => {
    return selectedExam?.courses || [];
  }, [selectedExam]);
// console.log(selectedTestCourse ,
        // courseContainer , courseIds.length)
  const handleGoToTest = async (course) => {
    // const isValid = await validateSession();
    // if (!isValid) return;
// console.log(selectedTestCourse ,
        // courseContainer , courseIds.length,course)
        console.log(course);
 setSelectedTestCourse(course);
  setShowQuizContainer(false);
  setShowTestContainer(selectedPortalId === 1);
  setCourseContainer(selectedPortalId === 2);

  try {
    await AsyncStorage.setItem(
      'studentDashboardState',
      JSON.stringify({
        activeSection: 'myCourses',
        selectedTestCourse: course,
        selectedPortalId,
        showQuizContainer: false,
        showTestContainer: selectedPortalId === 1,
        courseContainer: selectedPortalId === 2,
        selectedExamId
      })
    );
  } catch (error) {
    console.error('Failed to save dashboard state:', error);
  }
  };
useEffect(() => {
  const restoreDashboardState = async () => {
    try {
      const savedState = await AsyncStorage.getItem('studentDashboardState');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed.activeSection === 'myCourses') {
          setSelectedTestCourse(parsed.selectedTestCourse || null);
          setShowQuizContainer(parsed.showQuizContainer ?? true);
          setShowTestContainer(parsed.showTestContainer ?? false);
        //   setShowTopicContainer(parsed.showTopicContainer ?? false);
        //   setTopicId(parsed.topicId || '');
          setSelectedPortalId(parsed.selectedPortalId || null);
          setCourseIds(parsed.selectedTestCourse || []); // <- You might want course IDs here, not selectedTestCourse
          setSelectedExamId(parsed.selectedExamId || null);
          setCourseContainer(parsed.courseContainer ?? false);
        //   setOpenCourseOrvl(parsed.openCourseOrvl ?? false);
        }
      }
    } catch (err) {
      console.error('Failed to parse studentDashboardState on restore:', err);
    }
  };

  restoreDashboardState();
}, []);
  const handleBackToCourses = () => {
    setSelectedTestCourse(null);
    setShowQuizContainer(true);
    setShowTestContainer(false);
    setCourseContainer(false);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Breadcrumb Navigation */}
      {(!showQuizContainer || selectedTestCourse) && (
        <View style={styles.breadcrumb}>
          <Text style={styles.breadcrumbText}>My Courses</Text>
          {selectedExam && (
            <>
              <Text>   <Icon name="chevron-right" size={16} color="#000" style={styles.icon} /> </Text>
              <TouchableOpacity onPress={handleBackToCourses}>
                <Text style={styles.link}>{selectedExam.exam_name}</Text>
              </TouchableOpacity>
            </>
          )}
          {selectedTestCourse && (
            <>
              <Text>   <Icon name="chevron-right" size={16} color="#000" style={styles.icon} /> </Text>
              <Text style={styles.link}>{selectedTestCourse.course_name || "MINI / MICRO COURSES"}</Text>
            </>
          )}
        </View>
      )}

      {/* Portal Selector */}
      {showQuizContainer && (
        <>
          <Text style={styles.heading}>My Courses</Text>
          <View style={styles.portalButtons}>
            {portals.map((portal) => (
              <TouchableOpacity
                key={portal.course_portal_id}
                style={[
                  styles.portalButton,
                  selectedPortalId === portal.course_portal_id && styles.activeButton,
                ]}
                onPress={() => {
                  setSelectedPortalId(portal.course_portal_id);
                  setSelectedExamId(portal.exams[0]?.exam_id || null);
                }}
              >
                <Text>{portal.portal_name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Exam Selector */}
          <View style={styles.examButtons}>
            {selectedPortal?.exams.map((exam) => (
              <TouchableOpacity
                key={exam.exam_id}
                style={[
                  styles.examButton,
                  selectedExamId === exam.exam_id && styles.activeButton,
                ]}
                onPress={() => setSelectedExamId(exam.exam_id)}
              >
                <Text>{exam.exam_name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Course Cards */}
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : !filteredCourses.length ? (
            <Text style={styles.noCourses}>No active courses found.</Text>
          ) : selectedPortalId === 2 ? (
            <BundleCourseCard
              exam_id={selectedExam.exam_id}
              exam_name={selectedExam.exam_name}
              studentId={studentId}
              Portal2data={{
                courses: selectedExam.courses,
              }}
              setCourseIds={setCourseIds}
              onGoToCourse={(course) => handleGoToTest(course)}
            />
          ) : (
             filteredCourses.map((course) => (
             <CourseCards
                key={course.course_id}
                title={course.course_name}
                image={course.course_img}
                context="myCourses"
                actionLabel="Go to Test"
                onGoToTest={() => handleGoToTest(course)}
            />
          ))
        )}
      </>
    )}

      {/* Test / Bundle Container */}
      {selectedTestCourse && (
        courseContainer && courseIds.length > 0 ? (
          <BundleCourseContainer
            studentId={studentId}
            userData={userData}
            setChapterdetails={setChapterdetails}
            chapterdetails={chapterdetails}
            selectedPortalId={selectedPortalId}
            selectedExam={selectedExam}
            courseIds={courseIds}
            onBack={handleBackToCourses}
          />
        ) : (
          <TestDetailsContainer
            course={selectedTestCourse}
            studentId={studentId}
            userData={userData}
            selectedPortalId={selectedPortalId}
            onBack={handleBackToCourses}
          />
        )
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
    flex: 1
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap'
  },
  breadcrumbText: {
    fontWeight: 'bold',
    fontSize: 16
  },
  link: {
    color: 'blue',
    marginHorizontal: 5,
  },
  portalButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  portalButton: {
    padding: 10,
    margin: 5,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  examButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  examButton: {
    padding: 8,
    margin: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: '#007bff',
    color: 'white',
  },
  noCourses: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  }
});

export default StudentDashboardMyCourses;
