import { SafeAreaView } from "react-native-safe-area-context";
import { View,Text } from "react-native";
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from "react";

const QuestionBank=()=>{;
    const {id}=useLocalSearchParams();
    console.log(id,"this is the id");
    const[idPrams,setIdPrams]=useState()
    useEffect(()=>{
        if(id){
            const examId=parseInt(id)
            setIdPrams(examId)
        }else{
            console.log("Id is not present here");
        }
    })

    return(
        <SafeAreaView>
            <View>
                <Text>This is the Particular question bank</Text>
                {idPrams==="1"?(
                    <Text>This is the div for qId 1</Text>
                ):(
                    <Text>This is the div for qId 2</Text>
                )}
            </View>
        </SafeAreaView>
    )
}
export default QuestionBank;