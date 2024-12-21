import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
// import { ScrollView, View } from "react-native-web";
import { TouchableOpacity,Text ,ScrollView, View,Image } from "react-native";
import qbStyles from "../styles/qbStyles";
const dataForQuestions = {
  id: 1,
  2024: [
    {
      year: 2024,
      months: [
        {
          month: "JANUARY",
          data: [
            {
              id: 501,
              shift: "10th Jan - Shift-1",
              shiftDataUrl: "JeeMains.json",
            },
            {
              id: 502,
              shift: "10th Jan - Shift-2",
              shiftDataUrl: "FinalTest.json",
            },
          ],
        },
      ],
    },
  ],
  2023: [
    {
      year: 2023,
      months: [
        {
          month: "JANUARY",
          data: [
            {
              id: 701,
              shift: "10th Jan - Shift-1",
              shiftDataUrl: "JeeMains_Two.json",
            },
            {
              id: 702,
              shift: "10th Jan - Shift-2",
              shiftDataUrl: "FinalTest.json",
            },
          ],
        },
      ],
    },
  ],
};
const QuestionBankPage = ({ route }) => {
  const { id } = route.params;
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


  const getDataFromBlob = async (shiftDataUrl) => {
    try {
      // Base URL of your Azure Blob Storage container
      const BASE_BLOB_URL =
        "https://egradstorage.blob.core.windows.net/downloads-json-files1/downloads-json-files1/";
    
      const blobUrl = `${BASE_BLOB_URL}${shiftDataUrl}`;

      console.log("Generated Blob URL:", blobUrl); // Log the URL for verification

      // Fetch the data from the blob storage
      const response = await fetch(blobUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch data from blob");
      }

      const data = await response.json();
      console.log("Fetched JSON data:", data); // Log the fetched data

      return data;
    } catch (error) {
      console.error("Error fetching data from blob:", error);
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
      questionImgData.question_id,
      "this is the quesiton i d "
    );

    console.log("In option Img press function", optItem.option_index, answer);
    // comparing the optionInndex of user with the answer
    console.log(questionImgData, "this is the question image data");
    const uniqueQId = getUniqueQuestionid(
      subjectName,
      sectionName,
      questionImgData.question_id
    );
    console.log(uniqueQId, "this is the quesitonUniqueId");

    const isAnsCorrect = optItem.option_index == answer;
    if (isAnsCorrect) {
      console.log("these are correct");
    } else {
      console.log("Nope not correct");
    }
  };

  return (
    <SafeAreaView style={[qbStyles.safeAreaViewInQB,{flex:1}]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} >
        <View style={{ flex: 1 }}>
        <View>
           <Text>Question bank page {id}</Text> 
           </View>
        <View style={{ flex: 1 }}>
        {dataForQuestions ? (
            <View style={{ display: "flex", flexDirection: "row", gap: 20 }}>
              {Object.keys(dataForQuestions).map((item, index) => (
                <View
                  style={{ display: "flex", flexDirection: "row", gap: 20 }}
                  key={index}
                >
                  <TouchableOpacity
                    onPress={() => handleYearClick(item, dataForQuestions[item])}
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
                    // <View key={index}>
                      <TouchableOpacity key={index}
                        onPress={() => handleShiftClick(shiftItem)}
                      >
                        <Text>{shiftItem.shift}</Text>
                      </TouchableOpacity>
                    // </View>
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
                        // source={{uri:`${questionImg.questionImgName}`}}
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
                          <View
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
                          </View>
                        ))}
                    </View>
                  </View>
                ))}
              </View>
            ))}
        </View>
        </View>
      </ScrollView>
     </SafeAreaView>
  );
};

export default QuestionBankPage;
