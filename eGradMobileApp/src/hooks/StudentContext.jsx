import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const StudentContext = createContext();

export const useStudent = () => useContext(StudentContext);

const StudentProvider = ({ children }) => {
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("studentData");
        if (storedData) {
          setStudentData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error("Error loading student data from storage:", error);
      }
    };

    loadStudentData();
  }, []);

  useEffect(() => {
    const saveStudentData = async () => {
      try {
        if (studentData) {
          await AsyncStorage.setItem("studentData", JSON.stringify(studentData));
        } else {
          await AsyncStorage.removeItem("studentData");
        }
      } catch (error) {
        console.error("Error saving student data to storage:", error);
      }
    };

    saveStudentData();
  }, [studentData]);

  return (
    <StudentContext.Provider value={{ studentData, setStudentData }}>
      {children}
    </StudentContext.Provider>
  );
};

export default StudentProvider;
