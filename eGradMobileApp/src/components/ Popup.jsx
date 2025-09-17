import React from 'react'
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-svg';

const  Popup = () => {
  return (
     <View style={styles.container}>
              <Text style={styles.text}>Hello World</Text>
          </View>
  )
}

export default  Popup;
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
