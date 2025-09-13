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
import CourseCards from "./CourseCards";
// import { useSession } from '../hooks/SessionContext';
import { styles } from '../styles/StudentDashboardStyles';
const StudentDashboardBuyCourses = ({ setActiveSection, studentId, preselectedPortalId }) => {
  const [structuredCourses, setStructuredCourses] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedPortal, setSelectedPortal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
//   const { validateSession } = useSession();
    console.log(`${backEndUrl}/studentbuycourses/UnPurchasedcourses/${studentId}`);
  const fetchCoursesInBuyCourses = async () => {
      console.log(`${backEndUrl}/studentbuycourses/UnPurchasedcourses/${studentId}`);
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
      console.log(res,`${backEndUrl}/studentbuycourses/UnPurchasedcourses/${studentId}`);
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


const studentpaymentcreation = async (courseId, studentId, price, isUpgrade) => {
  if (!courseId || !studentId) {
    console.error("❌ Invalid course ID or student ID.");
    return;
  }

  try {
    setIsPaymentProcessing(true);

    // 1️⃣ Fetch student & course info
    const res = await fetch(`${backEndUrl}/studentbuycourses/studentpaymentcreation/${studentId}/${courseId}`);
    if (!res.ok) throw new Error(`Failed to fetch course/student info: ${res.status}`);
    const data = await res.json();

    const { student, course } = data;
    if (!student || !course) {
      console.error("❌ Invalid student or course data:", data);
      setIsPaymentProcessing(false);
      return;
    }

    const { student_registration_id, candidate_name, email_id, mobile_no } = student;
    const { course_creation_id, course_name, course_start_date, course_end_date } = course;

    // 2️⃣ Create Razorpay order on backend
    const orderRes = await fetch(`${backEndUrl}/razorpay/razorpay-create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: price * 100, // Razorpay expects paise
        currency: "INR",
        studentId: student_registration_id,
        courseId: course_creation_id,
      }),
    });

    if (!orderRes.ok) throw new Error(`Failed to create Razorpay order: ${orderRes.status}`);
    const orderResult = await orderRes.json();
console.log("order",orderResult)
    if ( !orderResult.orderData || !orderResult.razorpayKey) {
      console.error("❌ Razorpay order creation failed:", orderResult);
      Alert.alert("Order creation failed", orderResult.error || "Please try again.");
      setIsPaymentProcessing(false);
      return;
    }

    const { orderData, razorpayKey } = orderResult;
console.log( orderData, razorpayKey)
    // 3️⃣ Setup Razorpay options
    const options = {
      key: razorpayKey,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "eGRADTutor",
      description: `Payment for ${course_name}`,
      order_id: orderData.id,
      prefill: {
        name: candidate_name,
        email: email_id,
        contact: mobile_no,
      },
      notes: {
        address: "Corporate Office, eGRADTutor, Hyderabad",
      },
      theme: { color: "#3399cc" },
    };

    console.log("Razorpay options:", options);

    // 4️⃣ Open Razorpay checkout
    RazorpayCheckout.open(options)
      .then(async (response) => {
        console.log("✅ Payment success response:", response);
        // Notify backend of successful payment
        await fetch(`${backEndUrl}/razorpay/paymentsuccess`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
        Alert.alert(`Payment Success,${course_name} Course added to your My Courses`);

        // setActiveSection("myCourses");
      })
      .catch(async (error) => {
        console.error("❌ Razorpay payment failed:", error);
        Alert.alert("Payment failed", "Please try again.");

        // Notify backend of payment failure
        await fetch(`${backEndUrl}/razorpay/paymentfailure`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
    console.error("❌ Error in payment creation flow:", err);
    Alert.alert("Error", "Something went wrong. Please try again.");
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
  <ScrollView style={styles.containerBuyCourses}>
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
              {fullCourses.map((course) => (
                <CourseCards
                   key={course.course_id}
                      title={course.course_name}
                      cardImage={course.course_img}
                      // numOfTests={course.test_count}
                      portalId={course.course_portal_id}
                      VideoLectures={course.lecture_count}
                      totalPracticeQuestions={course.exercise_questions}
                      price={
                        course.course_portal_id === 1 || course.course_type_id === 3
                          ? course.course_total_price
                          : course.final_upgrade_price
                      }
                      isUpgrade={
                        course.course_portal_id === 2 &&
                        course.course_type_id !== 3 &&
                        Number(course.already_paid_amount) > 0
                      }
                      context="buyCourses"
                      onBuy={(price) => {
                        studentpaymentcreation(
                          course.course_id,
                          studentId,
                          price,
                          course.course_portal_id === 2 &&
                          Number(course.already_paid_amount) > 0
                        );
                      }}
                      //  numOfQuestions={course.total_question_count}
                      //  subjects={course.subject_names?.join(", ")} 

                      originalPrice={course.course_price}
                      courseTypeId={course.course_type_id}
                />
              ))}
            </View>
          </View>
        )}

        {/* Subject-wise Courses */}
        {subjectWiseGroups.map((group, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={styles.sectionTitle}>{group.subject_name}</Text>
            <View style={styles.cardsContainer}>
              {group.courses.map((course) => (
                <CourseCards
                      key={course.course_id}
                      title={course.course_name}
                      cardImage={course.course_img}
                      portalId={course.course_portal_id}
                      // numOfTests={course.test_count}
                      VideoLectures={course.lecture_count}
                      totalPracticeQuestions={course.exercise_questions}
                      price={
                        course.course_portal_id === 1 || course.course_type_id === 3
                          ? course.course_total_price
                          : course.final_upgrade_price
                      }
                      isUpgrade={
                        course.course_portal_id === 2 &&
                        course.course_type_id !== 3 &&
                        Number(course.already_paid_amount) > 0
                      }
                      context="buyCourses"
                      onBuy={(price) => {
                        studentpaymentcreation(
                          course.course_id,
                          studentId,
                          price,
                          course.course_portal_id === 2 &&
                          Number(course.already_paid_amount) > 0
                        );
                      }}
                      // numOfQuestions={course.total_question_count}
                      // subjects={course.subject_names?.join(", ")} 
                      originalPrice={course.course_price}
                      courseTypeId={course.course_type_id}
                />
              ))}
            </View>
          </View>
        ))}
      </>
    ) : filteredCourses.length > 0 ? (
      <View style={styles.cardsContainer}>
        {filteredCourses.map((course) => (
          <CourseCards
               key={course.course_id}
                    title={course.course_name}
                    cardImage={course.course_img}
                    portalId={course.course_portal_id}

                    numOfTests={course.test_count}
                    price={
                      course.course_portal_id === 1 || course.course_type_id === 3
                        ? course.course_total_price
                        : course.final_upgrade_price
                    }
                    isUpgrade={
                      course.course_portal_id === 2 &&
                      course.course_type_id !== 3 &&
                      Number(course.already_paid_amount) > 0
                    }
                    context="buyCourses"
                    onBuy={(price) => {
                      const courseId = course.course_id;
                      if (!courseId) {
                        console.error("Course ID is missing:", course);
                        return;
                      }
                      studentpaymentcreation(
                        courseId,
                        studentId,
                        price,
                        course.course_portal_id === 2 &&
                        Number(course.already_paid_amount) > 0
                      );
                    }}
                    //  numOfQuestions={course.total_question_count}
                    //  subjects={course.subject_names?.join(", ")} 
                    originalPrice={course.course_price}
                    courseTypeId={course.course_type_id}
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


