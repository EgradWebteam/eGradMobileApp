import React, { useEffect, useState } from 'react';
import { Image, Dimensions, StyleSheet } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const maxWidth = screenWidth - 40; // 20px padding each side

const ResponsiveImage = ({ uri, style, ...props }) => {
  const [imageSize, setImageSize] = useState({ width: maxWidth, height: 150 }); // fallback size

  useEffect(() => {
    if (uri) {
      Image.getSize(
        uri,
        (originalWidth, originalHeight) => {
          const scaleFactor =
            originalWidth > maxWidth ? maxWidth / originalWidth : 1;

          setImageSize({
            width: originalWidth * scaleFactor,
            height: originalHeight * scaleFactor,
          });
        },
        (error) => {
          console.log('Image load error:', error);
        }
      );
    }
  }, [uri]);

  return (
    <Image
      source={{ uri }}
      style={[{ width: imageSize.width, height: imageSize.height }, style]}
      resizeMode="contain"
      {...props}
    />
  );
};

export default ResponsiveImage;
