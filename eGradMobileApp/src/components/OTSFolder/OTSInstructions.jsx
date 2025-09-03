import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Intstruction_content } from './Intstruction_content.js'
import { styles } from '../../styles/OTSStyles.js';
const OTSInstructions = ({ closeInstructions }) => {
  const data = Intstruction_content[0];

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
            <StatusRow number="1" description={data.Intstruction_content_points_p1} color="#ccc" />
            <StatusRow number="3" description={data.Intstruction_content_points_p2} color="#f99" />
            <StatusRow number="5" description={data.Intstruction_content_points_p3} color="#9f9" />
            <StatusRow number="7" description={data.Intstruction_content_points_p4} color="#ff9" />
            <StatusRow number="9" description={data.Intstruction_content_points_p5} color="#c9f" />
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

const StatusRow = ({ number, description, color }) => (
  <View style={styles.statusRow}>
    <View style={[styles.statusCircle, { backgroundColor: color }]}>
      <Text style={styles.statusNumber}>{number}</Text>
    </View>
    <Text style={styles.statusDescription}>{description}</Text>
  </View>
);



export default OTSInstructions;
