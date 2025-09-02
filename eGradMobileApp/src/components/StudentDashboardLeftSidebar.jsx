import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Sidebar items
const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'th' },
  { id: 'myCourses', label: 'My Courses', icon: 'book' },
  { id: 'buyCourses', label: 'Buy Courses', icon: 'shopping-cart' },
  { id: 'results', label: 'My Results', icon: 'list-alt' },
  { id: 'bokmarks', label: 'Bookmarks', icon: 'bookmark' },
  { id: 'account', label: 'My Account', icon: 'user' },
];

const StudentDashboardLeftSidebar = ({ activeSection, handleSectionChange }) => {
  const [showSidebar, setShowSidebar] = useState(true); // You can toggle this if needed

  return (
    <View style={styles.sidebarContainer}>
      {/* Sidebar Items */}
      <ScrollView>
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
      </ScrollView>
    </View>
  );
};

export default StudentDashboardLeftSidebar;

const styles = StyleSheet.create({
  sidebarContainer: {
    backgroundColor: '#f8f8f8',
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: 200,
    borderRightWidth: 1,
    borderColor: '#ddd',
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 5,
    marginBottom: 8,
    backgroundColor: '#fff',
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
