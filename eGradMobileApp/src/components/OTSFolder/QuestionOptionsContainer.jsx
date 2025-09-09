import React, { useEffect, useRef,useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import CheckBox from '@react-native-community/checkbox';
import { styles } from '../../styles/OTSStyles';
import ResponsiveImage from './ResponsiveImage';
const QuestionOptionsContainer = ({
  options,
  optPatternId,
  questionTypeId,
  onSelectOption,
  savedAnswer,
  selectedOption,
  questionId,
  selectedOptionsArray,
  setSelectedOptionsArray,
  natValue,
  setNatValue,
  isDisabled,
}) => {
  const inputRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  useEffect(() => {
    if ([5, 6].includes(questionTypeId) && savedAnswer?.natAnswer) {
      setNatValue(savedAnswer.natAnswer);
    }
  }, [questionTypeId, savedAnswer, setNatValue]);

  const getLabel = (index, optionIndex) => {
    if (optPatternId === 1) return `(${optionIndex.toUpperCase()})`;
    if (optPatternId === 2) return `(${optionIndex.toLowerCase()})`;
    if (optPatternId === 3) return `(${index + 1})`;
    return `(${optionIndex})`;
  };

  const calculatorButtons = ['7','8','9','4','5','6','3','2','1','0','.','-'];
const handleArrowInput = (direction) => {
  if (!inputRef.current) return;
  let newPosition = cursorPosition;

  if (direction === 'left' && cursorPosition > 0) {
    newPosition -= 1;
  } else if (direction === 'right' && cursorPosition < natValue.length) {
    newPosition += 1;
  }

  setCursorPosition(newPosition);
  inputRef.current.focus();
};
  const handleCalculatorInput = (val) => {
    let currentValue = natValue || '';
    if (val === 'ClearAll') {
      setNatValue('');
      onSelectOption('');
      return;
    }
    if (val === 'BackSpace') {
      currentValue = currentValue.slice(0, -1);
      setNatValue(currentValue);
      onSelectOption(currentValue);
      return;
    }
    if (val === '-' && !currentValue.includes('-')) {
      currentValue = '-' + currentValue;
      setNatValue(currentValue);
      onSelectOption(currentValue);
      return;
    }
    if (val === '.' && (currentValue.includes('.') || currentValue === '-')) return;
    let updated = currentValue + val;
    setNatValue(updated);
    onSelectOption(updated);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* MCQ - Single Selection */}
{[1, 2, 8].includes(questionTypeId) && (
  <RadioButton.Group
    onValueChange={(val) => {
      onSelectOption({ option_index: val });
    }}
    value={
      selectedOption?.option_index ??
      savedAnswer?.optionIndex ??
      ''
    }
  >
    {options.map((option, index) => (
      <View key={option.option_id} style={styles.optionRow}>
        <RadioButton.Item
          label={getLabel(index, option.option_index)}
          value={option.option_index}
          disabled={isDisabled}
          style={styles.radioItem}
          labelStyle={styles.optionLabel}
          uncheckedColor={isDisabled ? '#ccc' : '#000'}
        />
        {option.optionImgName ? (

            <ResponsiveImage uri={option.optionImgName} />
        ) : null}
      </View>
    ))}
  </RadioButton.Group>
)}


      {/* MSQ - Multiple Selection */}
      {[3, 4].includes(questionTypeId) && options.map((option, index) => {
        const isChecked = selectedOptionsArray.includes(option.option_index);
        return (
          <View key={option.option_id} style={styles.optionRow}>
            <CheckBox
              disabled={isDisabled}
              value={isChecked}
              onValueChange={(newVal) => {
                const updated = newVal
                  ? [...selectedOptionsArray, option.option_index]
                  : selectedOptionsArray.filter((v) => v !== option.option_index);
                setSelectedOptionsArray(updated);
                onSelectOption(updated);
              }}
            />
            <Text style={styles.optionLabel}>
              {getLabel(index, option.option_index)}
            </Text>
         
              <ResponsiveImage uri={option.optionImgName} />
          </View>
        );
      })}

      {/* NAT Input with Calculator UI */}
      {[5, 6].includes(questionTypeId) && (
        <View style={styles.NATInputHolder}>
           <View style={styles.NATLabel}>
          <TextInput
            ref={inputRef}
            style={styles.natInput}
            value={natValue}
              onChangeText={(text) => {
    setNatValue(text);
    setCursorPosition(text.length); // or wherever needed
  }}
  selection={{ start: cursorPosition, end: cursorPosition }}
    onSelectionChange={({ nativeEvent: { selection } }) => {
    setCursorPosition(selection.start);
  }}
            editable={false}
          /></View>
          <View style={styles.backSpaceBtn}>
            <TouchableOpacity
              disabled={isDisabled}
              style={styles.backSpaceButton}
              onPress={() => handleCalculatorInput('BackSpace')}
            >
              <Text>Backspace</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.CalculatorBox}>
            {calculatorButtons.map((btn, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.calcButton}
                onPress={() => handleCalculatorInput(btn)}
                disabled={isDisabled}
              >
                <Text style={styles.calcText}>{btn}</Text>
              </TouchableOpacity>
            ))}
          </View>
<View style={styles.arrowBtns}>
  <TouchableOpacity
    style={styles.arrowButton}
    onPress={() => handleArrowInput('left')}
    disabled={cursorPosition === 0}
  >
    <Text style={styles.arrowText}>←</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={styles.arrowButton}
    onPress={() => handleArrowInput('right')}
    disabled={cursorPosition === natValue.length}
  >
    <Text style={styles.arrowText}>→</Text>
  </TouchableOpacity>
</View>
          <View style={styles.backSpaceBtn}>
            <TouchableOpacity
              disabled={isDisabled}
                style={styles.backSpaceButton}
              onPress={() => handleCalculatorInput('ClearAll')}
            >
              <Text>Clear All</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default QuestionOptionsContainer;