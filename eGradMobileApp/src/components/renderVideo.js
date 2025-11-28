import React from "react";
import { WebView } from "react-native-webview";
import YoutubePlayer from "react-native-youtube-iframe";

const renderVideo = (url) => {
  if (!url || typeof url !== "string") return null;

  const lower = url.toLowerCase();
  let embedUrl = url;

  // ------- YOUTUBE (use YoutubePlayer instead of WebView) -------
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) {
    let videoId = "";

    if (url.includes("youtu.be")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1]?.split("&")[0];
    } else if (url.includes("/v/")) {
      videoId = url.split("/v/")[1]?.split("?")[0];
    }

    if (videoId) {
      return (
        <YoutubePlayer
            height={300}
          play={false}
          videoId={videoId}
        />
      );
    }
  }

  // ------- VIMEO -------
  if (lower.includes("vimeo.com")) {
    const id = url.split("/").pop();
    embedUrl = `https://player.vimeo.com/video/${id}`;
  }

  // ------- GOOGLE DRIVE -------
  if (lower.includes("drive.google.com/file/d/")) {
    const id = url.split("/d/")[1]?.split("/")[0];
    if (id) {
      embedUrl = `https://drive.google.com/file/d/${id}/preview`;
    }
  }

  // ------- DIRECT MP4 / WEBM / OGG -------
  if (lower.match(/\.(mp4|webm|ogg)$/)) {
    return (
      <WebView
        source={{ uri: url }}
        style={{ width: "100%", height: 300 }}
        allowsFullscreenVideo
        mediaPlaybackRequiresUserAction={false}
      />
    );
  }

  // ------- DEFAULT WEBVIEW (Vimeo, Drive, Others) -------
  return (
    <WebView
      source={{ uri: embedUrl }}
      style={{ width: "100%", height: 300 }}
      javaScriptEnabled
      domStorageEnabled
      allowsFullscreenVideo
    />
  );
};

export default renderVideo;
