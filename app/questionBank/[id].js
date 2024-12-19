import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList } from "react-native-web";
import { TouchableOpacity } from "react-native";
import qbStyles from "./qbStyles";
const data = {
  2024: [
    {
      months: [
        {
          month: "JANUARY",
          data: [
            {
              id: 501,
              shift: "10th Jan - Shift-1",
              shiftDataUrl: "JeeMains_Three.json",
            },
            {
              id: 502,
              shift: "10th Jan - Shift-2",
              shiftDataUrl: "JeeMains_Three.json",
            },
          ],
        },
        {
          month: "FEB",
          data: [
            {
              id: 503,
              shift: "10th Jan - Shift-1",
              shiftDataUrl: "JeeMains_Three.json",
            },
            {
              id: 504,
              shift: "10th Jan - Shift-2",
              shiftDataUrl: "JeeMains_Three.json",
            },
          ],
        },
      ],
    },
  ],
  2023: [
    {
      months: [
        {
          month: "JANUARY",
          data: [
            {
              id: 601,
              shift: "10th Jan - Shift-1",
              shiftDataUrl: "JeeMains_four.json",
            },
            {
              id: 602,
              shift: "10th Jan - Shift-2",
              shiftDataUrl: "JeeMains_four.json",
            },
          ],
        },
      ],
    },
  ],
  2022: [
    {
      months: [
        {
          month: "JANUARY",
          data: [
            {
              id: 601,
              shift: "10th Jan - Shift-1",
              shiftDataUrl: "JeeMains_Two.json",
            },
            {
              id: 602,
              shift: "10th Jan - Shift-2",
              shiftDataUrl: "JeeMains_Two.json",
            },
          ],
        },
        {
          month: "February",
          data: [
            {
              id: 601,
              shift: "10th Jan - Shift-1",
              shiftDataUrl: "JeeMains_Two.json",
            },
            {
              id: 602,
              shift: "10th Feb - Shift-2",
              shiftDataUrl: "JeeMains_Two.json",
            },
          ],
        },
        {
          month: "MARCH",
          data: [
            {
              id: 601,
              shift: "10th March - Shift-1",
              shiftDataUrl: "JeeMains_Two.json",
            },
            {
              id: 602,
              shift: "10th March - Shift-2",
              shiftDataUrl: "JeeMains_Two.json",
            },
          ],
        },
      ],
    },
  ],
};

