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
import { Picker } from "@react-native-picker/picker";
import CourseCards from './CourseCards';
import BundleCourseCard from './BundleCourseCard';
import TestDetailsContainer from './TestDetailsContainer';
import BundleCourseContainer from './BundleCourseContainer';
import PracticeQuestionBank from './PracticeQuestionBank';
import { backEndUrl } from '../apiConfig';
import { styles } from '../styles/StudentDashboardStyles';
import { useSession } from '../hooks/SessionContext';
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
  const [selectedDepartment, setSelectedDepartment] = useState("");
const {validateSession} = useSession()
  // Fetch purchased courses
  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const res = await axios.get(`${backEndUrl}/studentmycourses/PurchasedCourses/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("PurchasedCourses API response:", res.data);
        const data = res.data;
        setPortals(data || []);
        
        if (Array.isArray(data) && data.length > 0) {
          const defaultPortal = data[0] || null;
          const defaultExam = defaultPortal?.exams?.[0] || null;

          const savedState = await AsyncStorage.getItem('studentDashboardState');
          let parsed = {};
          try {
            parsed = savedState ? JSON.parse(savedState) : {};
          } catch (e) {
            console.warn("Invalid saved state:", savedState);
          }

          const newSelectedPortalId = parsed.selectedPortalId ?? defaultPortal?.course_portal_id ?? null;
          const newSelectedExamId = parsed.selectedExamId ?? defaultExam?.exam_id ?? null;

          setSelectedPortalId(newSelectedPortalId);
          setSelectedExamId(newSelectedExamId);

          // Set initial department based on selected exam
          if (newSelectedPortalId && newSelectedExamId) {
            const portal = data.find(p => p.course_portal_id === newSelectedPortalId);
            const exam = portal?.exams?.find(e => e.exam_id === newSelectedExamId);
            
            if (exam?.departments?.length > 0) {
              setSelectedDepartment(exam.departments[0].department_name);
            } else {
              setSelectedDepartment("");
            }
          }
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

  // Memoized values
  const selectedPortal = useMemo(() => 
    portals.find(p => p.course_portal_id === selectedPortalId), 
    [portals, selectedPortalId]
  );

  const selectedExam = useMemo(() => 
    selectedPortal?.exams?.find(e => e.exam_id === selectedExamId), 
    [selectedPortal, selectedExamId]
  );

  const examHasDepartments = useMemo(() => {
    return !!selectedExam && Array.isArray(selectedExam.departments) && selectedExam.departments.length > 0;
  }, [selectedExam]);

   const examDepartments = useMemo(() => {
    if (!examHasDepartments) return [];
    return selectedExam.departments;
  }, [selectedExam, examHasDepartments]);

  const departmentWiseCourses = useMemo(() => {
    if (!examHasDepartments) return [];
    const result = [];
    selectedExam.departments.forEach(dept => {
      (dept.courses || []).forEach(course => {
        result.push({
          ...course,
          department_id: dept.department_id,
          department_name: dept.department_name
        });
      });
    });
    return result;
  }, [selectedExam, examHasDepartments]);

  const filteredCourses = useMemo(() => {
    if (!selectedExam) return [];

    // Case: exam doesn't have departments → return its direct courses array
    if (!examHasDepartments) {
      return selectedExam.courses || [];
    }

    // Case: exam has departments
    if (selectedDepartment) {
      return departmentWiseCourses.filter(c => c.department_name === selectedDepartment);
    }

    // no department filter selected → return all courses from departments
    return departmentWiseCourses;
  }, [selectedExam, examHasDepartments, selectedDepartment, departmentWiseCourses]);

  // Restore state
  useEffect(() => {
    const restoreDashboardState = async () => {
      try {
        const savedState = await AsyncStorage.getItem('studentDashboardState');
        if (savedState) {
          const parsed = JSON.parse(savedState);
          if (parsed.activeSection === 'myCourses') {
            console.log(parsed.courseIds,"hgh");
            setSelectedTestCourse(parsed.selectedTestCourse || null);
            setShowQuizContainer(parsed.showQuizContainer ?? true);
            setShowTestContainer(parsed.showTestContainer ?? false);
            setSelectedPortalId(parsed.selectedPortalId || null);
            setCourseIds(parsed.selectedTestCourse || []); // Fixed: use courseIds instead of selectedTestCourse
            setSelectedExamId(parsed.selectedExamId || null);
            setCourseContainer(parsed.courseContainer ?? false);
            setSelectedDepartment(parsed.selectedDepartment || "");
          }
        }
      } catch (err) {
        console.error('Failed to restore dashboard state:', err);
      }
    };
    restoreDashboardState();
  }, []);

  // Update department when exam changes
  useEffect(() => {
    if (selectedExam && examHasDepartments && examDepartments.length > 0) {
      setSelectedDepartment(prev => {
        // if prev already exists in current dept list, keep it
        if (prev && examDepartments.some(d => d.department_name === prev)) return prev;
        return examDepartments[0].department_name;
      });
    } else {
      setSelectedDepartment("");
    }
  }, [selectedExam, examHasDepartments, examDepartments]);

  const handleGoToTest = async (course) => {
      const isValid = await validateSession();
    if (!isValid) return;
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
          selectedDepartment, // Save department state
          courseIds // Save courseIds
        })
      );
    } catch (error) {
      console.error('Failed to save dashboard state:', error);
    }
  };

  const handleBackToCourses = async () => {
      const isValid = await validateSession();
    if (!isValid) return;
    setSelectedTestCourse(null);
    setShowQuizContainer(true);
    setShowTestContainer(false);
    setCourseContainer(false);
    try {
      await AsyncStorage.setItem(
        "studentDashboardState",
        JSON.stringify({
          activeSection: "myCourses",
          selectedTestCourse: null,
          showQuizContainer: true,
          showTestContainer: false,
          selectedExamId,
          courseContainer: false,
          selectedDepartment, // Save department state
          courseIds // Save courseIds
        })
      );
    } catch (error) {
      console.error('Failed to save dashboard state:', error);
    }
  };

  const handlePortalChange = async (portalId) => {
      const isValid = await validateSession();
    if (!isValid) return;
    setSelectedPortalId(portalId);
    
    const portal = portals.find(p => p.course_portal_id === portalId);
    const firstExam = portal?.exams?.[0];
    const newExamId = firstExam?.exam_id || null;
    
    setSelectedExamId(newExamId);
    
    // Reset department when portal changes
    if (firstExam?.departments?.length > 0) {
      setSelectedDepartment(firstExam.departments[0].department_name);
    } else {
      setSelectedDepartment("");
    }
  };

  const handleExamChange = async (examId) => {
      const isValid = await validateSession();
    if (!isValid) return;
    setSelectedExamId(examId);
    
    const exam = selectedPortal?.exams?.find(e => e.exam_id === examId);
    
    // Reset department when exam changes
    if (exam?.departments?.length > 0) {
      setSelectedDepartment(exam.departments[0].department_name);
    } else {
      setSelectedDepartment("");
    }
  };

  return (
    <ScrollView style={styles.containerMyCourses}>

      {/* Breadcrumb */}
      {(!showQuizContainer || selectedTestCourse) && (
        <View style={styles.breadcrumb}>
          <Text style={styles.breadcrumbText}>My Courses</Text>

          {selectedExam && (
            <>
              <Icon name="chevron-right" size={16} color="#000" />
              <TouchableOpacity
                onPress={async () => {
                    const isValid = await validateSession();
    if (!isValid) return;
                  setSelectedTestCourse(null);
                  setChapterdetails(null);
                  setShowTestContainer(false);
                  setShowQuizContainer(true);

                  try {
                    await AsyncStorage.setItem(
                      "studentDashboardState",
                      JSON.stringify({
                        activeSection: "myCourses",
                        selectedTestCourse: null,
                        showQuizContainer: true,
                        showTestContainer: false,
                        selectedExamId: selectedExamId,
                        courseContainer: false,
                        selectedDepartment,
                        courseIds
                      })
                    );
                  } catch (error) {
                    console.error('Failed to save dashboard state:', error);
                  }
                }}
              >
                <Text style={styles.breadcrumbText}>{selectedExam.exam_name}</Text>
              </TouchableOpacity>
            </>
          )}

          {selectedTestCourse && (
            <>
              <Icon name="chevron-right" size={16} color="#000" />
              <TouchableOpacity
                onPress={async () => {
                    const isValid = await validateSession();
    if (!isValid) return;
                  if (!selectedTestCourse.course_name) {
                    setShowTestContainer(false);
                    setCourseContainer(true);
                    setChapterdetails(null);

                    try {
                      await AsyncStorage.setItem(
                        "studentDashboardState",
                        JSON.stringify({
                          activeSection: "myCourses",
                          selectedPortalId: 2,
                          showQuizContainer: false,
                          showTestContainer: false,
                          courseContainer: true,
                          selectedTestCourse,
                          selectedExamId,
                          selectedDepartment,
                          courseIds
                        })
                      );
                    } catch (error) {
                      console.error('Failed to save dashboard state:', error);
                    }
                  }
                }}
              >
                <Text style={styles.breadcrumbText}>
                             {selectedTestCourse.course_name ?? "ONLINE VIDEO COURSES"} {
      filteredCourses.find(c => c.course_id === courseIds[0])?.course_end_date?.slice(0, 4) || ""
    }
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      {/* -------------------------------------------- */}
      {/*         SHOW QUIZ (MAIN MY COURSES)           */}
      {/* -------------------------------------------- */}
      {showQuizContainer && (
        <>
          <Text style={styles.heading}>My Courses</Text>

          {/* =================== PORTAL SELECTOR =================== */}
          <ScrollView horizontal style={styles.portalButtons}>
            {portals.map((portal) => (
              <TouchableOpacity
                key={portal.course_portal_id}
                style={[
                  styles.portalBtn,
                  selectedPortalId === portal.course_portal_id && styles.portalActive,
                ]}
                onPress={() => handlePortalChange(portal.course_portal_id)}
              >
                <Text
                  style={[
                    styles.portalText,
                    selectedPortalId === portal.course_portal_id &&
                      styles.portalTextActive,
                  ]}
                >
                  {portal.portal_name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* =================== EXAM SELECTOR =================== */}
          {selectedPortal?.exams?.length > 0 && (
            <ScrollView horizontal style={styles.examButtons}>
              {selectedPortal.exams.map((exam) => (
                <TouchableOpacity
                  key={exam.exam_id}
                  style={[
                    styles.examBtn,
                    selectedExamId === exam.exam_id && styles.examActive,
                  ]}
                  onPress={() => handleExamChange(exam.exam_id)}
                >
                  <Text
                    style={[
                      styles.examText,
                      selectedExamId === exam.exam_id && styles.examTextActive,
                    ]}
                  >
                    {exam.exam_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* =================== DEPARTMENT SELECTOR (IF EXISTS) =================== */}
              {examHasDepartments &&  selectedExam.usingTable === true && (
 <View style={styles.pickerContainer}>
    <Picker
      selectedValue={selectedDepartment}
      onValueChange={(value) => setSelectedDepartment(value)}
    >
     

      {examDepartments.map((dept) => (
        <Picker.Item
          key={dept.department_id}
          label={dept.department_name}
          value={dept.department_name}
        />
      ))}
    </Picker>
  </View>
)}
          {/* =================== COURSE CARDS =================== */}
     {loading ? (
  <ActivityIndicator size="large" color="#0000ff" />
) : !filteredCourses.length ? (
  <View style={styles.noCoursesContainer}>
    <Text style={styles.noCourses}>No courses found for selected criteria.</Text>
    <Text style={styles.noCoursesSubtitle}>
      {selectedDepartment ? `Department: ${selectedDepartment}` : ''}
      {selectedExam ? ` | Exam: ${selectedExam.exam_name}` : ''}
    </Text>
  </View>
) : selectedPortalId === 2 ? (
  /* ---------------------- PORTAL 2 (ORVL) YEAR-BASED BUNDLES ---------------------- */
  <View style={styles.cardHolder}>
    {selectedExam && (
      <>
        {Object.entries(
          filteredCourses.reduce((acc, course) => {
            // Extract year from course_name OR course_end_date
            const yearMatch =
              course.course_name?.match(/(\d{4})/) ||
              course.course_end_date?.match(/^(\d{4})/);

            const year = yearMatch ? yearMatch[1] : "No Year";

            if (!acc[year]) acc[year] = [];

            acc[year].push({
              ...course,
              department_id:
                selectedDepartment === "No Department"
                  ? "common"
                  : course.department_id,
            });

            return acc;
          }, {})
        ).map(([year, courses]) => (
          <BundleCourseCard
            key={`${selectedExam.exam_id}-${year}`}
            exam_id={selectedExam.exam_id}
            exam_name={`${selectedExam.exam_name} ${year}`}
            year={year}
            Portal2data={{
              courses: courses,
              year: year,
            }}
            setCourseIds={setCourseIds}
            onGoToCourse={(courseArray) => handleGoToTest(courseArray)}
          />
        ))}
      </>
    )}
  </View>
) : (
  /* ---------------------- NORMAL PORTAL COURSE CARDS ---------------------- */
  <View style={styles.cardHolder}>
    {filteredCourses.map((course) => (
      <CourseCards
        key={course.course_id}
        cardImage={course.course_img}
        title={course.course_name}
        context="myCourses"
        actionLabel="Go to Test"
        onGoToTest={() => handleGoToTest(course)}
      />
    ))}
  </View>
)}

        </>
      )}
      {/* =================== COURSE DETAIL / PQB / BUNDLE =================== */}
      {selectedTestCourse &&
        (courseContainer && selectedPortalId === 2 ? (
          <BundleCourseContainer
            studentId={studentId}
            userData={userData}
            setChapterdetails={setChapterdetails}
            chapterdetails={chapterdetails}
            selectedPortalId={selectedPortalId}
            selectedExam={selectedExam}
            selectedExamId={selectedExamId}
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
            onBack={handleBackToCourses}
            studentId={studentId}
            userData={userData}
            selectedPortalId={selectedPortalId}
            course_name={selectedTestCourse.course_name}
            selectedExam={selectedExam}
          />
        ))}
    </ScrollView>
  );
};

export default StudentDashboardMyCourses;