import { StyleSheet ,Dimensions} from 'react-native';
const { height, width } = Dimensions.get('window');
export const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  containergi:{
   padding: 20,
    backgroundColor: '#fff',
  flex: 1,
  },
  btnsSubContainer:{
flexDirection:'row',
justifyContent:"space-between",
gap:10,
    width:"100%",

  },
  optConCorWro: {
    paddingHorizontal: 17,  // Horizontal padding (left and right)
    flexDirection: "row",
    gap:25,
    // For gap, add margin to child elements (inside the container) if needed.
  },
    buttonsol: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    maxWidth: 150,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: '#e0e0e0', // Inactive button background
  },
  solutionDisplayTab:{
    flexDirection:"column",
    gap:10,
  },
  activeButtontext:{
    color:"#fff",
    fontWeight:"600",
  },
  activeButtonsol: {
    backgroundColor: '#007bff', // Active button background
  },
    solutionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',

    minHeight: 20,
    padding: 10,
  },
  solutionTabs:{
  flexDirection: 'row',
    justifyContent: 'center',

    minHeight: 50,
    padding: 10,
  },
  solutionOverlay: {
    flex: 1,
    width:width,
    height:height,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  solutionContent: {
    width: "100%",
    height: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  optIcon:{
    width:25,
    height:25,
  },
  testcontainer:{  
    backgroundColor: '#fff',
    flexGrow: 1,
},
  navbarcontainer: {
   backgroundColor:'#000',
    padding: 10,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'

 
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center", // vertically center
    alignItems: "center",     // horizontally center
    // backgroundColor: "rgba(0,0,0,0.5)", // optional: dim background
  },
  modalContent: {
    // backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%", // optional
  },
   timersection: {
    paddingVertical: 4,         // very small vertical padding
    paddingHorizontal: 8,
    alignItems:'center',
    backgroundColor: '#fff',
    flexDirection:'row',
    justifyContent:'space-between',
    width:'100%',

  },
  subjectcontainer: {
     paddingVertical: 4,         // very small vertical padding
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  footerContainerpqb: {
    padding: 5,
flexWrap:'wrap',
gap:'10',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    height: 100
   
  },
  footerContainer: {
    padding: 5,
flexWrap:'wrap',
gap:'10',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    height: 95
   
  },
  questionImageContainer: {
   padding:5
  },
  mainContainerforquestion: {
    flex: 1,
    padding: 16
   
   
  },
  
  optionLabel:{
    width:40
  },
  mainContainer: {
    flex: 1,
    padding: 0,
  },
  questionBtnSNMR:{
height: 45,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 90,
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
    backgroundColor: 'rgb(64 173 242)',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  buttonSecondary: {
    backgroundColor: 'rgb(64 173 242)',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  // disabledButton: {
  //   backgroundColor: '#ccc',

  //   opacity: 0.6,
  // },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight:90,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollViewContent: {
    padding: 16,
     flexGrow: 1,
    // height: height - 150,
  },
 
 
  subHeadingSecondary: { fontSize: 18, fontWeight: 60, marginTop: 16, marginBottom: 8 },
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
  NotAnsweredBtnCls: { color: "#fff" },
  AnswerdBtnCls: { color: "#fff" },
  MarkedForReview: { color: "#fff" },
  AnsMarkedForReview: { color: "#fff" },
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
    width:120,
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
  
  },
  //repeated
  testName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#dddd64",
  },
  buttonHolder: {
    flexDirection: "row",
    gap:10,
   
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
  // logo: {
  //   width: 80,
  //   // height: 40,
  // },
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
    color:'#055893',
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
    backgroundColor: "#01c3ff",
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
    width:70

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
    backgroundColor:"red",
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
    fontWeight: 60,
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
    fontWeight: '900',
  },
  Textbold:{
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
    questionNumberRow: {
         flexDirection: 'row',
         gap:'10',
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
    backgroundColor: '#09bffc',
   
  },
  viewreportbtn :{ 
     backgroundColor: '#09bffc',
    padding:10,
    borderRadius:5
  },
  questionBtnText: {
  
textAlign: 'center'
  },
  whiteText:{
    color:'#fff',
  },
  subjectContainer: {
flexDirection:'column',
gap:'10'
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
    color:'#000',
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
    marginLeft:8
  },
  sectionText: {
    fontSize: 15,

  },
  activeSubjectText:{
color:'#fff',
  },
  activeButton: {
    backgroundColor: "#0d057cff",
    color:'#fff',
  },
    activeButtontest: {
    backgroundColor: "#587dbd",
    color:'#fff',
  },
  natInput:{
    borderColor:'#ccc',
    borderWidth:1,
    width:'90%',
    height:40,
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
    btnsSubContainerpqb: {
      width:"100%",
    flexDirection: 'row',
    justifyContent:'space-between',
    gap:10
 
  },
  pqbbtns:{
flexDirection:"column",
justifyContent:"space-between",
height:"100%"
  },
  navigationBtnHolderSubContainer: {

     flexDirection: 'row',
     gap:'10'
  },

   buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign:"center",
    fontWeight: "600",
  },
  navigationBtnHolderSubContainerForSubmit: {
    flexDirection: 'row',
      gap:'10'
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
  // disabledButtonText: {
  //      color: '#666',
  // },
  // disabledButtonTextopt: {
  //      color: '#999',
  //      fontSize:15,
  // },
  submitBtnCls: {
   flexDirection: 'row',
     gap:'10',
     justifyContent:'space-evenly'
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
           // Similarly for full height
    backgroundColor: 'white',
    justifyContent: 'center',
      flex: 1,
    alignItems: 'center',
  
  },
  examSummarySubDiv: {
    width: '90%',
  },
 NavigationButton: {

  paddingVertical: 6,
  paddingHorizontal: 6,
  borderRadius: 6,

  alignItems: 'center' ,
   borderWidth: 1,
  borderColor: '#000',
  color:'#000',
},
saveandnext:{
  paddingVertical: 6,
  paddingHorizontal: 6,
  borderRadius: 6,

justifyContent:'center',
  alignItems: 'center',
    backgroundColor: '#587dbd',
    color:'#fff'
},
  submitButton: {
    backgroundColor: '#587dbd',
      color:'#fff',
    paddingVertical: 6,
  paddingHorizontal: 6,
  borderRadius: 6,

justifyContent:'center',
  alignItems: 'center',
  },
marksContainer:{

    flexDirection: 'row',
  
},
correctMarks:{
color:'green',
fontWeight:'bold'
},
negativeMarks:{
  color:'red',
fontWeight:'bold'
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
     footerContainergi: {
   padding: 16,
  borderTopWidth: 1,
  borderTopColor: '#ddd',
  backgroundColor: '#fff',
  alignItems:'center'
  },
  logoHolder: {
    width: 250,
    height: 40,
  },
  logo: {
    width: "100%",
    height: "100%",
  },  NATInputHolder: {
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 15,
    display: 'flex', // optional in RN, flexDirection is sufficient
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16, // 1rem ≈ 16px
    gap: 4, // Note: `gap` support is limited in RN; needs manual spacing
    borderWidth: 2,
    borderColor: '#c5c0c0',
    shadowColor: '#000',
    shadowOffset: { width: 1.95, height: 1.95 },
    shadowOpacity: 0.2,
    shadowRadius: 2.6,
    elevation: 3, // Required for shadow to appear on Android
  },

  NATLabel: {
    width: 150,
    fontWeight: 'bold',
    display: 'flex', // optional
    marginBottom: 10,
  },

  backSpaceBtn: {
    display: 'flex',
    justifyContent: 'center',
    width: '85%',
    marginHorizontal: 'auto', // React Native doesn’t support 'auto' – may need to adjust manually
    margin: 10,
  },
  backSpaceButton: {
    width: '100%',
    padding: 5,
    fontSize: 16, // 'larger' in web ≈ 18px
    backgroundColor: '#d9d9d9',
    borderRadius: 10,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: 'darkgray',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Required for Android shadow
    textTransform: 'uppercase', // This works only in <Text />
    color: 'black', // Also for <Text />, not <View />
    alignItems: 'center',
    justifyContent: 'center',
  },

  backSpaceButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: 'black',
  },
  CalculatorBox: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10, 
    justifyContent: 'center',
    padding: 10,
  },

  calcButton: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: '#aaa',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#e4e4e4',
    color: 'black',
    shadowColor: '#000',
    shadowOffset: { width: 1.95, height: 1.95 },
    shadowOpacity: 0.2,
    shadowRadius: 2.6,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },

  arrowBtns: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 16, // Not fully supported; manage via spacing on children
  },

  arrowButton: {
    width: 45,
    height: 30,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    color: 'black',
  },
    correctQuestion: {
    height: 45,
    width: 45,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
  },
  incorrectQuestion: {
    height: 45,
    width: 45,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
  },
  partialCorrectQuestion: {
    height: 45,
    width: 45,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
  },
  questionPaletteBtn: {
    height: 45,
    width: 45,
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 1,
    // borderColor: "#ccc",
    // borderRadius: 5,
    color:"#000"
  },
  activeQuestion: {
    // borderWidth: 2,
    // borderColor: "blue",
  },
    OTSNavbarMainContainer: {
    flexDirection: "row",      
    justifyContent: "space-between", 
    alignItems: "center",     
    paddingHorizontal: 16,    
    paddingVertical: 10,
    backgroundColor: "#fff",  
  },
  OTSTestNameHolder: {
    flex: 1, 
  },
  testNameText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  timerWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  clockIcon: {
    fontSize: 18,
    marginRight: 6,
    color: "#000",
  },
  timerText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
});
