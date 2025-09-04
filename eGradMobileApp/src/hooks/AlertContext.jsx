import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

const AlertProvider = ({ children }) => {
  const [alertMessage, setAlertMessage] = useState(null);
  const [resolveCallback, setResolveCallback] = useState(null);

  const alert = useCallback((message) => {
    setAlertMessage(message);
    return new Promise((resolve) => {
      setResolveCallback(() => resolve); // Save the resolver
    });
  }, []);

  const hideAlert = () => {
    setAlertMessage(null);
    if (resolveCallback) {
      resolveCallback(); // resolve the promise
      setResolveCallback(null);
    }
  };

  return (
    <AlertContext.Provider value={{ alert }}>
      {children}
      <Modal
        transparent
        visible={!!alertMessage}
        animationType="fade"
        onRequestClose={hideAlert}
      >
        <View style={styles.modalBackground}>
          <View style={styles.alertBox}>
            <Text style={styles.messageText}>{alertMessage}</Text>
            <TouchableOpacity style={styles.button} onPress={hideAlert}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </AlertContext.Provider>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
  },
  messageText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2196F3",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 100,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default AlertProvider;
