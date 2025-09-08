import React, { memo, useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Modal } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { BsFillPrinterFill } from "react-native-vector-icons/FontAwesome"; // Adjust as needed
import { useRoute } from "@react-navigation/native";
const MainPageCourseCards = memo(({ CardsportalId, LandingPage = false, onCourseClick, onCourseClickHandler}) => {
  const [popupContent, setPopupContent] = useState("Coming Soon!");
  const [showComingSoonPopup, setShowComingSoonPopup] = useState(false);

  const courses = [
    { title: "TEST SERIES", image: require("../images/otsImg.png"), portalId: 1 },
    { title: "MINI / MICRO COURSES", image: require("../images/microcourses.png"), portalId: 2 },
    { title: "PRACTICE QUESTION BANK", image: require("../images/pqb.png"), portalId: 3 },
  ];
 // 👇 Equivalent of location.pathname.startsWith("/StudentDashboard")
    const route = useRoute();
    const isOnStudentDashboard = route.name === "studentDashboard";
console.log("studnt dashhhhhboarddddd",isOnStudentDashboard)
  const handleExploreClick = (course) => {
    if (course.title === "PRACTICE QUESTION BANK") {
      setShowComingSoonPopup(true);
      return;
    }

    if (LandingPage && typeof onCourseClick === "function") {
      onCourseClick(course.portalId);
      return;
    }

    if (isOnStudentDashboard && onCourseClickHandler) {
      onCourseClickHandler("buyCourses", course.portalId);
      return;
    }
  };

  const getCourseContent = (title) => {
    switch (title) {
      case "MINI / MICRO COURSES":
        return [
          { icon: <Icon name="laptop" size={16} color={CardsportalId === 1 ? "cornflowerblue" : "#154eb5"} />, text: "Recorded Video Lectures" },
          { icon: <Icon name="clock-o" size={16} color={CardsportalId === 1 ? "cornflowerblue" : "#154eb5"} />, text: "Real Time Mock Tests" },
          { icon: <Icon name="video-camera" size={16} color={CardsportalId === 1 ? "cornflowerblue" : "#154eb5"} />, text: "Video Solutions" },
          { icon: <Icon name="print" size={16} color={CardsportalId === 1 ? "cornflowerblue" : "#154eb5"} />, text: "Study Materials" },
        ];
      case "TEST SERIES":
        return [
          { icon: <Icon name="clock-o" size={16} color={CardsportalId === 1 ? "cornflowerblue" : "#154eb5"} />, text: "Real Time Mock Tests" },
          { icon: <Icon name="check-square-o" size={16} color={CardsportalId === 1 ? "cornflowerblue" : "#154eb5"} />, text: "Rank Based Reports" },
          { icon: <Icon name="video-camera" size={16} color={CardsportalId === 1 ? "cornflowerblue" : "#154eb5"} />, text: "Video Solutions" },
          { icon: <Icon name="tasks" size={16} color={CardsportalId === 1 ? "cornflowerblue" : "#154eb5"} />, text: "Performance Analytics" },
        ];
      case "PRACTICE QUESTION BANK":
        return [
          { icon: <Icon name="question" size={16} color={CardsportalId === 1 ? "cornflowerblue" : "#154eb5"} />, text: "Challenging Questions" },
          { icon: <Icon name="lightbulb-o" size={16} color={CardsportalId === 1 ? "cornflowerblue" : "#154eb5"} />, text: "Hints, Tips and Tricks" },
          { icon: <Icon name="check-square-o" size={16} color={CardsportalId === 1 ? "cornflowerblue" : "#154eb5"} />, text: "Chapter wise Practice" },
          { icon: <Icon name="video-camera" size={16} color={CardsportalId === 1 ? "cornflowerblue" : "#154eb5"} />, text: "Video Solutions" },
        ];
      default:
        return [];
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {courses.map((course, index) => (
        <View
          key={index}
          style={[
            styles.card,
            { backgroundColor: CardsportalId === 1 ? "white" : CardsportalId === 2 ? "#F0F8FF" : "white" },
          ]}
        >
          <View style={styles.cardTop}>
            <Text style={styles.cardTitle}>{course.title}</Text>
          </View>

          <Image source={course.image} style={styles.courseImage} resizeMode="contain" />

          <View style={styles.cardBottom}>
            {getCourseContent(course.title).map((item, idx) => (
              <View key={idx} style={styles.contentRow}>
                {item.icon}
                <Text style={styles.contentText}>{item.text}</Text>
              </View>
            ))}

            <TouchableOpacity style={styles.btn} onPress={() => handleExploreClick(course)}>
              <Text style={styles.btnText}>Explore</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <Modal visible={showComingSoonPopup} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{popupContent}</Text>
            <TouchableOpacity onPress={() => setShowComingSoonPopup(false)} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardTop: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  courseImage: {
    width: "100%",
    height: 120,
    marginBottom: 12,
  },
  cardBottom: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 12,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  contentText: {
    marginLeft: 8,
    fontSize: 14,
  },
  btn: {
    marginTop: 12,
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  closeBtn: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  closeBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default MainPageCourseCards;
