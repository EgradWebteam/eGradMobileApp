import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome5";

const CourseCards = React.memo(
  ({
    title,
    cardImage,
    price,
    originalPrice,
    context,
    onBuy,
    onGoToTest,
    portalId,
    chapterWiseTestCount,
    topicWiseTestCount,
    subjectWiseTestCount,
    partTestCount,
    fullTestCount,
    VideoLectures,
    totalPracticeQuestions,
    studyMaterialCount,
    courseInstructor,
    isUpgrade,
  }) => {
    const showBuySection =
      context === "buyCourses" || context === "OTSHomePage";
    const showGoToTestSection = context === "myCourses";

    const testLabel = portalId === 3 ? "Worksheets" : "Tests";

    return (
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          
          {/* HEADER */}
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{title}</Text>
          </View>

          {/* IMAGE */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: cardImage }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          {/* BUY SECTION */}
          {showBuySection && (
            <View style={styles.detailsContainer}>

              {/* ---------------- TEST COURSES [Portal 1 / 3] ---------------- */}
              {(portalId === 1 || portalId === 3) && (
                <View>

                  <View style={styles.iconList}>

                    {chapterWiseTestCount > 0 && (
                      <View style={styles.row}>
                        <Icon name="book-open" size={18} color="#2bb8ff" />
                        <Text style={styles.testLine}>
                          {chapterWiseTestCount} Chapterwise {testLabel}
                        </Text>
                      </View>
                    )}
                    
                    {topicWiseTestCount > 0 && (
                      <View style={styles.row}>
                        <Icon name="list-ul" size={18} color="#2bb8ff" />
                        <Text style={styles.testLine}>
                          {topicWiseTestCount} Topicwise {testLabel}
                        </Text>
                      </View>
                    )}

                    {subjectWiseTestCount > 0 && (
                      <View style={styles.row}>
                        <Icon name="book" size={18} color="#2bb8ff" />
                        <Text style={styles.testLine}>
                          {subjectWiseTestCount} Subjectwise {testLabel}
                        </Text>
                      </View>
                    )}

                    {partTestCount > 0 && (
                      <View style={styles.row}>
                        <Icon name="puzzle-piece" size={18} color="#2bb8ff" />
                        <Text style={styles.testLine}>
                          {partTestCount} Part {testLabel}
                        </Text>
                      </View>
                    )}

                    {fullTestCount > 0 && (
                      <View style={styles.row}>
                        <Icon name="bullseye" size={18} color="#2bb8ff" />
                        <Text style={styles.testLine}>
                          {fullTestCount} Full {testLabel}
                        </Text>
                      </View>
                    )}

                  </View>

                  {/* PRICE */}
                  <View style={styles.priceRow}>
                    <Text style={styles.priceRed}>Rs {price}/-</Text>
                    <Text style={styles.validity}>Valid till exam 2026</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.buyBtn}
                    onPress={() => onBuy(price)}
                  >
                    <Text style={styles.buyBtnTxt}>
                      {isUpgrade ? "Upgrade" : "Buy Now"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* ---------------- VIDEO COURSES [Portal 2] ---------------- */}
              {portalId === 2 && (
                <View>

                  <Text style={styles.heading}>Instructor</Text>

                  {Array.isArray(courseInstructor) &&
                  courseInstructor.length > 0 ? (
                    courseInstructor[0]
                      .split(",")
                      .map((inst, i) => (
                        <Text key={i} style={styles.instructorName}>
                          {inst.trim()}
                        </Text>
                      ))
                  ) : (
                    <Text>N/A</Text>
                  )}

                  <View style={styles.iconList}>

                    {VideoLectures > 0 && (
                      <View style={styles.row}>
                        <Icon name="video" size={18} color="#2bb8ff" />
                        <Text style={styles.testLine}>
                          {VideoLectures} Lectures
                        </Text>
                      </View>
                    )}

                    {totalPracticeQuestions > 0 && (
                      <View style={styles.row}>
                        <Icon name="question-circle" size={18} color="#2bb8ff" />
                        <Text style={styles.testLine}>
                          {totalPracticeQuestions} Practice Questions
                        </Text>
                      </View>
                    )}

                    {studyMaterialCount > 0 && (
                      <View style={styles.row}>
                        <Icon name="file-alt" size={18} color="#2bb8ff" />
                        <Text style={styles.testLine}>
                          {studyMaterialCount} Study Materials
                        </Text>
                      </View>
                    )}

                  </View>

                  {/* PRICE */}
                  <View style={styles.priceRow}>
                    <Text style={styles.priceRed}>Rs {price}/-</Text>
                    <Text style={styles.validity}>Valid till exam 2026</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.buyBtn}
                    onPress={() => onBuy(price)}
                  >
                    <Text style={styles.buyBtnTxt}>
                      {isUpgrade ? "Upgrade" : "Buy Now"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* ---------------- My Courses ---------------- */}
          {showGoToTestSection && (
            <TouchableOpacity style={styles.buyBtn} onPress={onGoToTest}>
              <Text style={styles.buyBtnTxt}>
                {portalId === 3 ? "Go to Practice" : "Go to Test"}
              </Text>
            </TouchableOpacity>
          )}

        </View>
      </View>
    );
  }
);

export default CourseCards;


/* ------------------ STYLES ------------------ */

const styles = StyleSheet.create({
  cardContainer: {
    margin: 12,
  },

  card: {
    borderWidth: 1.2,
    borderColor: "#3c3c3c",
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // elevation: 5,
  },

  cardHeader: {
    backgroundColor: "#3c3c3c",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },

  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
  },

  image: {
    width: "95%",
    height: 180,
    borderRadius: 5,
  },

  detailsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  iconList: {
    marginVertical: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },

  testLine: {
    fontSize: 17,
    fontWeight: "600",
    color: "#3c3c3c",
    marginLeft: 10,
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  priceRed: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
  },

  validity: {
    fontSize: 14,
    color: "green",
    fontWeight: "600",
    marginTop: 4,
  },

  buyBtn: {
    marginTop: 12,
    backgroundColor: "#2bb8ff",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  buyBtnTxt: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  heading: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 10,
    color: "#000",
    textAlign: "center",
  },

  instructorName: {
    textAlign: "center",
    marginVertical: 2,
    fontSize: 16,
    fontWeight: "600",
  },
});
