import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { backEndUrl, frontEndUrl,backEndPort } from "../apiConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';

// import { useSession } from '../hooks/SessionContext';

const StudentDashboardBuyCourses = ({ setActiveSection, studentId, preselectedPortalId }) => {
  const [structuredCourses, setStructuredCourses] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedPortal, setSelectedPortal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
//   const { validateSession } = useSession();

  const fetchCoursesInBuyCourses = async () => {
    try {
      setLoading(true);
   const token = await AsyncStorage.getItem('accessToken');

      const res = await fetch(
        `${backEndUrl}/studentbuycourses/UnPurchasedcourses/${studentId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          console.error('Unauthorized access – invalid or expired token');
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setStructuredCourses(data);
      } else {
        console.error('Invalid data format:', data);
        setStructuredCourses([]);
      }
    } catch (err) {
      console.error('Error fetching unpurchased courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) fetchCoursesInBuyCourses();
  }, [studentId]);

  const flatCourses = useMemo(() => {
    const arr = [];
    structuredCourses.forEach((portal) => {
      portal.exams.forEach((exam) => {
        exam.courses.forEach((course) => {
          arr.push({
            ...course,
            course_portal_id: portal.course_portal_id,
            portal_name: portal.portal_name,
            exam_id: exam.exam_id,
            exam_name: exam.exam_name,
          });
        });
      });
    });
    return arr;
  }, [structuredCourses]);

  const portalList = useMemo(
    () => [...new Map(flatCourses.map(c => [c.course_portal_id, c.portal_name])).entries()],
    [flatCourses]
  );

  const examNames = useMemo(() => {
    if (!selectedPortal) return [];
    const exams = flatCourses
      .filter(c => c.course_portal_id === selectedPortal)
      .map(c => c.exam_name);
    return [...new Set(exams)];
  }, [flatCourses, selectedPortal]);

  // initialize portal and exam selection
  useEffect(() => {
    if (portalList.length > 0) {
      setSelectedPortal(prev =>
        portalList.some(([id]) => id === prev) ? prev : portalList[0][0]
      );
    }
  }, [portalList]);

  useEffect(() => {
    if (examNames.length > 0) setSelectedExam(examNames[0]);
    else setSelectedExam('');
  }, [selectedPortal, examNames]);

  useEffect(() => {
    if (preselectedPortalId) setSelectedPortal(preselectedPortalId);
  }, [preselectedPortalId]);

  const filteredCourses = useMemo(
    () =>
      flatCourses.filter(
        c => c.course_portal_id === selectedPortal && c.exam_name === selectedExam
      ),
    [flatCourses, selectedPortal, selectedExam]
  );

  const fullCourses = useMemo(() => {
    const seen = new Set();
    return filteredCourses.filter(course => {
      if (course.course_type_id !== 1) return false;
      if (seen.has(course.course_id)) return false;
      seen.add(course.course_id);
      return true;
    });
  }, [filteredCourses]);

  const subjectWiseGroups = useMemo(() => {
    const grouped = {};
    filteredCourses.forEach(course => {
      if (course.course_type_id === 1) return;
      if (Array.isArray(course.subject_ids) && Array.isArray(course.subject_names)) {
        course.subject_ids.forEach((sid, idx) => {
          const sname = course.subject_names[idx] || 'Other';
          if (!grouped[sid]) grouped[sid] = { subject_name: sname, courses: [] };
          grouped[sid].courses.push(course);
        });
      } else {
        const sid = course.subject_id ?? 'no-subject';
        const sname = course.subject_name ?? 'Other';
        if (!grouped[sid]) grouped[sid] = { subject_name: sname, courses: [] };
        grouped[sid].courses.push(course);
      }
    });
    return Object.values(grouped);
  }, [filteredCourses]);

  const handlePortalSelect = async (portalId) => {
    // if (!(await validateSession())) return;
    setSelectedPortal(portalId);
  };

  const handleExamSelect = async (examName) => {
    // if (!(await validateSession())) return;
    setSelectedExam(examName);
  };

  const studentPaymentCreation = async (courseId, price, isUpgrade) => {
    // if (!(await validateSession())) return;
    try {
      setIsPaymentProcessing(true);
      if (!courseId || !studentId) {
        console.error('Invalid course or student ID.');
        return;
      }

      const resp = await fetch(
        `${backEndUrl}/studentbuycourses/studentpaymentcreation/${studentId}/${courseId}`
      );
      const data = await resp.json();
      const { student, course } = data;

      if (!student || !course) {
        console.error('Invalid student or course data.');
        return;
      }

      const {
        student_registration_id,
        candidate_name,
        email_id,
        mobile_no,
      } = student;
      const {
        course_creation_id,
        course_name,
        course_start_date,
        course_end_date,
      } = course;

      const orderRes = await fetch(`${backEndUrl}/razorpay/razorpay-create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: price * 100,
          currency: 'INR',
          studentId: student_registration_id,
          courseId: course_creation_id,
        }),
      });
      const result = await orderRes.json();
      if (!result.success) {
        Alert.alert('Error', result.error || 'Something went wrong while creating order');
        setIsPaymentProcessing(false);
        await fetchCoursesInBuyCourses();
        return;
      }

      const { orderData, razorpayKey } = result;

      const options = {
        key: razorpayKey,
        amount: orderData.amount.toString(),
        currency: orderData.currency,
        name: 'eGRADTutor',
        description: `Payment for ${course_name}`,
        order_id: orderData.id,
        prefill: { name: candidate_name, email: email_id, contact: mobile_no },
        notes: { address: 'Corporate Office, eGRADTutor (eGATETutor Academy), Hyderabad' },
        theme: { color: '#3399cc' },
      };

      RazorpayCheckout.open(options)
        .then(async (response) => {
          await fetch(`${backEndUrl}/razorpay/paymentsuccess`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              email: email_id,
              name: candidate_name,
              course_name,
              course_start_date,
              course_end_date,
              studentId: student_registration_id,
              courseId: course_creation_id,
              amount: price,
              isUpgrade,
            }),
          });
          setActiveSection('myCourses');
        })
        .catch(async (error) => {
          console.error('Payment failed:', error);
          await fetch(`${backEndUrl}/razorpay/paymentfailure`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: email_id,
              name: candidate_name,
              course_name,
              studentId: student_registration_id,
              courseId: course_creation_id,
            }),
          });
        })
        .finally(() => {
          setIsPaymentProcessing(false);
        });
    } catch (err) {
      console.error('Error during payment flow:', err);
      setIsPaymentProcessing(false);
    }
  };

  if (loading || isPaymentProcessing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3399cc" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Buy Courses</Text>

      {/* Portal Buttons */}
      <ScrollView horizontal style={styles.buttonRow}>
        {portalList.map(([pid, pname]) => (
          <TouchableOpacity
            key={pid}
            style={[
              styles.portalButton,
              selectedPortal === pid && styles.portalButtonActive,
            ]}
            onPress={() => handlePortalSelect(pid)}
          >
            <Text
              style={[
                styles.portalButtonText,
                selectedPortal === pid && styles.portalButtonTextActive,
              ]}
            >
              {pname}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Exam Buttons */}
      <ScrollView horizontal style={styles.buttonRow}>
        {examNames.map((exam, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.examButton,
              selectedExam === exam && styles.examButtonActive,
            ]}
            onPress={() => handleExamSelect(exam)}
          >
            <Text
              style={[
                styles.examButtonText,
                selectedExam === exam && styles.examButtonTextActive,
              ]}
            >
              {exam}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedPortal === 2 && (fullCourses.length > 0 || subjectWiseGroups.length > 0) ? (
        <>
          {/* Full Courses */}
          {fullCourses.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Full Courses</Text>
              <View style={styles.cardsContainer}>
                {fullCourses.map(course => (
                  <CourseCardRN
                    key={course.course_id}
                    course={course}
                    onBuy={price =>
                      studentPaymentCreation(
                        course.course_id,
                        price,
                        course.course_portal_id === 2 &&
                          Number(course.already_paid_amount) > 0
                      )
                    }
                  />
                ))}
              </View>
            </View>
          )}

          {/* Subject-Wise Groups */}
          {subjectWiseGroups.map((group, idx) => (
            <View key={idx} style={styles.section}>
              <Text style={styles.sectionTitle}>{group.subject_name}</Text>
              <View style={styles.cardsContainer}>
                {group.courses.map(course => (
                  <CourseCardRN
                    key={course.course_id}
                    course={course}
                    onBuy={price =>
                      studentPaymentCreation(
                        course.course_id,
                        price,
                        course.course_portal_id === 2 &&
                          Number(course.already_paid_amount) > 0
                      )
                    }
                  />
                ))}
              </View>
            </View>
          ))}
        </>
      ) : filteredCourses.length > 0 ? (
        <View style={styles.cardsContainer}>
          {filteredCourses.map(course => (
            <CourseCardRN
              key={course.course_id}
              course={course}
              onBuy={price =>
                studentPaymentCreation(
                  course.course_id,
                  price,
                  course.course_portal_id === 2 &&
                    Number(course.already_paid_amount) > 0
                )
              }
            />
          ))}
        </View>
      ) : (
        <View style={styles.noCourses}>
          <Text>No courses available at the moment.</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default StudentDashboardBuyCourses;

// CourseCardRN component
const CourseCardRN = ({ course, onBuy }) => {
  const price =
    course.course_portal_id === 1 || course.course_type_id === 3
      ? course.course_total_price
      : course.final_upgrade_price;

  return (
    <View style={styles.card}>
      <Image source={{ uri: course.course_img }} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{course.course_name}</Text>
      <Text>Lectures: {course.lecture_count}</Text>
      <Text>Practice Qs: {course.exercise_questions}</Text>
      <Text style={styles.price}>₹{price}</Text>
      <TouchableOpacity
        style={styles.buyButton}
        onPress={() => onBuy(price)}
      >
        <Text style={styles.buyButtonText}>Buy</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  buttonRow: { flexDirection: 'row', marginBottom: 12 },
  portalButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginRight: 8,
  },
  portalButtonActive: { backgroundColor: '#3399cc' },
  portalButtonText: { color: '#333' },
  portalButtonTextActive: { color: '#fff' },
  examButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    backgroundColor: '#eee',
    marginRight: 6,
  },
  examButtonActive: { backgroundColor: '#3399cc' },
  examButtonText: { color: '#333' },
  examButtonTextActive: { color: '#fff' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  cardsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  cardImage: { width: '100%', height: 100, borderRadius: 4, marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: '500', marginBottom: 4 },
  price: { fontSize: 16, fontWeight: 'bold', marginVertical: 6 },
  buyButton: {
    backgroundColor: '#3399cc',
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  buyButtonText: { color: '#fff', fontWeight: '600' },
  noCourses: { alignItems: 'center', marginTop: 40 },
});
