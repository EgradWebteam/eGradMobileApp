import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>
      <Button
        title="Go to Next Screen"
        onPress={() => navigation.navigate("Next")}
      />
      <Button
        title="Go to QuestionBank page"
        onPress={() => navigation.navigate("QuestionBankHomePage")}
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1
  },
  text: {
    fontSize: 20,
  },
});
