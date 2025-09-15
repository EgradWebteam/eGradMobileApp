import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Use a calculator icon
import { useTimer } from "../../hooks/TimerContext"; // Make sure context is compatible with RN
// import ScientificCalculator from "./ScientificCalculator"; // You need a native-compatible version
// Remove web-only styles import
import { styles } from '../../styles/OTSStyles'
const OTSTimer = ({ realStudentId, realTestId, testData, realCourseId }) => {
  const { formattedTime } = useTimer();
  const [showCalculator, setShowCalculator] = useState(false);

//   const timeRef = useRef(formattedTime);

//   useEffect(() => {
//     timeRef.current = formattedTime;
//   }, [formattedTime]);

  const handleCalcClick = () => {
    setShowCalculator((prev) => !prev);
  };

  return (
    <View style={styles.timersection}>
      <Text style={styles.sectionLabel}>Sections</Text>

      <View style={styles.timeAndCalcRow}>
        <Text style={styles.timerText}>Time Left: {formattedTime}</Text>

        {/* {testData?.TestCalculator === "1" && (
          <TouchableOpacity onPress={handleCalcClick}>
            <Icon name="calculator-variant" size={28} color="#333" style={styles.icon} />
          </TouchableOpacity>
        )} */}
      </View>

      {showCalculator && (
        // <ScientificCalculator onClose={handleCalcClick} />
      <Text>hf</Text>
      )}
    </View>
  );
};

export default OTSTimer;


