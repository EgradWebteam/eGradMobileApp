import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

import CourseCards from './CourseCards';
import BundleCourseCard from './BundleCourseCard';
import TestDetailsContainer from './TestDetailsContainer';
import BundleCourseContainer from './BundleCourseContainer';
import PracticeQuestionBank from './PracticeQuestionBank';
import { backEndUrl } from '../apiConfig';
import { styles } from '../styles/StudentDashboardStyles';

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

  // Fetch purchased courses
  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('accessToken');
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
        console.error('Error fetching courses:', err);
        Alert.alert('Error', 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };
    if (studentId) fetchPurchasedCourses();
  }, [studentId]);

  // Restore state
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
            setSelectedPortalId(parsed.selectedPortalId || null);
            setCourseIds(parsed.courseIds || []); // fixed from selectedTestCourse
            setSelectedExamId(parsed.selectedExamId || null);
            setCourseContainer(parsed.courseContainer ?? false);
          }
        }
      } catch (err) {
        console.error('Failed to restore dashboard state:', err);
      }
    };
    restoreDashboardState();
  }, []);

  const selectedPortal = useMemo(() => portals.find(p => p.course_portal_id === selectedPortalId), [portals, selectedPortalId]);
  const selectedExam = useMemo(() => selectedPortal?.exams.find(e => e.exam_id === selectedExamId), [selectedPortal, selectedExamId]);
  const filteredCourses = useMemo(() => selectedExam?.courses || [], [selectedExam]);

  const handleGoToTest = async (course) => {
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
          selectedExamId,
        })
      );
    } catch (error) {
      console.error('Failed to save dashboard state:', error);
    }
  };

  const handleBackToCourses = async () => {
    setSelectedTestCourse(null);
    setShowQuizContainer(true);
    setShowTestContainer(false);
    setCourseContainer(false);
    await AsyncStorage.setItem(
      "studentDashboardState",
      JSON.stringify({
        activeSection: "myCourses",
        selectedTestCourse: null,
        showQuizContainer: true,
        showTestContainer: false,
        selectedExam,
        courseContainer: false,
      })
    );
  };

  return (
    <ScrollView style={styles.containerMyCourses}>
      {/* Breadcrumb */}
      {(!showQuizContainer || selectedTestCourse) && (
        <View style={styles.breadcrumb}>
          <Text style={styles.breadcrumbText}>My Courses</Text>
          {selectedExam && (
            <>
              <Text> <Icon name="chevron-right" size={16} color="#000" /> </Text>
              <TouchableOpacity onPress={async () => {
                  setSelectedTestCourse(null);
                  setChapterdetails(null);
                  setShowTestContainer(false);
                  setShowQuizContainer(true);
                  await AsyncStorage.setItem(
                    "studentDashboardState",
                    JSON.stringify({
                      activeSection: "myCourses",
                      selectedTestCourse: null,
                      showQuizContainer: true,
                      showTestContainer: false,
                      selectedExam,
                      courseContainer: false,
                    })
                  );
                }}>
                <Text style={styles.breadcrumbText}>{selectedExam.exam_name}</Text>
              </TouchableOpacity>
            </>
          )}
          {selectedTestCourse && (
            <>
              <Text> <Icon name="chevron-right" size={16} color="#000" /> </Text>
              <TouchableOpacity onPress={async () => {
                if (!selectedTestCourse.course_name) {
                  setShowTestContainer(false);
                  setCourseContainer(true);
                  setChapterdetails(null);
                  await AsyncStorage.setItem(
                    "studentDashboardState",
                    JSON.stringify({
                      activeSection: "myCourses",
                      // selectedTestCourse: course,
                      selectedPortalId: 2,
                      showQuizContainer: false,
                      showTestContainer: false,
                      courseContainer: true,
                      selectedTestCourse: selectedTestCourse,
                      selectedExam,
                    })
                  );
                }
              }}>
                <Text style={styles.breadcrumbText}>{selectedTestCourse.course_name || 'MINI / MICRO COURSES'}</Text>
              </TouchableOpacity>
              
            </>
          )}
        </View>
      )}

      {/* Portal Selector */}
      {showQuizContainer && (
        <>
          <Text style={styles.heading}>My Courses</Text>
          <ScrollView horizontal style={styles.portalButtons}>
            {portals.map((portal) => (
              <TouchableOpacity
                key={portal.course_portal_id}
                style={[styles.portalButton, selectedPortalId === portal.course_portal_id && styles.activeButton]}
                onPress={() => {
                  setSelectedPortalId(portal.course_portal_id);
                  setSelectedExamId(portal.exams[0]?.exam_id || null);
                }}
              >
                <Text style={[styles.portalButtontext, selectedPortalId === portal.course_portal_id && styles.activeButtontext]}>
                  {portal.portal_name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Exam Selector */}
          <ScrollView horizontal style={styles.examButtons}>
            {selectedPortal?.exams.map((exam) => (
              <TouchableOpacity
                key={exam.exam_id}
                style={[styles.examButton, selectedExamId === exam.exam_id && styles.activeButton]}
                onPress={() => setSelectedExamId(exam.exam_id)}
              >
                <Text style={[styles.examButtontext, selectedExamId === exam.exam_id && styles.activeButtontext]}>
                  {exam.exam_name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

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
              // Portal2data={{ courses: selectedExam.courses }}
               Portal2data={{
                          courses:
                            portals
                              .find((portal) => portal.course_portal_id === 2)
                              ?.exams.find(
                                (exam) => exam.exam_id === selectedExam.exam_id
                              )?.courses || [],
                        }}
              setCourseIds={setCourseIds}
              // onGoToCourse={handleGoToTest}
              onGoToCourse={(course) => handleGoToTest(course)}
            />
          ) : (
            filteredCourses.map((course) => (
              <CourseCards
                key={course.course_id}
                cardImage={course.course_img}
                title={course.course_name}
                context="myCourses"
                actionLabel="Go to Test"
                onGoToTest={() => handleGoToTest(course)}
              />
            ))
          )}
        </>
      )}

      {/* Test / Bundle / PQB Container */}
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
        ) : selectedPortalId === 1 ? (
          <TestDetailsContainer
            course={selectedTestCourse}
            studentId={studentId}
            userData={userData}
            selectedPortalId={selectedPortalId}
            onBack={handleBackToCourses}
          />
        ) : (
          <PracticeQuestionBank
            course={selectedTestCourse}
            studentId={studentId}
            userData={userData}
            selectedPortalId={selectedPortalId}
            selectedExam={selectedExam}
            onBack={handleBackToCourses}
          />
        )
      )}
    </ScrollView>
  );
};

export default StudentDashboardMyCourses;
