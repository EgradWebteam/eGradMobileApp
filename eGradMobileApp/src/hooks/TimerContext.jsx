import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

const TimerContext = createContext();
export const useTimer = () => useContext(TimerContext);

const TimerProvider = ({ testData, resumeTime, children }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const appState = useRef(AppState.currentState);

  // Converts duration in minutes or string format to seconds
  const parseTimeToSeconds = (time) => {
    if (typeof time === 'number') return time;
    if (typeof time === 'string') {
      const [h = 0, m = 0, s = 0] = time.split(':').map(Number);
      return h * 3600 + m * 60 + s;
    }
    return 0;
  };

  const totalDurationInSeconds = parseTimeToSeconds(testData?.TestDuration || 0) * 60;
  const resumeTimeInSeconds = parseTimeToSeconds(resumeTime);

  useEffect(() => {
    if (!testData || !testData.TestDuration) return;

    const now = Date.now();
    const durationToUse = resumeTime != null ? resumeTimeInSeconds : totalDurationInSeconds;

    startTimeRef.current = now;
    
    const updateTime = () => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(durationToUse - elapsed, 0);
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(intervalRef.current);
      }
    };

    updateTime();
    intervalRef.current = setInterval(updateTime, 1000);

    const handleAppStateChange = (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        updateTime();
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
