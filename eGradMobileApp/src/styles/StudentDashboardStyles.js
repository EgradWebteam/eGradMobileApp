import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');
export const styles = StyleSheet.create({
    // account settings csss
  containerSettings: { flex: 1, padding: 16},
  profileContainerSett: {
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
  subSectionButtons: { flexDirection: "row", marginBottom: 20 },
  button: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: "#cce4ff", // light blue shade
    alignItems: "center",
  },
   questionContainer: {
    backgroundColor: "#fff",
    padding: 12,
    margin: 8,
    borderRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  back:{
   marginTop: 10 ,
   backgroundColor:"#15803d",
   width:80,
   fontSize:16,
   height:40,
   borderRadius:8,
     alignItems: 'center', 
   justifyContent:'center'
  },
  activeButton: {    backgroundColor: "#01c3ff",
    color:'#fff',}, // darker blue
  buttonText: { color: "#fff", fontWeight: "bold" },
  detailsContainer: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 20,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Android shadow
    elevation: 3,
  },
     pickerContainer: {
    borderWidth: 2,
    borderColor: "#424242",
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  detailText: { fontSize: 16, marginBottom: 5 },
  label: { fontWeight: "bold", marginBottom: 5 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Android shadow
    elevation: 2,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  eyeIcon: { marginRight: 10 },
  criteriaContainer: { marginBottom: 15 },
  error: { color: "red", marginBottom: 10 },
  submitButton: {
    backgroundColor: "#444444",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Android shadow
    elevation: 3,
  },
  //buycourses
   heading: {
    fontSize: 22,
    fontWeight: "bold",
    margin: 15,
    textAlign: "center",
  },

row: {
    flexDirection: "row",
    // flexWrap: "wrap",
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  /** PORTAL BUTTONS **/
  portalBtn: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#ffffff",
    marginRight: 12,
    marginBottom: 12,
  },
  portalActive: {
    backgroundColor: "#01c3ff", // same as screenshot blue
    borderColor: "#01c3ff",
  },
  portalText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  portalTextActive: {
    color: "#fff",
  },

  /** EXAM BUTTONS **/
  examBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopRightRadius: 10,
    borderTopLeftRadius:10,
    backgroundColor: "#3c3c3c",
    marginRight: 12,
    marginBottom: 12,
  },
  examActive: {
    backgroundColor: "#01c3ff",
  },
  examText: {
    fontSize: 14,
    fontWeight: "600",
     color: "#fff",
  },
  examTextActive: {
    color: "#fff",
  },

  /** DEPARTMENT BUTTONS **/
  deptBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#3c3c3c",
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  deptActive: {
    backgroundColor: "#01c3ff",
  },
  deptText: {
    fontSize: 14,
    fontWeight: "600",
     color: "#fff",
  },
  deptTextActive: {
    color: "#fff",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 15,
    marginTop: 20,
    marginBottom: 10,
  },

  noCourses: {
    textAlign: "center",
    marginVertical: 30,
    fontSize: 16,
    color: "grey",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
 popupBox: {
  width: "85%",
  backgroundColor: "#fff",
  padding: 25,
  borderRadius: 16,
  shadowColor: "#000",
  shadowOpacity: 0.25,
  shadowRadius: 10,
  elevation: 5,
},

popupTitle: {
  fontSize: 20,
  fontWeight: "700",
  textAlign: "center",
  marginBottom: 12,
  color: "#000",
},

popupPara: {
  fontSize: 15,
  lineHeight: 22,
  textAlign: "center",
  marginBottom: 12,
  color: "#444",
},

boldText: {
  fontWeight: "700",
  color: "#000",
},

popupBtnRow: {
  flexDirection: "row",
  justifyContent: "space-around",
  marginTop: 15,
},

okBlueBtn: {
  backgroundColor: "#01c3ff",
  paddingVertical: 12,
  paddingHorizontal: 28,
  borderRadius: 10,
},

okBlueText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "700",
},

cancelRedBtn: {
  backgroundColor: "#D32F2F",
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 10,
},

cancelRedText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "700",
},
//buyend
  disabledButton: { backgroundColor: "#444444" },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  popup: {
    position: "absolute",
    top: "40%",
    left: "10%",
    right: "10%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    // Android shadow
    elevation: 6,
  },
  closePopup: { marginTop: 15, color: "#3399ff", fontWeight: "bold" },

  //Book mark css
   containerBookMarks: { flex: 1, padding: 15, backgroundColor: "#fff" },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 10 ,textAlign: "center" },
  portalButtons: { marginBottom: 10 },
  portalButton: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginRight: 8,
  },
  activePortalButton: { backgroundColor: "#4CAF50" },
  portalButtonText: { color: "#000" },
  scrollContent: { flex: 1 },
  testBlock: { marginBottom: 20, padding: 10},
  testTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  questionBlock: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  paragraphContainer: { marginBottom: 10 },
  paragraphTag: { fontWeight: "bold", marginBottom: 5 },
  paragraphImage: {  marginVertical: 6,
  resizeMode: "contain",},
  image: { marginVertical: 10,
  resizeMode: "contain", },
  optionRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  optionImage: { width: "100%", height: 60, resizeMode: "contain", marginLeft: 5 },
  solutionButtons: { flexDirection: "row", marginTop: 10 },
  solutionBtn: {
    backgroundColor: "#01c3ff",
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  solutionBtnText: { color: "white" },
  solutionImage: {  marginTop: 10,
  resizeMode: "contain",},
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
   flex: 1,
  backgroundColor: "#000",     // black background for video
  justifyContent: "flex-start", // allow close button on top
  alignItems: "center",
},

  closeBtn: {   alignSelf: "flex-end",
    marginBottom: 10, },
  emptyMsg: { textAlign: "center", marginTop: 20, color: "gray" },

  // mycourses
   containerMyCourses: {
    padding: 15,
    backgroundColor: '#fff',
    flex: 1
  },
     containerBuyCourses: {
    padding: 15,
    backgroundColor: '#fff',
    flex: 1
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: "center" ,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap'
  },
  breadcrumbText: {
    fontWeight: 'bold',
    fontSize: 16
  },

  portalButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
   gap:10
  },
  portalButton: {
    padding: 10,
    margin: 5,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  examButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  examButton: {
    padding: 8,
    margin: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  activeButton: {
   backgroundColor: "#01c3ff",
    color:'#fff',
  },
  noCourses: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
activeButtontext:{
  color:'#fff'
},
  // my results
 /* ---------------- My Results Card Styles (MATCHES YOUR IMAGE) ---------------- */

containerMyresults: {
    padding: 16,
  },

  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },

  noResultsContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: "#555",
  },

  /* PORTAL BUTTONS */
  portalButtonsScroll: { marginBottom: 12 },
  portalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  activeButton: { backgroundColor: "#01c3ff" },
  portalButtontext: {
    color: "#333",
    fontWeight: "bold",
  },
  activeButtontext: { color: "#fff", fontWeight: "bold" },

  /* EXAM BUTTONS */
  examButtonsScroll: { marginBottom: 12 },
  examButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
    marginRight: 8,
  },
  examButtontext: { color: "#333", fontWeight: "bold" },

  /* RESULT CARDS */
  resultsContainer: { marginTop: 10 },

  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 22,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  testName: {
    backgroundColor: "#3c3c3c",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 14,
  },

  resultContent: {
    paddingVertical: 18,
    paddingHorizontal: 20,
  },

  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  resultRowText: {
    marginLeft: 12,
    fontSize: 17,
    color: "#333",
    fontWeight: "700",
  },

  viewReportButton: {
    backgroundColor: "#01c3ff",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    alignSelf: "center",
    width: "70%",
    marginTop: 8,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },

  viewReportButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  // 🔹 Specific Borders (use in dynamic styles)
  chapterWiseResultsBorder: {
    borderColor: "#976963",
    backgroundColor: "#fdf7f7",
  },
  subjectWiseResultsBorder: {
    borderColor: "#ac9563",
    backgroundColor: "#faf8f3",
  },
  fullTestResultsBorder: {
    borderColor: "#579b75",
    backgroundColor: "#f2fdf5",
  },
  topicWiseResultsBorder: {
    borderColor: "#5282ae",
    backgroundColor: "#f3f9fd",
  },
  partTestResultsBorder: {
    borderColor: "#ceccca",
    backgroundColor: "#fcfcfc",
  },

