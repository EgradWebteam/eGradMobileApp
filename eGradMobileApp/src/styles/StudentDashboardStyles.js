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
  activeButton: {    backgroundColor: "#6c5ce7",
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
  testBlock: { marginBottom: 20, padding: 10, backgroundColor: "#f9f9f9" },
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
    backgroundColor: "#2196F3",
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
   backgroundColor: "#09bffc",
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
  containerMyresults: {
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center" ,
  },
  noResultsContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: "#555",
  },
  portalButtonsScroll: {
    flexDirection: "row",
    marginBottom: 12,
  },
  portalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  portalButtonActive: {
    backgroundColor: "#007bff",
  },
  portalButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  examButtonsScroll: {
    flexDirection: "row",
    marginBottom: 12,
  },
  examButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
    marginRight: 6,
  },
  examButtonActive: {
    backgroundColor: "#2196f3",
  },
  examButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  resultsContainer: {
    marginTop: 12,
  },
  resultCard: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  testName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  resultRowText: {
    marginLeft: 8,
    fontSize: 14,
  },
  viewReportButton: {
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  viewReportButtonText: {
    color: "#fff",
    fontWeight: "bold",
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
    width: 220,
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
    backgroundColor: '#09bffc',
  },
  lefticon: {
    marginRight: 10,
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
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "#09bffc",
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