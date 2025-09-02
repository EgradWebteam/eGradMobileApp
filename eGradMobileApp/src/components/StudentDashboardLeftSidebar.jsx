import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'th' },
  { id: 'myCourses', label: 'My Courses', icon: 'book' },
  { id: 'buyCourses', label: 'Buy Courses', icon: 'shopping-cart' },
  { id: 'results', label: 'My Results', icon: 'list-alt' },
  { id: 'bokmarks', label: 'Bookmarks', icon: 'bookmark' },
  { id: 'account', label: 'My Account', icon: 'user' },
];

const StudentDashboardLeftSidebar = ({ activeSection, handleSectionChange }) => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const { width, height } = Dimensions.get("window");
      const isSmall = width < 768 || height < 768;
      setIsMobile(isSmall);
      setShowSidebar(!isSmall);
    };

    checkScreenSize();

    const subscription = Dimensions.addEventListener("change", checkScreenSize);

    return () => {
      subscription?.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      {isMobile && (
        <TouchableOpacity
          onPress={() => setShowSidebar(!showSidebar)}
          style={styles.hamburgerButton}
        >
          <Icon name="bars" size={24} color="#000" />
        </TouchableOpacity>
      )}

      {showSidebar && (
        <View style={[styles.sidebar, isMobile && styles.mobileSidebar]}>
          {sidebarItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.sidebarItem,
                activeSection === item.id && styles.activeSidebarItem,
              ]}
              onPress={() => handleSectionChange(item.id)}
            >
              <Icon
                name={item.icon}
                size={20}
                color={activeSection === item.id ? '#fff' : '#333'}
                style={styles.icon}
              />
              <Text
                style={[
                  styles.label,
                  activeSection === item.id && styles.activeLabel,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default StudentDashboardLeftSidebar;

const styles = StyleSheet.create({
  container: {
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
    padding: 12,
    borderRadius: 5,
    marginBottom: 8,
   backgroundColor: 'transparent',
  },
  activeSidebarItem: {
    backgroundColor: '#007bff',
  },
  icon: {
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
});
