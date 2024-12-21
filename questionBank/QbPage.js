import React from "react";
import { View } from "react-native-web";
export const QbPage = ({ route }) => {
  const { id } = route.params;

  return (
    <View>
      <Text>qbPage</Text>
      <Text>Id:{id}</Text>

    </View>
  );
};
