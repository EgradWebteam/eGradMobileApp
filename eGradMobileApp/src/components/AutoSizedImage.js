import React, { useEffect, useState } from "react";
import { Image, ScrollView, Dimensions } from "react-native";

const AutoSizedImage = ({ uri, style }) => {
  const [size, setSize] = useState(null);

  useEffect(() => {
    if (uri) {
      Image.getSize(
        uri,
        (w, h) => {
          const screenWidth = Dimensions.get("window").width - 40; // padding
          const scaleFactor = w / screenWidth;
          const imageHeight = h / scaleFactor;
          setSize({ width: screenWidth, height: imageHeight });
        },
        (error) => console.log("Image load error:", error)
      );
    }
  }, [uri]);

  if (!size) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
      <Image source={{ uri }} style={[style, size]} resizeMode="contain" />
    </ScrollView>
  );
};

export default AutoSizedImage;
