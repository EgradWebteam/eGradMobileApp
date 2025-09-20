import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";

const PracticeSummaryModal = ({ visible, summary, onAttemptNow, onClose }) => {
    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose} // Android back button
        >
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    <Text style={styles.header}>Exam Summary</Text>

                    <View style={styles.summaryStatsContainer}>
                        <Text style={styles.timeText}>⏱ Time Spent: {summary.timeSpent}</Text>

                        <View style={styles.statsList}>
                            <View style={styles.row}>
                                <Text>Total Correct Answers:</Text>
                                <Text style={styles.count}>{summary.correct}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text>Total Incorrect Answers:</Text>
                                <Text style={styles.count}>{summary.incorrect}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text>Total Partial Answers:</Text>
                                <Text style={styles.count}>{summary.partial}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text>Total Unattempted Questions:</Text>
                                <Text style={styles.count}>{summary.unattempted}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.actions}>
                        {summary.unattempted > 0 ? (
                            <>
                                <Text style={styles.warningText}>
                                    You still have{" "}
                                    <Text style={styles.bold}>{summary.unattempted}</Text>{" "}
                                    {summary.unattempted === 1 ? "question" : "questions"} unattempted.
                                    {"\n"}Do you want to attempt them now, or just{" "}
                                    <Text style={styles.bold}>submit without attempting</Text>?
                                </Text>

                                <View>
                                    <TouchableOpacity style={styles.attemptBtn} onPress={onAttemptNow}>
                                        <Text style={styles.buttonText}>Attempt Now</Text>
                                    </TouchableOpacity>

                                </View>
                                <View>
                                    <TouchableOpacity style={styles.submitBtn} onPress={onClose}>
                                        <Text style={styles.buttonText}>Submit</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};


const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "#fff", // dark transparent overlay
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalBox: {
        backgroundColor: "#f9fafb",
        borderRadius: 16,
        padding: 24,
        width: "90%",
        maxWidth: 400,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 10,
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    timeText: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 15,
        textAlign: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    count: { fontWeight: "bold" },
    warningText: {
        textAlign: "center",
        marginBottom: 15,
        fontSize: 14,
        color: "#444",
    },
    bold: { fontWeight: "bold" },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    attemptBtn: {
        backgroundColor: "rgb(69, 140, 207)",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom:10,
    },
    submitBtn: {
        backgroundColor: "rgb(245, 97, 97)",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    closeBtn: {
        backgroundColor: "#2196F3",
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        alignSelf: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        textAlign: "center",
    },
});


export default PracticeSummaryModal;