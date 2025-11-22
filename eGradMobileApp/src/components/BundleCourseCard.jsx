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
    
    {/* TOP HEADER */}
    <View style={styles.cardTop}>
      <Text style={styles.cardHeaderText}>ONLINE VIDEO COURSES</Text>
    </View>

    {/* IMAGE SECTION */}
    <View style={styles.imageWrapper}>
      <Image
        source={imageToShow}
        style={styles.image}
        resizeMode="contain"
      />
    </View>

    {/* BUTTON */}
    <View style={styles.cardBottom}>
      <TouchableOpacity style={styles.button} onPress={handleGoToCourse}>
        <Text style={styles.buttonText}>Go to Course</Text>
      </TouchableOpacity>
    </View>

  </View>
);

};

export default BundleCourseCard;

const styles = StyleSheet.create({
  cardContainer: {
    width: 300,
    height: 238,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#66666670',
    overflow: 'hidden',
    borderRadius: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    margin: 10,
  },

  /* Header Like Web */
  cardTop: {
    backgroundColor: '#444444',
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    marginTop: 5,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardHeaderText: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: 'Arial',
  },

  /* Image Block EXACT like Web */
  imageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },

  image: {
    width: 180,
    height: 110,
  },

  /* Bottom Blue Bar */
  cardBottom: {
    marginHorizontal: 5,
    backgroundColor: '#32b6ef',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },

  button: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
