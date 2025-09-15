import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import MainPageCourseCards from "./MainPageCourseCards";
// import DisableKeysAndMouseInteractions from "../../ContextFolder/DisableKeysAndMouseInteractions";
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from "../styles/StudentDashboardStyles";
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
          <Icon name="book" size={22} color="#000" style={styles.icon} />
          <TouchableOpacity
            style={styles.btn}
            onPress={() => handleSectionChange("myCourses")}
          >
            <Text style={styles.btnText}>My Courses</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardDiv}>
          <Icon name="shopping-cart" size={22} color="#000" style={styles.icon} />
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


export default StudentDashboardHome;
