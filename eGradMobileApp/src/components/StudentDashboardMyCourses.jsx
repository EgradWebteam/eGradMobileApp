import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StudentDashboardMyCourses() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Courses</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
