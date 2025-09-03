import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TimerContext = createContext();
export const useTimer = () => useContext(TimerContext);

const TimerProvider = ({ testData, resumeTime, children }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const appState = useRef(AppState.currentState);

  const parseTimeToSeconds = (time) => {
    if (typeof time === 'number') return time;
    if (typeof time === 'string') {
      const [h = 0, m = 0, s = 0] = time.split(':').map(Number);
      return h * 3600 + m * 60 + s;
    }
    return 0;
  };

  const totalDurationInSeconds = parseTimeToSeconds((testData?.TestDuration || 0) * 60);
  const resumeTimeInSeconds = parseTimeToSeconds(resumeTime);

  useEffect(() => {
    if (!testData || !testData.TestDuration) return;

    const setupTimer = async () => {
      const now = Date.now();
      let storedStartTime = await AsyncStorage.getItem('examStartTime');

      if (resumeTime != null) {
        // Force new start
        storedStartTime = now.toString();
        await AsyncStorage.setItem('examStartTime', storedStartTime);
      } else {
        if (!storedStartTime) {
          storedStartTime = now.toString();
          await AsyncStorage.setItem('examStartTime', storedStartTime);
        }
      }

      startTimeRef.current = parseInt(storedStartTime, 10);
      const startingTimeLeft = resumeTime != null ? resumeTimeInSeconds : totalDurationInSeconds;

      const updateTime = () => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const remaining = Math.max(startingTimeLeft - elapsed, 0);
        setTimeLeft(remaining);
      };

      updateTime();
      intervalRef.current = setInterval(updateTime, 1000);
    };

    setupTimer();

    // Handle app state changes (foreground/background)
    const handleAppStateChange = (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App comes to foreground, update timer immediately
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const startingTimeLeft = resumeTime != null ? resumeTimeInSeconds : totalDurationInSeconds;
        const remaining = Math.max(startingTimeLeft - elapsed, 0);
        setTimeLeft(remaining);
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      clearInterval(intervalRef.current);
      subscription.remove();
    };
  }, [testData, resumeTime]);

  const timeSpent = timeLeft !== null ? totalDurationInSeconds - timeLeft : 0;

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <TimerContext.Provider
      value={{
        timeLeft,
        timeSpent,
        formattedTime: timeLeft !== null ? formatTime(timeLeft) : 'Loading...',
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export default TimerProvider;
