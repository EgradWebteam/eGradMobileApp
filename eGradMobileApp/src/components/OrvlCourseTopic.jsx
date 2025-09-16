import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OrvlCourseTopic = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Hello World</Text>
        </View>
    );
};
export default OrvlCourseTopic;
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
