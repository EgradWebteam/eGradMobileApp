import React, { useEffect, useMemo, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Pressable, 
  ScrollView, 
  ActivityIndicator, 
  Image, 
  Modal 
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import RazorpayCheckout from "react-native-razorpay";
import { backEndUrl, frontEndUrl,backEndPort } from "../apiConfig";
import { useSession } from "../hooks/SessionContext";
import CourseCards from "./CourseCards";
import { styles } from '../styles/StudentDashboardStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import { styles } from '../styles/StudentDashboardStyles';
const StudentDashboardBuyCourses = ({ setActiveSection, studentId, preselectedPortalId }) => {

  const [structuredCourses, setStructuredCourses] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedPortal, setSelectedPortal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("");
const [selectedYear, setSelectedYear] = useState("");
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const { validateSession } = useSession();

  const [showDualPopup, setShowDualPopup] = useState(false);
  const [pendingPurchase, setPendingPurchase] = useState(null);
  console.log("preselected portal iddddd",preselectedPortalId)
  const fetchCoursesInBuyCourses = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("accessToken");

      const res = await fetch(
        `${backEndUrl}/studentbuycourses/UnPurchasedcourses/${studentId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();
      console.log("dataa purchased courses",data);
      if (Array.isArray(data)) setStructuredCourses(data);
      else setStructuredCourses([]);
    } 
    catch (err) { 
      console.error(err);
    }
    finally { 
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) fetchCoursesInBuyCourses();
  }, [studentId]);

    const flatCourses = useMemo(() => {
    const courses = [];

    structuredCourses.forEach(portal => {
      portal.exams.forEach(exam => {
        exam.departments.forEach(dept => {
          dept.courses.forEach(course => {
            courses.push({
              ...course,
              course_portal_id: portal.course_portal_id,
              portal_name: portal.portal_name,
              exam_id: exam.exam_id,
              exam_name: exam.exam_name,
              exam_has_departments: exam.exam_has_departments,

              exam_has_dual_departments: exam.exam_has_dual_departments,
              exam_primary_departments: exam.primary_departments,
              exam_secondary_departments: exam.secondary_departments,
              student_primary_department: exam.student_primary_department,
              student_secondary_department: exam.student_secondary_department,
              purchased_departments: exam.purchased_departments || [],

              department_id: dept.department_id,
              department_name: dept.department_name
            });
          });
        });
      });
    });
    return courses;
  }, [structuredCourses]);

    const portalList = useMemo(() => {
    return [
      ...new Map(
        flatCourses.map(c => [c.course_portal_id, c.portal_name])
      ).entries()
    ];
  }, [flatCourses]);
  const availableYears = useMemo(() => {
  if (!selectedPortal || !selectedExam) return [];
  
  const years = new Set();
  
  // Filter courses for current portal, exam, AND selected department
  let filteredCourses = flatCourses.filter(
    c => c.course_portal_id === selectedPortal && 
    c.exam_name === selectedExam
  );
  
  // If department is selected, filter by department too
  if (selectedDepartment) {
    filteredCourses = filteredCourses.filter(
      c => c.department_name === selectedDepartment
    );
  }
  
  // Extract years from filtered courses
  filteredCourses.forEach(course => {
    if (course.course_end_date) {
      const endDate = new Date(course.course_end_date);
      const year = endDate.getFullYear();
      if (!isNaN(year)) {
        years.add(year.toString());
      }
    }
  });
  
  return Array.from(years).sort((a, b) => a - b); // Sort descending (newest first)
}, [flatCourses, selectedPortal, selectedExam, selectedDepartment]);
  const examNames = useMemo(() => {
    if (!selectedPortal) return [];

    const exams = flatCourses
      .filter(c => c.course_portal_id === selectedPortal)
      .map(c => c.exam_name);

    return [...new Set(exams)];
  }, [flatCourses, selectedPortal]);
  const departments = useMemo(() => {
    if (!selectedPortal || !selectedExam) return [];

    const portal = structuredCourses.find(
      p => p.course_portal_id === selectedPortal
    );
    if (!portal) return [];

    const exam = portal.exams.find(e => e.exam_name === selectedExam);
    if (!exam || !exam.exam_has_departments) return [];

    return exam.departments || [];
  }, [structuredCourses, selectedPortal, selectedExam]);

  useEffect(() => {
    if (portalList.length > 0) {
      setSelectedPortal((prevPortal) =>
        portalList.some(([id]) => id === prevPortal)
          ? prevPortal
          : portalList[0][0]
      );
    }
  }, [portalList]);


  useEffect(() => {
    if (examNames.length > 0) {
      setSelectedExam(examNames[0]);
    }
  }, [selectedPortal, examNames]);

  useEffect(() => {
    if (departments.length > 0) {
      setSelectedDepartment(departments[0].department_name);
    }
  }, [selectedExam, departments]);
useEffect(() => {
  if (availableYears.length > 0) {
    // Check if current selectedYear exists in availableYears
    // if (!availableYears.includes(selectedYear)) {
      // Auto-select the latest year (first in sorted array)
      setSelectedYear(availableYears[0]);
  //   }
  } else {
    // No years available for current selection
    setSelectedYear("");
  }
}, [availableYears]);
  useEffect(() => {
    if (preselectedPortalId) setSelectedPortal(preselectedPortalId);
  }, [preselectedPortalId]);
  const filteredCourses = useMemo(() => {
    return flatCourses.filter(
      c =>
        c.course_portal_id === selectedPortal &&
        c.exam_name === selectedExam &&
        (departments.length === 0 ||
          c.department_name === selectedDepartment)
    );
  }, [flatCourses, selectedPortal, selectedExam, selectedDepartment]);
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

      const subjectIds = course.subject_ids || [course.subject_id];
      const subjectNames = course.subject_names || [course.subject_name];

      subjectIds.forEach((id, idx) => {
        const name = subjectNames[idx] || "Other";

        if (!grouped[id]) grouped[id] = { subject_name: name, courses: [] };
        grouped[id].courses.push(course);
      });
    });

    return Object.values(grouped);
  }, [filteredCourses]);
  const handlePortalSelect = async (portalId) => {
    const valid = await validateSession();
    if (!valid) return;
    setSelectedPortal(portalId);
  };

  const handleExamSelect = async (examName) => {
    const valid = await validateSession();
    if (!valid) return;
    setSelectedExam(examName);
  };


const checkDualPaperBeforeBuy = (course) => {
  const examHasDual =
    course.exam_has_dual_departments === true ||
    Number(course.exam_has_dual_departments) === 1;

  if (!examHasDual) return directPayment(course);

  const purchased = Array.isArray(course.purchased_departments)
    ? course.purchased_departments
    : [];
console.log("purchased depts",purchased);
  const count = purchased.length;
  console.log("count",count)
  const dept = Number(course.department_id);

  // 1️⃣ If already purchased SAME dept → NO popup
  if (purchased.includes(dept)) {
    return directPayment(course);
  }

  // 2️⃣ First department not selected yet → FIRST POPUP
  if (count === 0) {
    setPendingPurchase(course);
    setShowDualPopup(true);
    return;
  }

  // 3️⃣ One department purchased → SECOND POPUP ONLY IF different dept
  if (count === 1) {
    const firstDept = purchased[0];

    if (dept !== firstDept) {
      setPendingPurchase(course);
      setShowDualPopup(true);
      return;
    }

    // If same as first → NO popup
    return directPayment(course);
  }

  // 4️⃣ Already bought 2 departments → NO popup
  if (count >= 2) {
    return directPayment(course);
  }
};
const handleYearSelect = async (year) => {
  const isValid = await validateSession();
  if (!isValid) return;
  
  // If same year is clicked, keep it selected (don't toggle)
  setSelectedYear(year);
};

const directPayment = (course) => {
  const isUpgrade =
    course.course_portal_id === 2 &&
    course.course_type_id !== 3 &&
    Number(course.already_paid_amount) > 0;

  const price =
    course.course_portal_id === 1 || course.course_type_id === 3
      ? course.course_total_price
      : course.final_upgrade_price;

  studentpaymentcreation(course.course_id, studentId, price, isUpgrade);
};


const proceedToPaymentWithRefresh = async (course) => {
  const isUpgrade =
    course.course_portal_id === 2 &&
    course.course_type_id !== 3 &&
    Number(course.already_paid_amount) > 0;

  const price =
    course.course_portal_id === 1 || course.course_type_id === 3
      ? course.course_total_price
      : course.final_upgrade_price;

  await studentpaymentcreation(course.course_id, studentId, price, isUpgrade);

  // refresh new primary/secondary from backend
  await fetchCoursesInBuyCourses();
setShowDualPopup(false);
  setPendingPurchase(null);
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
        // Alert.alert(`Payment Success,${course_name} Course added to your My Courses`);

        setActiveSection("myCourses");
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
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>

      {/* Heading */}
      <Text style={styles.heading}>Buy Courses</Text>

      {/* Portal Buttons */}
<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{ paddingHorizontal: 10 }}
>
  {portalList.map(([portalId, portalName]) => (
    <Pressable
      key={portalId}
      style={[
        styles.portalBtn,
        selectedPortal === portalId && styles.portalActive
      ]}
      onPress={() => handlePortalSelect(portalId)}
    >
      <Text
        style={[
          styles.portalText,
          selectedPortal === portalId && styles.portalTextActive
        ]}
      >
        {portalName}
      </Text>
    </Pressable>
  ))}
</ScrollView>




      {/* Exam Buttons */}
<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{ paddingHorizontal: 10 }}
>
  {examNames.map((examName) => (
    <Pressable
      key={examName}
      style={[
        styles.examBtn,
        selectedExam === examName && styles.examActive
      ]}
      onPress={() => handleExamSelect(examName)}
    >
      <Text
        style={[
          styles.examText,
          selectedExam === examName && styles.examTextActive
        ]}
      >
        {examName}
      </Text>
    </Pressable>
  ))}
</ScrollView>



      {/* Departments */}
    {departments.length > 0 && (
 <View style={styles.pickerContainer}>
    <Picker
      selectedValue={selectedDepartment}
      onValueChange={(value) => setSelectedDepartment(value)}
    >
    

      {departments.map((dept) => (
        <Picker.Item
          key={dept.department_id}
          label={dept.department_name}
          value={dept.department_name}
        />
      ))}
    </Picker>
  </View>
)}
{availableYears.length > 0 && (
  <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{ paddingHorizontal: 10 }}
>
          {availableYears.map((year, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.deptBtn,
                selectedYear === year && styles.deptActive
              ]}
              onPress={() => handleYearSelect(year)}
            >
              <Text     style={[
                styles.deptText,
                selectedYear === year && styles.deptTextActive
              ]}>{year}</Text>
            </TouchableOpacity>
          ))}
</ScrollView>
      )}
   {/* PORTAL 2 – FULL + SUBJECT-WISE VIEW */}
{selectedPortal === 2 && (fullCourses.length > 0 || subjectWiseGroups.length > 0) ? (
  <>
    {/* FULL COURSES */}
    {fullCourses.length > 0 && (
      <View>
        <Text style={styles.sectionTitle}>Full Courses</Text>
        {fullCourses.map(course => (
          <CourseCards
          key={course.course_id}
                    title={course.course_name}
                    cardImage={course.course_img}
                    // numOfTests={course.test_count}
                    portalId={course.course_portal_id}
                    chapterWiseTestCount={course.chapter_wise_test_count}
                    topicWiseTestCount={course.topic_wise_test_count}
                    subjectWiseTestCount={course.subject_wise_test_count}
                    partTestCount={course.part_test_count}
                    fullTestCount={course.full_test_count}
                    VideoLectures={course.lecture_count}
                    totalPracticeQuestions={course.exercise_questions}
                    studyMaterialCount={course.study_materials}
                    testCount={course.test_count}
                    courseInstructor={course.course_instructor}
                    price={
                      course.course_portal_id === 1 ||
                        course.course_type_id === 3
                        ? course.course_total_price
                        : course.final_upgrade_price
                    }
                    isUpgrade={
                      course.course_portal_id === 2 &&
                      course.course_type_id !== 3 &&
                      Number(course.already_paid_amount) > 0
                    }
                    context="buyCourses"
            onBuy={() => checkDualPaperBeforeBuy(course)}
          />
        ))}
      </View>
    )}

    {/* SUBJECT WISE COURSES */}
    {subjectWiseGroups.map((group, idx) => (
      <View key={idx}>
        <Text style={styles.sectionTitle}>{group.subject_name}</Text>
        {group.courses.map(course => (
          <CourseCards
              key={course.course_id}
                    title={course.course_name}
                    cardImage={course.course_img}
                    portalId={course.course_portal_id}
                    // numOfTests={course.test_count}
                    VideoLectures={course.lecture_count}
                    chapterWiseTestCount={course.chapter_wise_test_count}
                    topicWiseTestCount={course.topic_wise_test_count}
                    subjectWiseTestCount={course.subject_wise_test_count}
                    partTestCount={course.part_test_count}
                    fullTestCount={course.full_test_count}
                    courseInstructor={course.course_instructor}
                    totalPracticeQuestions={course.exercise_questions}
                    studyMaterialCount={course.study_materials}
                    testCount={course.test_count}
                    price={
                      course.course_portal_id === 1 ||
                        course.course_type_id === 3
                        ? course.course_total_price
                        : course.final_upgrade_price
                    }
                    isUpgrade={
                      course.course_portal_id === 2 &&
                      course.course_type_id !== 3 &&
                      Number(course.already_paid_amount) > 0
                    }
                    context="buyCourses"
            onBuy={() => checkDualPaperBeforeBuy(course)}
          />
        ))}
      </View>
    ))}
  </>
) : filteredCourses.length > 0 ? (
  <>
    {/* SIMPLE COURSE LIST FOR PORTAL 1 & 3 */}
    <View>
      {filteredCourses.map(course => (
        <CourseCards
         key={course.course_id}
                title={course.course_name}
                cardImage={course.course_img}
                portalId={course.course_portal_id}
                courseInstructor={course.course_instructor}
                numOfTests={course.test_count}
                chapterWiseTestCount={course.chapter_wise_test_count}
                topicWiseTestCount={course.topic_wise_test_count}
                subjectWiseTestCount={course.subject_wise_test_count}
                partTestCount={course.part_test_count}
                fullTestCount={course.full_test_count}
                studyMaterialCount={course.study_materials}
                testCount={course.test_count}
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
          onBuy={() => checkDualPaperBeforeBuy(course)}
        />
      ))}
    </View>
  </>
) : (
  <Text style={{ textAlign: "center", marginTop: 20 }}>
    No courses available at this moment.
  </Text>
)}


      {/* Dual Department Popup */}
      <Modal visible={showDualPopup} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.popupBox}>
        {!pendingPurchase?.student_primary_department ? (
  <>
    <Text style={styles.popupTitle}>Choose your department carefully.</Text>

    <Text style={styles.popupPara}>
      If you plan to take a dual-paper in{" "}
      <Text style={styles.boldText}>{pendingPurchase?.exam_name}</Text>, 
      make sure your first selection is correct.
    </Text>

    <Text style={styles.popupPara}>
      By buying this course, your{" "}
      <Text style={styles.boldText}>PRIMARY</Text> department will be:{" "}
      <Text style={styles.boldText}>{pendingPurchase?.department_name}</Text>
    </Text>

    <View style={styles.popupBtnRow}>
      <Pressable
        style={styles.okBlueBtn}
        onPress={() => proceedToPaymentWithRefresh(pendingPurchase)}
      >
        <Text style={styles.okBlueText}>OK</Text>
      </Pressable>

      <Pressable
        style={styles.cancelRedBtn}
        onPress={() => setShowDualPopup(false)}
      >
        <Text style={styles.cancelRedText}>Cancel</Text>
      </Pressable>
    </View>
  </>
) : (
  <>
    <Text style={styles.popupTitle}>You are now selecting your second paper.</Text>

    <Text style={styles.popupPara}>
      As per <Text style={styles.boldText}>{pendingPurchase?.exam_name}</Text> guidelines, 
      you can choose only two departments. This is your final allowed selection.
    </Text>

    <Text style={styles.popupPara}>
      Your <Text style={styles.boldText}>SECONDARY</Text> department will be:{" "}
      <Text style={styles.boldText}>{pendingPurchase?.department_name}</Text>
    </Text>

    <View style={styles.popupBtnRow}>
      <Pressable
        style={styles.okBlueBtn}
        onPress={() => proceedToPaymentWithRefresh(pendingPurchase)}
      >
        <Text style={styles.okBlueText}>OK</Text>
      </Pressable>

      <Pressable
        style={styles.cancelRedBtn}
        onPress={() => setShowDualPopup(false)}
      >
        <Text style={styles.cancelRedText}>Cancel</Text>
      </Pressable>
    </View>
  </>
)}

          </View>
        </View>
      </Modal>

    </ScrollView>
  );
};

export default StudentDashboardBuyCourses;


