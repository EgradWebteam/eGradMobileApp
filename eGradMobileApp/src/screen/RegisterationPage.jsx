import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, Image, StyleSheet, Alert, Modal, FlatList,
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import CalendarPicker from 'react-native-calendar-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import stateList from "./StatesJson.json";
import districtsMap from "./DistrictsJson.json";
// import { BASE_URL, frontEndURL } from "../../../ConfigFile/ApiConfigURL";

 const qualificationOptions = [
  "B.Tech",
  "B.Sc",
  "B.E",
  "Other"
];

const streamOptions = {
  "B.Tech": [
    "Computer Science and Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electronics and Communication Engineering",
    "Electrical Engineering",
    "Instrumentation Engineering",
    "Chemical Engineering",
    "Metallurgical Engineering",
    "Production and Industrial Engineering",
    "Aerospace Engineering",
    "Engineering Sciences",
    "Data Science and Artificial Intelligence",
    "Other"
  ],
  "B.E": [
    "Computer Science and Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electronics and Communication Engineering",
    "Electrical Engineering",
    "Instrumentation Engineering",
    "Chemical Engineering",
    "Metallurgical Engineering",
    "Production and Industrial Engineering",
    "Electronics and Telecommunications Engineering",
    "Other"
  ],
  "B.Sc": [
    "Mathematics",
    "Physics",
    "Statistics",
    "Computer Science and Engineering",
    "Data Science and Artificial Intelligence",
    "Other"
  ],
  "Other": [
    "Other"
  ]
};
const FILE_SIZE_RULES = {
  uploadedPhoto: { min: 15, max: 200, message: "Uploaded Photo must be between 15KB and 200KB." },
  proof: { min: 15, max: 200, message: "Proof must be between 15KB and 200KB." },
};
const currentYear = new Date().getFullYear();
const years = [];
for (let i = currentYear + 3; i >= currentYear - 10; i--) years.push(i);

