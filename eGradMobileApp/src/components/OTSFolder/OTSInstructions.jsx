import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet ,ImageBackground} from 'react-native';
import { Intstruction_content } from './Intstruction_content.js'
import { styles } from '../../styles/OTSStyles.js';
const OTSInstructions = ({ closeInstructions }) => {
  const data = Intstruction_content[0];
const backgroundImages = {
  AnswerdBtnCls: require('../../images/Answered.png'),
  NotAnsweredBtnCls: require('../../images/NotAnswered.png'),
  MarkedForReview: require('../../images/MarkedForReview.png'),
  AnsMarkedForReview: require('../../images/AnsMarkedForReview.png'),
  NotVisitedBehaviourBtns: require('../../images/Visited.png'),
};
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.closeBtnContainer}>
          <Text style={styles.noteText}>
            Note that the timer is ticking while you read the instructions.
            Close this page to return to answering the questions.
          </Text>
          <TouchableOpacity onPress={closeInstructions} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.headingCenter}>{data.Intstruction_content_text_center}</Text>

        {/* Section 1 */}
        <View style={styles.section}>
          <Text style={styles.subHeading}>{data.Intstruction_content_text_subheading_1}</Text>
          <Text style={styles.listItem}>
            • Please note: If you open any other window, switch tabs, or
            minimize this window during the exam, it will be automatically
            terminated. Be careful while taking the exam!
          </Text>
          <Text style={styles.listItem}>• {data.Intstruction_content_points_1}</Text>
          <Text style={styles.listItem}>• {data.Intstruction_content_points_2}</Text>
          <Text style={styles.listItem}>• {data.Intstruction_content_points_3}</Text>

          {/* Buttons Table Simulation */}
          <View style={styles.statusBox}>

 {[
    {
      number: 1,
      text: data.Intstruction_content_points_p1,
      image: backgroundImages.NotVisitedBehaviourBtns,
      textStyle: styles.questionBtnText,
    },
    {
      number: 3,
      text: data.Intstruction_content_points_p2,
      image: backgroundImages.NotAnsweredBtnCls,
      textStyle: [styles.questionBtnText, styles.whiteText],
    },
    {
      number: 5,
      text: data.Intstruction_content_points_p3,
      image: backgroundImages.AnswerdBtnCls,
      textStyle: [styles.questionBtnText, styles.whiteText],
    },
    {
      number: 7,
      text: data.Intstruction_content_points_p4,
      image: backgroundImages.MarkedForReview,
      textStyle: [styles.questionBtnText, styles.whiteText],
    },
    {
      number: 9,
      text: data.Intstruction_content_points_p5,
      image: backgroundImages.AnsMarkedForReview,
      textStyle: [styles.questionBtnText, styles.whiteText],
    },
  ].map((item, index) => (
    <View key={index} style={styles.row}>
      <ImageBackground
        source={item.image}
        style={{ width: 45, height: 45, justifyContent: 'center', alignItems: 'center' }}
        imageStyle={{ resizeMode: 'contain' }}
      >
        <Text style={item.textStyle}>{item.number}</Text>
      </ImageBackground>
      <Text style={styles.statusText}>{item.text}</Text>
    </View>
  ))}

 </View>

          <Text style={styles.listItem}>• {data.Intstruction_content_points_p}</Text>
        </View>

        {/* Section 2 */}
        <View style={styles.section}>
          <Text style={styles.subHeading}>{data.Intstruction_content_text_subheading_2}</Text>
          <Text style={styles.listItem}>• {data.Intstruction_content_points_4}</Text>
          <Text style={styles.subListItem}>• {data.Intstruction_content_points_4_a}</Text>
          <Text style={styles.subListItem}>• {data.Intstruction_content_points_4_b}</Text>
          <Text style={styles.subListItem}>• {data.Intstruction_content_points_4_c}</Text>

          <Text style={styles.listItem}>
            • {data.Intstruction_content_points_5}
            <Text style={styles.boldText}> {data.span_1} </Text>
            {data.Intstruction_content_points_5__}
          </Text>
        </View>

        {/* Section 3 */}
        <View style={styles.section}>
          <Text style={styles.subHeading}>{data.Intstruction_content_text_subheading_3}</Text>
          <Text style={styles.listItem}>• {data.Intstruction_content_points_6}</Text>
          <Text style={styles.subListItem}>• {data.Intstruction_content_points_6_a}</Text>
          <Text style={styles.subListItem}>• {data.Intstruction_content_points_6_b}</Text>
          <Text style={styles.subListItem}>
            • {data.Intstruction_content_points_6_c}
            <Text style={styles.boldText}> {data.span_2}</Text>
          </Text>
          <Text style={styles.subListItem}>
            • {data.Intstruction_content_points_6_d}
            <Text style={styles.boldText}> {data.span_3}</Text>
            {data.Intstruction_content_points_6_d__}
          </Text>
          <Text style={styles.subListItem}>• {data.Intstruction_content_points_6_e}</Text>

          <Text style={styles.listItem}>
            • {data.Intstruction_content_points_7}
            <Text style={styles.boldText}> {data.span_4} </Text>
            {data.Intstruction_content_points_7__}
          </Text>
          <Text style={styles.listItem}>• {data.Intstruction_content_points_8}</Text>
        </View>

        {/* Section 4 */}
        <View style={styles.section}>
          <Text style={styles.subHeading}>{data.Intstruction_content_text_subheading_4}</Text>
          <Text style={styles.listItem}>• {data.Intstruction_content_points_9}</Text>
          <Text style={styles.listItem}>• {data.Intstruction_content_points_10}</Text>
          <Text style={styles.listItem}>• {data.Intstruction_content_points_11}</Text>
          <Text style={styles.listItem}>• {data.Intstruction_content_points_12}</Text>
        </View>
      </View>
    </ScrollView>
  );
};





export default OTSInstructions;