const QuestionBank = () => {
  const { id } = useLocalSearchParams();
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedYearsData, setselectedYearsData] = useState(null);
  console.log(id, "this is the id");
  const [idPrams, setIdPrams] = useState();
  useEffect(() => {
    if (id) {
      const examId = parseInt(id);
      setIdPrams(examId);
    } else {
      console.log("Id is not present here");
    }
  });
  const [selectedMonthData, setSelectedMonthData] = useState(null);

  const handleYearClick = (year, yearData) => {
    console.log("In handle year click", yearData);
    console.log("year data", year);
    setselectedYearsData(yearData);
    setSelectedMonthData(null);
    setSelectedShiftData([]);
    setSelectedSubjectData([]);
  };
  useEffect(() => {
    console.log(selectedYearsData, "this is the selected ear data");
  }, [selectedYearsData]);
  const handleMonthClick = (monthItem) => {
    console.log("this is the month thtat is clicked", monthItem);
    setSelectedMonthData(monthItem);
  };
  useEffect(() => {
    console.log(selectedMonthData);
  }, [selectedMonthData]);

  const getDataFromBlob = async (fileName) => {
    try {
      const sasTokenForContainer = `sp=rac&st=2024-12-19T05:18:08Z&se=2025-01-30T13:18:08Z&spr=https&sv=2022-11-02&sr=c&sig=1hvCOoVr8wB%2FQhXf%2BIlLx4YMUIStHoKo%2FbybpET2MPM%3D`;
      const containerUrl = `https://egradstorage.blob.core.windows.net/downloads-json-files1`;
      const generatedToken = `https://egradstorage.blob.core.windows.net/downloads-json-files1?sp=r&st=2024-12-13T11:42:41Z&se=2024-12-25T19:42:41Z&spr=https&sv=2022-11-02&sr=c&sig=MLecJvBDMB6bP2ZuxDqnD6BKxGaYi3LKwPmfzEl41ck%3D`;
   const sasUrl=`https://egradstorage.blob.core.windows.net/downloads-json-files1?sp=rac&st=2024-12-19T05:18:08Z&se=2025-01-30T13:18:08Z&spr=https&sv=2022-11-02&sr=c&sig=1hvCOoVr8wB%2FQhXf%2BIlLx4YMUIStHoKo%2FbybpET2MPM%3D`; 
      const urlForFile = `${containerUrl}/${fileName}?${sasTokenForContainer}`;
      const response = await fetch(`${urlForFile}`);
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        console.log("Data fetched successfully:", data);
        return data;
      } else {
        console.error("Failed to fetch data. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching data from Blob:", error);
    }
  };
  const [selectedShiftData, setSelectedShiftData] = useState([]);
  const handleShiftClick = async (shiftData) => {
    console.log("in handle shift click", shiftData.shiftDataUrl);
    const response = await getDataFromBlob(shiftData.shiftDataUrl);
    console.log(response, "this is the response in handle shift click");
    setSelectedShiftData(response);
    // i have to fetch from the blob
    // then set questions, map options and apply the functionality onclick that's it.
  };
  useEffect(() => {
    console.log("this is the shift data", selectedShiftData);
  }, [selectedShiftData]);
  const [selectedSubjectData, setSelectedSubjectData] = useState([]);
  const handleSubjectClick = (subject) => {
    console.log(subject, "this is the selected subject");
    setSelectedSubjectData(subject);
  };
  useEffect(() => {
    console.log(selectedSubjectData, "this is selected subject data");
  }, [selectedSubjectData]);
  const getUniqueQuestionid = (subName, secName, qId) => {
    // selectedSub_sectionIndex_questionId;
    // so i need to get the questionUniqueId then stre that in the userResponses array,
    const qUniqueId = `${subName}_${secName}_${qId}`;
    return qUniqueId;
  };
  const handleOptionPress = (
    optItem,
    subjectName,
    sectionName,
    answer,
    questionImgData
  ) => {
    console.log(
      "subjectName",
      subjectName,
      "sectionName:",
      sectionName,
      "this is the section name",
      questionImgData.question_id,"this is the quesiton i d "
    );

    console.log("In option Img press function", optItem.option_index, answer);
    // comparing the optionInndex of user with the answer
    console.log(questionImgData, "this is the question image data");
    const uniqueQId = getUniqueQuestionid(subjectName, sectionName,questionImgData.question_id);
    console.log(uniqueQId, "this is the quesitonUniqueId");

    const isAnsCorrect = optItem.option_index == answer;
    if (isAnsCorrect) {
      console.log("these are correct");
    } else {
      console.log("Nope not correct");
    }
  };

  return (
    <SafeAreaView style={qbStyles.safeAreaViewInQB}>
      <ScrollView>
        <View>
          <Text>This is the Particular question bank</Text>
          {idPrams}
          {data ? (
            <View style={{ display: "flex", flexDirection: "row", gap: 20 }}>
              {Object.keys(data).map((item, index) => (
                <View
                  style={{ display: "flex", flexDirection: "row", gap: 20 }}
                  key={index}
                >
                  <TouchableOpacity
                    onPress={() => handleYearClick(item, data[item])}
                    style={{ border: "1px solid black", padding: 20 }}
                  >
                    <Text> {item}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View>
              <Text>No data available</Text>
            </View>
          )}
          {selectedYearsData && (
            <View>
              {selectedYearsData[0].months.map((monthItem, index) => (
                <View key={index}>
                  <TouchableOpacity onPress={() => handleMonthClick(monthItem)}>
                    <Text> {monthItem.month}</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {selectedMonthData && (
                <View>
                  {selectedMonthData.data.map((shiftItem, index) => (
                    <View key={index}>
                      <TouchableOpacity
                        onPress={() => handleShiftClick(shiftItem)}
                      >
                        <Text>{shiftItem.shift}</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
        <View>
          <View style={qbStyles.btnContainer}>
            {selectedShiftData &&
              selectedShiftData.map((shiftItem, index) => (
                <View key={index}>
                  <TouchableOpacity
                    style={qbStyles.subBtn}
                    onPress={() => handleSubjectClick(shiftItem)}
                  >
                    <Text> {shiftItem.SubjectName}</Text>
                  </TouchableOpacity>
                </View>
              ))}
          </View>
          {selectedSubjectData.sections &&
            selectedSubjectData.sections.map((sections, index) => (
              <View key={index}>
                {/* <Text>{sections.SectionName}</Text> */}
                {sections.questions.map((questionImg, indexForQ) => (
                  <View
                    key={indexForQ}
                    style={qbStyles.questionOptionsContainer}
                  >
                    <View>
                      <Text>Question No.{questionImg.question_id}</Text>
                      <View style={qbStyles.qImgContainer}>
                        <img
                          style={qbStyles.qImg}
                          src={`${questionImg.questionImgName}`}
                        />
                      </View>
                      <Text>{questionImg.qtype}</Text>
                      {questionImg.qtype === "NATI" ? (
                        <View style={qbStyles.natiInputDiv}>
                          <input
                            type="number"
                            placeholder="Enter your answer"
                            style={qbStyles.natInput}
                          />
                          <TouchableOpacity style={qbStyles.natiSubmit}>
                            <Text style={{ color: "white" }}>Submit</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        ""
                      )}
                      {/*  i need to get options image here */}
                      {questionImg.options &&
                        questionImg.options.map((question, index) => (
                          <TouchableOpacity
                            key={index}
                            style={qbStyles.optionIndexContainer}
                            onPress={() =>
                              handleOptionPress(
                                question,
                                selectedSubjectData.SubjectName,
                                sections.SectionName,
                                questionImg.answer,
                                questionImg
                              )
                            }
                          >
                            <TouchableOpacity>
                              <Text style={qbStyles.optionIndex}>
                                {question.option_index}
                              </Text>
                            </TouchableOpacity>

                            <View style={qbStyles.optionImgContainer}>
                              <img
                                src={question.optionImgName}
                                style={qbStyles.optionImg}
                              />
                            </View>
                          </TouchableOpacity>
                        ))}
                    </View>
                  </View>
                ))}
              </View>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default QuestionBank;
