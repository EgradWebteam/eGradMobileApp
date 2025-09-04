import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import MainPageCourseCards from "./MainPageCourseCards";
// import DisableKeysAndMouseInteractions from "../../ContextFolder/DisableKeysAndMouseInteractions";
import Icon from 'react-native-vector-icons/FontAwesome';

const StudentDashboardHome = ({ studentName, handleSectionChange, portalId, logoText }) => {
  // Call your disable interactions logic if needed
//   DisableKeysAndMouseInteractions(null);

  const portalLabel = portalId === 1 ? "UG" : portalId === 2 ? "PG" : "";

  return (
    <ScrollView style={styles.dashboardContainer}>
      <View style={styles.greetingContainer}>
        <Text style={styles.welcomeNote}>
          Welcome to {logoText} {portalLabel} Online Courses.
        </Text>
        <Text style={styles.studentHiMsg}>Hi, {studentName}</Text>
      </View>

      <View style={styles.exploreCardsDiv}>
        <View style={styles.cardDiv}>
          <Icon name="book" size={24} color="#000" style={styles.icon} />
          <TouchableOpacity
            style={styles.btn}
            onPress={() => handleSectionChange("myCourses")}
          >
            <Text style={styles.btnText}>My Courses</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardDiv}>
          <Icon name="shopping-cart" size={24} color="#000" style={styles.icon} />
          <TouchableOpacity
            style={styles.btn}
            onPress={() => handleSectionChange("buyCourses")}
          >
            <Text style={styles.btnText}>Buy Courses</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.exploreCoursesHeadingDiv}>
        <Text style={styles.exploreCoursesHeading}>Explore our courses</Text>
      </View>

      <MainPageCourseCards onCourseClickHandler={handleSectionChange} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  dashboardContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  greetingContainer: {
    marginBottom: 20,
  },
  welcomeNote: {
    fontSize: 18,
    fontWeight: "bold",
  },
  studentHiMsg: {
    fontSize: 16,
    marginTop: 4,
    color: "#555",
  },
  exploreCardsDiv: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  cardDiv: {
    alignItems: "center",
    width: "48%",
    padding: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  icon: {
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  exploreCoursesHeadingDiv: {
    marginBottom: 12,
  },
  exploreCoursesHeading: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default StudentDashboardHome;