// Left side barrr
 containerLeftSideBar: {
    flexDirection: "row",
    position: "relative",
  },
  hamburgerButton: {
    padding: 10,
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1000,
 backgroundColor: 'transparent',
    borderRadius: 5,
  },
  sidebar: {
    width: 200,
    backgroundColor: "#f0f0f0",
    paddingVertical: 40,
  },
  mobileSidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // for Android shadow
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"center",
    padding: 12,
    borderRadius: 5,
  
   backgroundColor: 'transparent',
  },
  activeSidebarItem: {
    backgroundColor: '#01c3ff',
  },
  lefticon: {
    // marginRight: 10,
    margin:10,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  activeLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // dashboard homee
   dashboardContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  greetingContainer: {
    marginBottom: 20,
  },
  welcomeNote: {
    fontSize: 18,
    fontWeight: "bold",
  },
  studentHiMsg: {
    fontSize: 16,
    marginTop: 4,
    color: "#555",
  },
  exploreCardsDiv: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  cardDiv: {
    alignItems: "center",
    width: "48%",
    padding: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  icon: {
    // marginBottom: 10,
    margin:10,
  },
  btn: {
    backgroundColor: "#01c3ff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  TestDetailsCourseName:{
    fontSize: 22, 
    fontWeight: "bold",
     textAlign: 'center'
     },
     TestDetailsGoBack:{
justifyContent:'flex-end',
alignItems:'flex-end'
     },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
  },
  exploreCoursesHeadingDiv: {
    marginBottom: 12,
  },
  exploreCoursesHeading: {
    fontSize: 18,
    fontWeight: "bold",
  },

  // dashboard headerrr
   headerContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f1f1f1',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    width: 150,
    height: 40,
  },
  profileContainer: {
    padding: 5,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000060',
    justifyContent: 'flex-end',
    padding: 10,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
  },
    modalContentdiv: {
    width: width,           // full screen width
    height: height,         // full screen height
    backgroundColor: '#772e2eff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  modalItem: {
    fontSize: 16,
    paddingVertical: 10,
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: '#d9534f',
    padding: 10,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    textAlign: 'center',
  },


});