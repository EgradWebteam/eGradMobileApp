import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import image1 from '../images/opqb.png';
import image2 from '../images/orvlm.png';
import image3 from '../images/otsm.png';
import { useSession } from '../hooks/SessionContext';

const images = [image1, image2, image3];

const BundleCourseCard = ({ exam_id, exam_name, Portal2data, onGoToCourse, setCourseIds }) => {
  const imageToShow = images[exam_id % images.length];
  const { validateSession } = useSession();

  const handleGoToCourse = async () => {
    const isValid = await validateSession();
    if (!isValid) return;

    const onlyCourseIds = (Portal2data?.courses || []).map(course => course.course_id);

    setCourseIds(onlyCourseIds);
    onGoToCourse(onlyCourseIds);
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardMain}>
        <View style={styles.cardTop}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>MINI / MICRO COURSES</Text>
          </View>
          <View style={styles.imageSection}>
            <Image
              source={imageToShow}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={styles.cardBottom}>
          <TouchableOpacity style={styles.button} onPress={handleGoToCourse}>
            <Text style={styles.buttonText}>Go to Course</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default BundleCourseCard;

const styles = StyleSheet.create({
  cardContainer: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 4, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardMain: {
    flexDirection: 'column',
  },
  cardTop: {
    marginBottom: 10,
  },
  cardHeader: {
    marginBottom: 10,
  },
  cardHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  imageSection: {
    alignItems: 'center',
  },
  image: {
    width: 180,
    height: 100,
  },
  cardBottom: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff', // replace with your color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
