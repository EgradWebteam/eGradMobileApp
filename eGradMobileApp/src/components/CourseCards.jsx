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

    const formatCount = (num) => String(num).padStart(2, "0");

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
            <View>
              <View style={styles.detailsContainer}>

                {/* ---------------- TEST COURSES [Portal 1 / 3] ---------------- */}
                {(portalId === 1 || portalId === 3) && (
                  <View>

                    <View style={styles.iconList}>

                      {chapterWiseTestCount > 0 && (
                        <View style={styles.featureRow}>
                          <Icon name="book-open" size={18} color="#2bb8ff" style={styles.iconFix} />
                          <View style={styles.alignBlock}>
                            <Text style={styles.countText}>{formatCount(chapterWiseTestCount)}</Text>
                            <Text style={styles.labelText}>Chapterwise {testLabel}</Text>
                          </View>
                        </View>
                      )}

                      {topicWiseTestCount > 0 && (
                        <View style={styles.featureRow}>
                          <Icon name="list-ul" size={18} color="#2bb8ff" style={styles.iconFix} />
                          <View style={styles.alignBlock}>
                            <Text style={styles.countText}>{formatCount(topicWiseTestCount)}</Text>
                            <Text style={styles.labelText}>Topicwise {testLabel}</Text>
                          </View>
                        </View>
                      )}

                      {subjectWiseTestCount > 0 && (
                        <View style={styles.featureRow}>
                          <Icon name="book" size={18} color="#2bb8ff" style={styles.iconFix} />
                          <View style={styles.alignBlock}>
                            <Text style={styles.countText}>{formatCount(subjectWiseTestCount)}</Text>
                            <Text style={styles.labelText}>Subjectwise {testLabel}</Text>
                          </View>
                        </View>
                      )}

                      {partTestCount > 0 && (
                        <View style={styles.featureRow}>
                          <Icon name="puzzle-piece" size={18} color="#2bb8ff" style={styles.iconFix} />
                          <View style={styles.alignBlock}>
                            <Text style={styles.countText}>{formatCount(partTestCount)}</Text>
                            <Text style={styles.labelText}>Part {testLabel}</Text>
                          </View>
                        </View>
                      )}

                      {fullTestCount > 0 && (
                        <View style={styles.featureRow}>
                          <Icon name="bullseye" size={18} color="#2bb8ff" style={styles.iconFix} />
                          <View style={styles.alignBlock}>
                            <Text style={styles.countText}>{formatCount(fullTestCount)}</Text>
                            <Text style={styles.labelText}>Full {testLabel}</Text>
                          </View>
                        </View>
                      )}

                    </View>


                    {/* PRICE */}
                    <View style={styles.priceRow}>
                      <Text style={styles.priceRed}>Rs {price}/-</Text>
                      <Text style={styles.validity}>Valid till exam 2026</Text>
                    </View>

                    {/* <TouchableOpacity
                      style={styles.buyBtn}
                      onPress={() => onBuy(price)}
                    >
                      <Text style={styles.buyBtnTxt}>
                        {isUpgrade ? "Upgrade" : "Buy Now"}
                      </Text>
                    </TouchableOpacity> */}
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
                        <View style={styles.featureRow}>
                          <Icon name="video" size={18} color="#2bb8ff" style={styles.iconFix} />
                          <View style={styles.alignBlock}>
                            <Text style={styles.countText}>{formatCount(VideoLectures)}</Text>
                            <Text style={styles.labelText}>Lectures</Text>
                          </View>
                        </View>
                      )}

                      {totalPracticeQuestions > 0 && (
                        <View style={styles.featureRow}>
                          <Icon name="question-circle" size={18} color="#2bb8ff" style={styles.iconFix} />
                          <View style={styles.alignBlock}>
                            <Text style={styles.countText}>{formatCount(totalPracticeQuestions)}</Text>
                            <Text style={styles.labelText}>Practice Questions</Text>
                          </View>
                        </View>
                      )}

                      {studyMaterialCount > 0 && (
                        <View style={styles.featureRow}>
                          <Icon name="file-alt" size={18} color="#2bb8ff" style={styles.iconFix} />
                          <View style={styles.alignBlock}>
                            <Text style={styles.countText}>{formatCount(studyMaterialCount)}</Text>
                            <Text style={styles.labelText}>Study Materials</Text>
                          </View>
                        </View>
                      )}

                    </View>

                    {/* PRICE */}
                    <View style={styles.priceRow}>
                      <Text style={styles.priceRed}>Rs {price}/-</Text>
                      <Text style={styles.validity}>Valid till exam 2026</Text>
                    </View>


                  </View>
                )}
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
    margin: 10,
  },

  /* Same card style as BundleCourseCard */
  card: {
    width: 300,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#66666670",
    // borderRadius: 8,
    overflow: "hidden",

    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },

  /* Same top header */
  cardHeader: {
    backgroundColor: "#444444",
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    marginHorizontal: 5,
    marginTop: 5,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center",
    textTransform: "uppercase",
    fontFamily: "Arial",
  },

  /* Same image wrapper behavior */
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
  },

  image: {
    // borderWidth: 1,
    // borderColor: "#66666670",
    // borderRadius: 8,
    width: 290,
    height: 110,
    resizeMode: "center",
  },

  detailsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 5,
  },

  iconList: {
    marginVertical: 5,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },

  iconFix: {
    width: 24,
    textAlign: "center",
  },

  alignBlock: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },

  countText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#3c3c3c",
    width: 30,
    textAlign: "right",
  },

  labelText: {
    fontSize: 17,
    color: "#3c3c3c",
    fontWeight: "600",
    marginLeft: 8,
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

  /* SAME BLUE BOTTOM BAR AS BundleCourseCard */
  buyBtn: {
    backgroundColor: "#32b6ef",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    marginBottom: 5,
    // borderRadius: 5,
    marginTop: 10,
  },

  buyBtnTxt: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
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