export const RegisterationPage = ({ navigation }) => {
  const hasFetchedRef = useRef(false);

  const [formData, setFormData] = useState({
    candidateName: "", dateOfBirth: "",
    gender: "", category: "",
    emailId: "", confirmEmailId: "",
    contactNo: "", fatherName: "",
    EmailId: "", mobileNo: "",
    line1: "", city: "", state: "", districts: "", pincode: "",
    qualifications: "", qualificationsOther: "",
    stream: "", streamOther: "",
    nameOfCollege: "", passingYear: "", marks: "",
    uploadedPhoto: null, proof: null,
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const [districtOptions, setDistrictOptions] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [showTerms, setShowTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [portalId, setPortalId] = useState(null);
  const [collegeModalVisible, setCollegeModalVisible] = useState(false);
 const [showCalendar, setShowCalendar] = useState(false);
  const colleges = ["College A", "College B", "College C"]; // Replace with your actual list

  const validateForm = () => {
    const validationErrors = {};
    const requiredFields = [
      "candidateName", "dateOfBirth", "gender", "category",
      "emailId", "confirmEmailId", "contactNo", "fatherName",
      "EmailId", "mobileNo", "line1", "city", "state", "pincode",
      "nameOfCollege", "passingYear", "marks", "uploadedPhoto", "proof",
    ];

    requiredFields.forEach(field => {
      if (!formData[field] || (typeof formData[field] === "string" && formData[field].trim() === "")) {
        validationErrors[field] = `${field} is required.`;
      }
    });

    if (formData.emailId !== formData.confirmEmailId) {
      validationErrors.confirmEmailId = "Email and Confirm Email must match.";
    }
    if (formData.mobileNo?.length !== 10) {
      validationErrors.mobileNo = "Mobile number must be exactly 10 digits.";
    }
    if (formData.contactNo?.length !== 10) {
      validationErrors.contactNo = "Contact number must be exactly 10 digits.";
    }
    if (formData.pincode?.length !== 6) {
      validationErrors.pincode = "Pincode must be exactly 6 digits.";
    }
    if (!formData.termsAccepted) {
      validationErrors.termsAccepted = "You must accept the terms and conditions.";
    }

    return validationErrors;
  };

  const handleChange = (name, value) => {
    let error = "";

    if (["candidateName", "fatherName"].includes(name)) {
      if (!/^[A-Za-z\s]*$/.test(value)) {
        error = `${name === "candidateName" ? "Candidate Name" : "Father Name"} must contain only alphabets and spaces.`;
      } else if (value.length > 50) {
        error = `${name === "candidateName" ? "Candidate Name" : "Father Name"} cannot exceed 50 characters.`;
      }
    }

    if (["nameOfCollege", "streamOther", "qualificationsOther"].includes(name)) {
      if (!/^[A-Za-z\s]*$/.test(value)) {
        error = `${name} must only contain alphabets and spaces.`;
      } else if (value.length > 50) {
        error = `${name} cannot be more than 50 characters.`;
      }
    }

    if (name === "dateOfBirth") {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setFullYear(today.getFullYear() - 10);
      if (selectedDate > today) {
        error = "You must be at least 10 years old.";
      }
    }

    if (["city", "districts"].includes(name)) {
      if (!/^[A-Za-z\s]*$/.test(value)) {
        error = `${name} must only contain alphabets and spaces.`;
      } else if (value.length > 30) {
        error = `${name} cannot be more than 30 characters.`;
      }
    }

    if (["contactNo", "mobileNo"].includes(name)) {
      if (/[^0-9]/.test(value)) {
        error = "Only numbers are allowed for Contact number.";
      } else if (value.length > 10) {
        error = "Contact number must contain exactly 10 digits.";
      }
    }

    if (name === "pincode") {
      if (/[^0-9]/.test(value)) {
        error = "Only numbers are allowed for Pincode.";
      } else if (value.length > 6) {
        error = "Pincode must be exactly 6 digits.";
      }
    }

    if (name === "marks") {
      if (value < 0 || value > 100 || isNaN(value) || value.length > 3) {
        error = "Percentage must be between 0 and 100.";
      }
    }

    if (name === "line1" && value.length > 60) {
      error = `${name} cannot be more than 50 characters.`;
    }

    if (name === "state") {
      const selectedState = stateList.find(s => s.state_name === value);
      const stateId = selectedState?.state_id;
      setDistrictOptions(stateId && districtsMap[stateId]
        ? Object.entries(districtsMap[stateId])
        : []);
      setFormData(prev => ({ ...prev, state: value, districts: "" }));
      setErrors(prev => ({ ...prev, state: "", districts: "" }));
      return;
    }

    if (name === "qualifications") {
      setFormData(prev => ({ ...prev, qualifications: value, stream: "" }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const pickImage = (field) => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage);
        return;
      }
      const file = response.assets[0];
      setFormData(prev => ({ ...prev, [field]: file }));
      field === "uploadedPhoto" ? setPhotoPreview(file.uri) : setProofPreview(file.uri);
    });
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Alert.alert("Validation Error", "Please complete all required fields correctly.");
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val !== null) fd.append(key, val);
      });

      // Example API call structure:
      // const response = await fetch(`${BASE_URL}/login/studentRegistration`, {
      //   method: "POST", body: fd
      // });
      // const result = await response.json();

      // Mock response handling:
      // if (result.message === "Your email already exists.") …
      // else if (result.success) …

      Alert.alert("Success", "Registration simulated successfully!");
      navigation.navigate("LoginPage");
    } catch (err) {
      Alert.alert("Error", "Something went wrong. Please try again later.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    (async () => {
      // Simulated fetch:
      // const resp = await fetch(`${BASE_URL}/navbar/get-logo`, { … });
      // const data = await resp.json();
      // setPortalId(data.portalId);
      setPortalId(1); // Stub for UI path
    })();
  }, []);

  const renderRadioGroup = (options, selected, onSelect) => (
    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
      {options.map(opt => (
        <TouchableOpacity
          key={opt}
          style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}
          onPress={() => onSelect(opt)}
        >
          <View style={{
            height: 20, width: 20, borderRadius: 10,
            borderWidth: 1, borderColor: '#000',
            alignItems: 'center', justifyContent: 'center',
            marginRight: 5
          }}>
            {selected === opt && <View style={{
              height: 12, width: 12, borderRadius: 6,
              backgroundColor: '#007AFF'
            }} />}
          </View>
          <Text>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Student Registration</Text>

      {/* Personal Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Details</Text>
 <Text style={styles.label}>Candidate Name</Text>
        <TextInput
          style={styles.input} placeholder="Candidate Name"
          value={formData.candidateName}
          onChangeText={text => handleChange("candidateName", text)}
        />
        {errors.candidateName && <Text style={styles.error}>{errors.candidateName}</Text>}

      <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity onPress={() => setShowCalendar(true)}>
          <TextInput
            style={styles.input}
            value={formData.dateOfBirth}
            placeholder="Select Date of Birth"
            editable={false}
          />
        </TouchableOpacity>
        {showCalendar && (
          <CalendarPicker
            maxDate={new Date()}
            onDateChange={date => {
              handleChange("dateOfBirth", date.format("YYYY-MM-DD"));
              setShowCalendar(false);
            }}
            selectedDayColor="#007AFF"
            selectedDayTextColor="#FFF"
          />
        )}

        {errors.dateOfBirth && <Text style={styles.error}>{errors.dateOfBirth}</Text>}

        <Text style={styles.label}>Gender</Text>
        {renderRadioGroup(["Male", "Female", "Other"], formData.gender, val => handleChange("gender", val))}
        {errors.gender && <Text style={styles.error}>{errors.gender}</Text>}

        <Text style={styles.label}>Category</Text>
        {renderRadioGroup(["OC", "BC", "SC", "ST"], formData.category, val => handleChange("category", val))}
        {errors.category && <Text style={styles.error}>{errors.category}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Email ID"
          value={formData.emailId}
          onChangeText={text => handleChange("emailId", text)}
          keyboardType="email-address" autoCapitalize="none"
        />
        {errors.emailId && <Text style={styles.error}>{errors.emailId}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Confirm Email ID"
          value={formData.confirmEmailId}
          onChangeText={text => handleChange("confirmEmailId", text)}
          keyboardType="email-address" autoCapitalize="none"
        />
        {errors.confirmEmailId && <Text style={styles.error}>{errors.confirmEmailId}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          value={formData.contactNo}
          onChangeText={text => handleChange("contactNo", text)}
          keyboardType="phone-pad"
        />
        {errors.contactNo && <Text style={styles.error}>{errors.contactNo}</Text>}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Parents/Guardian Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Father's Name"
          value={formData.fatherName}
          onChangeText={text => handleChange("fatherName", text)}
        />
        {errors.fatherName && <Text style={styles.error}>{errors.fatherName}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Father's Email"
          value={formData.EmailId}
          onChangeText={text => handleChange("EmailId", text)}
          keyboardType="email-address" autoCapitalize="none"
        />
        {errors.EmailId && <Text style={styles.error}>{errors.EmailId}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Father's Phone"
          value={formData.mobileNo}
          onChangeText={text => handleChange("mobileNo", text)}
          keyboardType="phone-pad"
        />
        {errors.mobileNo && <Text style={styles.error}>{errors.mobileNo}</Text>}
      </View>

      {/* Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Address Line 1"
          value={formData.line1}
          onChangeText={text => handleChange("line1", text)}
        />
        {errors.line1 && <Text style={styles.error}>{errors.line1}</Text>}

        <TextInput
          style={styles.input}
          placeholder="City"
          value={formData.city}
          onChangeText={text => handleChange("city", text)}
        />
        {errors.city && <Text style={styles.error}>{errors.city}</Text>}

       
  <Text style={styles.label}>State</Text>
<View style={styles.pickerContainer}>
  <Picker
    selectedValue={formData.state}
    onValueChange={(value) => handleChange("state", value)}
  >
    <Picker.Item label="Select State" value="" />
    {stateList.map((state) => (
      <Picker.Item key={state.state_id} label={state.state_name} value={state.state_name} />
    ))}
  </Picker>
</View>
{errors.state && <Text style={styles.error}>{errors.state}</Text>}
      

        <TextInput
          style={styles.input}
          placeholder="Pincode"
          value={formData.pincode}
          onChangeText={text => handleChange("pincode", text)}
          keyboardType="number-pad"
        />
        {errors.pincode && <Text style={styles.error}>{errors.pincode}</Text>}
      </View>

      {/* Academic Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Academic Details</Text>

     

         
  {portalId === 1 && (
    <>
      <Text style={styles.label}>Qualifications *</Text>
      {renderRadioGroup(["Appearing XII", "Passed XII"], formData.qualifications, val => handleChange("qualifications", val))}
      {errors.qualifications && <Text style={styles.error}>{errors.qualifications}</Text>}
    </>
  )}

  {/* === PORTAL ID === 2 === */}
  {portalId === 2 && (
    <>
      <Text style={styles.label}>Qualifications *</Text>
      <View style={styles.pickerContainer}>
    <Picker
      selectedValue={formData.qualifications}
      onValueChange={(value) => handleChange("qualifications", value)}
    >
      <Picker.Item label="Select Qualification" value="" />
      {qualificationOptions.map((q) => (
        <Picker.Item key={q} label={q} value={q} />
      ))}
    </Picker>
  </View>
      {errors.qualifications && <Text style={styles.error}>{errors.qualifications}</Text>}

      {formData.qualifications === "Other" && (
        <>
          <Text style={styles.label}>Enter Your Qualification *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your qualification"
            value={formData.qualificationsOther}
            onChangeText={(text) => handleChange("qualificationsOther", text)}
          />
        </>
      )}

      <Text style={styles.label}>Stream *</Text>
     <View style={styles.pickerContainer}>
    <Picker
      selectedValue={formData.stream}
      onValueChange={(value) => handleChange("stream", value)}
    >
      <Picker.Item label="Select Stream" value="" />
      {(streamOptions[formData.qualifications] || []).map((stream) => (
        <Picker.Item key={stream} label={stream} value={stream} />
      ))}
    </Picker>
  </View>
      {errors.stream && <Text style={styles.error}>{errors.stream}</Text>}

      {formData.stream === "Other" && (
        <>
          <Text style={styles.label}>Enter Your Stream *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your stream"
            value={formData.streamOther}
            onChangeText={(text) => handleChange("streamOther", text)}
          />
        </>
      )}
    </>
  )}
        <Text style={styles.label}>Name of College</Text>
      <TextInput
          style={styles.input}
          placeholder="nameOfCollege"
          value={formData.nameOfCollege}
          onChangeText={text => handleChange("nameOfCollege", text)}
          keyboardType=""
        />
        {errors.nameOfCollege && <Text style={styles.error}>{errors.nameOfCollege}</Text>}

        <Text style={styles.label}>Passing Year</Text>
      <View style={styles.pickerContainer}>
  <Picker
    selectedValue={formData.passingYear}
    onValueChange={(value) => handleChange("passingYear", value)}
  >
    <Picker.Item label="Select Passing Year" value="" />
    {years.map((year) => (
      <Picker.Item key={year} label={year.toString()} value={year.toString()} />
    ))}
  </Picker>
</View>
        {errors.passingYear && <Text style={styles.error}>{errors.passingYear}</Text>}
 <Text style={styles.label}>Marks(%)</Text>
        <TextInput
          style={styles.input}
          placeholder="Percentage Marks"
          value={formData.marks}
          onChangeText={text => handleChange("marks", text)}
          keyboardType="numeric"
        />
        {errors.marks && <Text style={styles.error}>{errors.marks}</Text>}
      </View>

      {/* College Selection Modal */}


      {/* Uploads */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upload Documents</Text>

        <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage("uploadedPhoto")}>
          <Text style={styles.uploadButtonText}>Upload Photo</Text>
        </TouchableOpacity>
        {photoPreview && <Image source={{ uri: photoPreview }} style={styles.previewImage} />}
        {errors.uploadedPhoto && <Text style={styles.error}>{errors.uploadedPhoto}</Text>}

        <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage("proof")}>
          <Text style={styles.uploadButtonText}>Upload Proof</Text>
        </TouchableOpacity>
        {proofPreview && <Image source={{ uri: proofPreview }} style={styles.previewImage} />}
        {errors.proof && <Text style={styles.error}>{errors.proof}</Text>}
      </View>

      {/* Terms & Conditions */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.termsButton} onPress={() => setShowTerms(!showTerms)}>
          <Text style={styles.termsButtonText}>
            {showTerms ? "Hide Terms and Conditions" : "Show Terms and Conditions"}
          </Text>
        </TouchableOpacity>
        {/* {showTerms && <TermsAndConditions />} */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setFormData(prev => ({ ...prev, termsAccepted: !prev.termsAccepted }))}
          >
            {formData.termsAccepted && <View style={styles.checkedBox} />}
          </TouchableOpacity>
          <Text>I accept the terms and conditions</Text>
        </View>
        {errors.termsAccepted && <Text style={styles.error}>{errors.termsAccepted}</Text>}
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
 pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 5,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 10,
    width: '100%',
  },
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginBottom: 5 },
  error: { color: "red", marginBottom: 10 },
  label: { fontWeight: "bold", marginTop: 10, marginBottom: 5 },
  option: { padding: 10, marginVertical: 3, marginRight: 5, borderWidth: 1, borderColor: "#ccc", borderRadius: 5 },
  selectedOption: { backgroundColor: "#cce5ff", borderColor: "#007bff" },
  districtOption: { padding: 10, marginVertical: 3, borderWidth: 1, borderColor: "#ccc", borderRadius: 5 },
  selectedDistrict: { backgroundColor: "#d4edda", borderColor: "#28a745" },
  uploadButton: { backgroundColor: "#007bff", padding: 10, borderRadius: 5, marginVertical: 10, alignItems: "center" },
  uploadButtonText: { color: "#fff", fontWeight: "bold" },
  previewImage: { width: 100, height: 100, marginVertical: 10, borderRadius: 5 },
  termsButton: { backgroundColor: "#6c757d", padding: 10, borderRadius: 5, marginBottom: 10, alignItems: "center" },
  termsButtonText: { color: "#fff", fontWeight: "bold" },
  checkboxContainer: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: "#000", marginRight: 10, justifyContent: "center", alignItems: "center" },
  checkedBox: { width: 14, height: 14, backgroundColor: "#007bff" },
  submitButton: { backgroundColor: "#28a745", padding: 15, borderRadius: 5, alignItems: "center" },
  disabledButton: { backgroundColor: "#6c757d" },
  submitButtonText: { color: "#fff", fontWeight: "bold" },
});
