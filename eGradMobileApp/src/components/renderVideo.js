import React from "react";
import { WebView } from "react-native-webview";

 const renderVideo = (url) => {
    if (!url) return null;
    const lowerUrl = url.toLowerCase();
    let embedUrl = url;

    if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("youtu.be")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0];
      } else if (url.includes("watch?v=")) {
        videoId = url.split("watch?v=")[1]?.split("&")[0];
      }
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (lowerUrl.includes("vimeo.com")) {
      const videoId = url.split("/").pop();
      embedUrl = `https://player.vimeo.com/video/${videoId}`;
    } else if (lowerUrl.includes("drive.google.com/file/d/")) {
      const fileId = url.split("/d/")[1]?.split("/")[0];
      if (fileId) embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
    } else if (lowerUrl.match(/\.(mp4|webm|ogg)$/)) {
      return (
        <WebView
          source={{ uri: url }}
          style={{ width: "100%", height: 300 }}
          mediaPlaybackRequiresUserAction={false}
          allowsFullscreenVideo
        />
      );
    }

    return (
      <WebView
        source={{ uri: embedUrl }}
        style={{ width: "100%", height: 300 }}
        javaScriptEnabled
        allowsFullscreenVideo
      />
    );
  };

  export default renderVideo;
