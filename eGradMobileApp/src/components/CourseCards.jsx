import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const CourseCards = React.memo(({
  title,
  cardImage,
  price,
  originalPrice,
  context,
  onBuy,
  onGoToTest,
  portalId,
  numOfTests,
  numOfQuestions,
  subjects,
  VideoLectures,
  totalPracticeQuestions,
  chapterWiseTests,
  isUpgrade,
  courseTypeId
}) => {

  const showBuySection = context === 'buyCourses' || context === 'OTSHomePage';
  const showGoToTestSection = context === 'myCourses';
  const testButtonLabel = portalId === 3 ? 'Start Lecture' : 'Go to Test';

  useEffect(() => {
    // Razorpay integration handled differently in React Native
  }, []);

  const getBackgroundColor = (id) => {
    const typeId = Number(id);
    switch (typeId) {
      case 1: return styles.fullTestBg;
      case 2: return styles.subjectWiseBg;
      case 3: return styles.topicWiseBg;
      case 4: return styles.chapterWiseBg;
      default: return styles.fullTestBg;
    }
  };

  const getBorderColor = (id) => {
    const typeId = Number(id);
    switch (typeId) {
      case 1: return styles.fullTestBorder;
      case 2: return styles.subjectWiseBorder;
      case 3: return styles.topicWiseBorder;
      case 4: return styles.chapterWiseBorder;
      default: return styles.fullTestBorder;
    }
  };

  return (
    <View style={styles.cardContainer}>
    
        <View style={[styles.card, getBorderColor(courseTypeId)]}>
          <View style={[styles.cardHeader, getBackgroundColor(courseTypeId)]}>
            <Text style={styles.cardTitle}>{title}</Text>
          </View>

          <View style={styles.imageContainer}>
            <Image source={{ uri: cardImage }} style={styles.image} resizeMode="cover" />
          </View>
  {showBuySection ? (
          <View style={styles.detailsContainer}>
            {portalId === 1 ? (
              <>
                <View style={styles.row}>
                  <Text>No. of Tests:</Text>
                  <Text>{numOfTests}</Text>
                </View>

                <View style={styles.row}>
                  <Text>Price:</Text>
                  <Text>
                    ₹{price}
                    {originalPrice && <Text style={styles.strikeThrough}> ₹{originalPrice}</Text>}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.button, getBackgroundColor(courseTypeId)]}
                  onPress={() => onBuy(price)}
                >
                  <Text style={styles.buttonText}>{isUpgrade ? 'Upgrade' : 'Buy Now'}</Text>
                </TouchableOpacity>

                <Text style={styles.note}>
                  *Includes instant performance feedback, rank analysis, image and video solutions.
                </Text>
              </>
            ) : (
              <>
                <View style={styles.row}>
                  <Text>Lectures:</Text>
                  <Text>{VideoLectures}</Text>
                </View>

                <View style={styles.row}>
                  <Text>Practice Questions:</Text>
                  <Text>{totalPracticeQuestions}</Text>
                </View>

                <View style={styles.row}>
                  <Text>Price:</Text>
                  <Text>
                    ₹{price}
                    {originalPrice && <Text style={styles.strikeThrough}> ₹{originalPrice}</Text>}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.button, getBackgroundColor(courseTypeId)]}
                  onPress={() => onBuy(price)}
                >
                  <Text style={styles.buttonText}>{isUpgrade ? 'Upgrade' : 'Buy Now'}</Text>
                </TouchableOpacity>

                <Text style={styles.note}>
                  *Includes tests, study materials, instant reports, and video solutions.
                </Text>
              </>
            )}
          </View>
  ):showGoToTestSection ? (

          <TouchableOpacity style={[styles.button, styles.fullTestBg]} onPress={onGoToTest}>
            <Text style={styles.buttonText}>{testButtonLabel}</Text>
          </TouchableOpacity>
       
      ) : null}
    </View></View>
  );
});

export default CourseCards;

const styles = StyleSheet.create({
  cardContainer: {
    margin: 12,
  },
  card: {
    borderWidth: 2,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  imageContainer: {
    alignItems: 'center',
  justifyContent:'center',
    marginVertical: 10,
  },
  image: {
    width: 200,
    height: 200,
      alignItems: 'center',
  justifyContent:'center',
    borderRadius: 8,
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  button: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  note: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
  },
  strikeThrough: {
    textDecorationLine: 'line-through',
    color: 'red',
    marginLeft: 5,
  },

  // Background Colors
  fullTestBg: {
    backgroundColor: '#579b75',
  },
  subjectWiseBg: {
    backgroundColor: '#ac9563',
  },
  topicWiseBg: {
    backgroundColor: '#5282ae',
  },
  chapterWiseBg: {
    backgroundColor: '#17a2b8',
  },

  // Border Colors
  fullTestBorder: {
    borderColor: '#579b75',
   
  },
  subjectWiseBorder: {
    borderColor: '#ac9563',
  },
  topicWiseBorder: {
    borderColor: '#5282ae',
  },
  chapterWiseBorder: {
    borderColor: '#17a2b8',
  },
});
