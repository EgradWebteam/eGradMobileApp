import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  navbarcontainer: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
   timersection: {
    paddingVertical: 4,         // very small vertical padding
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  subjectcontainer: {
     paddingVertical: 4,         // very small vertical padding
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  footerContainer: {
    padding: 12,

    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  questionImageContainer: {
   padding:5
  },
  mainContainerforquestion: {
    flex: 1,
    padding: 16,
    minHeight:400
   
  },
  
  optionLabel:{
    width:40
  },
  mainContainer: {
    flex: 1,
    padding: 16,
  },
  questionBtnSNMR:{
height: 45,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  instructionPoint: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 22,
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    // height: 100,
    borderRadius: 60,
  },
  studentName: {
    fontSize: 18,
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 20,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  buttonSecondary: {
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollViewContent: { padding: 16 },
 
 
  subHeadingSecondary: { fontSize: 18, fontWeight: "600", marginTop: 16, marginBottom: 8 },
  instructionContainer: { flex: 1 },
  instructionSection: { marginBottom: 20 },
 
  listItemText: { fontSize: 14, lineHeight: 20 },
  tableOfButtons: { marginVertical: 10 },
  rowTableClass: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  displayIcon: {
    width: 30,
    // height: 30,
    borderRadius: 15,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  functionimageCls: { fontWeight: "bold", fontSize: 14, color: "#000" },
  NotVisitedBehaviourBtns: { color: "#000" },
  NotAnsweredBtnCls: { color: "#f00" },
  AnswerdBtnCls: { color: "#0a0" },
  MarkedForReview: { color: "#ff8800" },
  AnsMarkedForReview: { color: "#00f" },
  forTotalWidth: { flex: 1 },
  userImageDivInst: {
    marginTop: 20,
    alignItems: "center",
  },
  userDetailsHolder: { flexDirection: "row", alignItems: "center" },
  userImageSubDiv: {
    marginRight: 10,
  },
  userImage: {
    width: 60,
    // height: 60,
    borderRadius: 30,
    resizeMode: "cover",
  },
  StdNameForData: {
    justifyContent: "center",
  },
  nextBtnDiv: {
    marginTop: 20,
    alignItems: "center",
  },
  nextBtn: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  nextBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  nextBtnArrow: {
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
    popup: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    zIndex: 1000,
  },
  warningText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
    color: "red",
  },
  warningTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e53935",
    textAlign: "center",
  },
  overlayWarning: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    backgroundColor: "yellow",
    padding: 10,
    borderRadius: 5,
    elevation: 3,
  },
    loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  warningBox: {
    backgroundColor: '#ffefc0',
    padding: 12,
    borderRadius: 5,
    marginVertical: 10
  },
  warningText: {
    color: '#8a6d3b'
  },
  timerContainer: {
    marginBottom: 20
  },
    testNameHolder: {
    alignItems: "center",
    marginBottom: 10,
  },
  //repeated
  testName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  buttonHolder: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecf0f1",
    padding: 10,
    borderRadius: 6,
  },
//   buttonText: {
//     marginLeft: 8,
//     fontSize: 14,
//     color: "#2c3e50",
//   },
   scrollContent: {
    padding: 15,
    paddingBottom: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 10,
  },
  logo: {
    width: 80,
    // height: 40,
  },
  headerRight: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "space-between",
  },

  closeBtn: {
    backgroundColor: "#ff4d4d",
    padding: 6,
    marginTop: 5,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  closeBtnText: {
    color: "#fff",
    fontSize: 14,
  },
  alertText: {
    color: "#d9534f",
    fontStyle: "italic",
    marginVertical: 10,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
//   questionContainer: {
//     marginBottom: 20,
//   },
  questionNumber: {
    fontWeight: "600",
    marginBottom: 8,
  },
  image: {
    width: "100%",
    // height: height * 0.25,
    resizeMode: "contain",
    marginVertical: 10,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  optionIndex: {
    fontWeight: "bold",
    marginRight: 8,
  },
  optionImage: {
    width: "80%",
    // height: 50,
    resizeMode: "contain",
  },
  scrollButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  scrollButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
    sectionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  timeAndCalcRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  icon: {
    marginLeft: 10,
  },
    subContainer: {
    flex: 1,
  },
  closeBtnContainer: {
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  noteText: {
    fontSize: 14,
    color: '#d00',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  headingCenter: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  section: {
    marginVertical: 10,
  },
  //repeated
  subHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  //repeated
  listItem: {
    fontSize: 14,
    marginVertical: 2,
  },
  subListItem: {
    fontSize: 13,
    marginLeft: 16,
    marginVertical: 1,
  },
  boldText: {
    fontWeight: 'bold',
  },
  statusBox: {
    marginVertical: 10,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  statusCircle: {
    width: 28,
    // height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  statusNumber: {
    color: '#000',
    fontWeight: 'bold',
  },
  statusDescription: {
    flex: 1,
    fontSize: 14,
  },
    questionNumberRow: { marginVertical: 10,
         flexDirection: 'row',
         maxHeight: 60,
         minHeight:50
         },
  questionBtn: {
    marginRight: 5,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  activeBtn: {
    backgroundColor: '#6c5ce7',
  },
  questionBtnText: {
    color: '#000',
  },
  questionContainer: {
    flex: 1,
    marginVertical: 10,
  },
  metaInfo: {
    marginBottom: 10,
  },
  questionImage: {
    width: '100%',
    // height: 200,
    marginBottom: 20,
  },
  scrollButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
    title: {
    fontWeight: "bold",
    fontSize: 18,
    marginVertical: 10,
  },
  subjectRow: {
    flexDirection: "row",
 
    marginVertical: 6,
  },
  subjectButton: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 6,
    marginLeft: 8,
  },
  subjectText: {
    fontSize: 16,
  },
  sectionButton: {
    padding: 10,
    backgroundColor: "#ddd",
    marginVertical: 4,
    borderRadius: 4,
  },
  sectionText: {
    fontSize: 15,
  },
  activeButton: {
    backgroundColor: "#6c5ce7",
  },
//   warningBox: {
//     backgroundColor: "#fff3cd",
//     padding: 10,
//     marginVertical: 10,
//     borderRadius: 6,
//   },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  confirmText: {
    color: "green",
    fontWeight: "bold",
  },
  cancelText: {
    color: "red",
    fontWeight: "bold",
  },
    btnsSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  navigationBtnHolderSubContainer: {
    flexDirection: 'row',
  },
  navigationBtnHolderSubContainerForSubmit: {
    flexDirection: 'row',
  },
//   button: {
//     backgroundColor: '#007bff',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     marginHorizontal: 4,
//     borderRadius: 4,
//   },
//   disabledButton: {
//     backgroundColor: '#aaa',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: '600',
//     textAlign: 'center',
//   },
  disabledButtonText: {
    color: '#ddd',
  },
  submitBtnCls: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  popupOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationPopup: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  popupButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  popupButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  yesButton: {
    backgroundColor: '#28a745',
  },
//   noButton: {
//     backgroundColor: '#dc3545',
//   },
  popupButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  examSummaryMainDiv: {
    marginTop: 20,
  },
  examSummarySubDiv: {
    // your styles here
  },
  //examsummmary
  scrollView: {
    paddingBottom: 40,
  },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
  summaryContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  cellLabel: {
    fontSize: 16,
    color: "#444",
  },
  cellValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  messageContainer: {
    marginTop: 20,
    alignItems: "center",
  },
//   heading: {
//     fontSize: 20,
//     fontWeight: "700",
//     marginBottom: 10,
//   },
//   subHeading: {
//     fontSize: 16,
//     marginBottom: 20,
//     textAlign: "center",
//     paddingHorizontal: 10,
//   },
  confirmationText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
  },
//   button: {
//     backgroundColor: "#007AFF",
//     paddingVertical: 12,
//     paddingHorizontal: 25,
//     borderRadius: 6,
//     marginHorizontal: 10,
//   },
//   yesButton: {
//     backgroundColor: "#28a745",
//   },
  noButton: {
    backgroundColor: "#dc3545",
  },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 16,
//   },
  submissionPopup: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  submissionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  submissionText: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: "center",
  },
  //otsheader
    headerContainer: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logoHolder: {
    width: 200,
    height: 40,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
});
