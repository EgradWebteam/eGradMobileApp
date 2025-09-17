import React from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
} from "react-native";

import videoIcon from "../assets/video.png";
import exerciseIcon from "../assets/excercise.png";
import pdfIcon from "../assets/pdf.png";

const LectureExerciseListNative = ({
    lectures,
    onLectureClick,
    onExerciseClick,
    StudyMaterial,
}) => {
    const formatVideoTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return h > 0
            ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
            : `${m}:${String(s).padStart(2, "0")}`;
    };

    const handleOpenPdf = (pdfFile) => {
        alert(`Open PDF: ${pdfFile}`);
    };

    return (
        <ScrollView style={styles.container}>
            {/* Lectures */}
            {lectures.map((lecture) => (
                <View key={lecture.orvl_lecture_name_id} style={styles.lectureCard}>
                    <View style={styles.row}>
                        <Image source={videoIcon} style={styles.icon} />
                        <View style={styles.info}>
                            <Text style={styles.title}>{lecture.orvl_lecture_name}</Text>
                            <Text>Duration: {formatVideoTime(lecture.orvl_lecture_duration)}</Text>
                            <TouchableOpacity
                                style={styles.startButtonLec}
                                onPress={() => onLectureClick(lecture)}
                            >
                                <Text style={styles.buttonText}>Start Lecture</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ))}

            {/* Exercises */}
            {lectures.map((lecture) =>
                lecture.exercises.map((exercise) => (
                    <View key={exercise.exercise_name_id} style={styles.exerciseCard}>
                        <View style={styles.row}>
                            <Image source={exerciseIcon} style={styles.icon} />
                            <View style={styles.info}>
                                <Text style={styles.title}>{exercise.exercise_name}</Text>
                                <Text>Questions: {exercise.questions.length}</Text>
                                <TouchableOpacity
                                    style={styles.startButtonExe}
                                    onPress={() => onExerciseClick(exercise)}
                                >
                                    <Text style={styles.buttonText}>Start Exercise</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))
            )}

            {/* PDFs */}
            {lectures.map((lecture) =>
                lecture.study_material_pdfs?.map((pdf) => (
                    <View key={pdf.study_material_id} style={styles.pdfCard}>
                        <View style={styles.row}>
                            <Image source={pdfIcon} style={styles.icon} />
                            <View style={styles.info}>
                                <Text>{pdf.study_material_pdf.split("/").pop()}</Text>
                                <TouchableOpacity
                                    style={styles.startButtonDoc}
                                    onPress={() => handleOpenPdf(pdf.study_material_pdf)}
                                >
                                    <Text style={styles.buttonText}>Open Document</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))
            )}

            {/* Global Study Material */}
            {StudyMaterial?.map((material) => (
                <View key={material.study_material_id} style={styles.pdfCard}>
                    <View style={styles.row}>
                        <Image source={pdfIcon} style={styles.icon} />
                        <View style={styles.info}>
                            <Text>
                                {material.study_material_pdf
                                    .split("/")
                                    .pop()
                                    .split("_")
                                    .slice(1)
                                    .join("_")
                                    .replace(/\.pdf$/i, "")}{" "}
                                Document
                            </Text>
                            <TouchableOpacity
                                style={styles.startButtonDoc}
                                onPress={() => handleOpenPdf(material.study_material_pdf)}
                            >
                                <Text style={styles.buttonText}>Open Document</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

export default LectureExerciseListNative;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    row: { flexDirection: "row", alignItems: "center" },
    icon: { width: 40, height: 40, marginRight: 10 },
    info: { flex: 1 },
    title: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },

    // Buttons
    startButtonLec: {
        marginTop: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        alignSelf: "flex-start",
        backgroundColor: "#ff5050", // lecture button
    },
    startButtonExe: {
        marginTop: 5,
        backgroundColor: "#548235", // exercise button
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        alignSelf: "flex-start",
    },
    startButtonDoc: {
        marginTop: 5,
        backgroundColor: "#bf9000", // doc button
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        alignSelf: "flex-start",
    },
    buttonText: { color: "#fff", fontWeight: "bold" },

    // Cards
    lectureCard: {
        backgroundColor: "#ffcccc",
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
    },
    exerciseCard: {
        backgroundColor: "#e2f0d9",
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
        elevation: 2,
    },
    pdfCard: {
        backgroundColor: "#fff2cc",
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
        elevation: 2,
    },
});
