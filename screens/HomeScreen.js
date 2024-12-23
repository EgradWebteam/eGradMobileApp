// import React from "react";
// import { View, Text, Button, StyleSheet } from "react-native";

// export default function HomeScreen({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Home Screen</Text>
//       {/* <TouchableOpacity>
//         <Text>Downloads Page</Text>
//       </TouchableOpacity> */}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     flexGrow: 1,
//     // backgroundColor:"green"
//   },
//   text: {
//     fontSize: 20,
//   },
// });

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>
      {/* <Button
        title="Go to QuestionBank Page"
        onPress={() => navigation.navigate('QuestionBankHomePage')} // Navigate to the next screen
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});
