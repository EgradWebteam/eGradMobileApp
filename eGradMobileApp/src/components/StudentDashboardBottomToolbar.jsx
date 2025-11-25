import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const StudentDashboardBottomToolbar = ({ activeSection, handleSectionChange }) => {
  const menuItems = [
    {
      id: 'dashboard',
      icon: 'home',
    },
    {
      id: 'myCourses',
      icon: 'book',
    },
    {
      id: 'buyCourses',
      icon: 'shopping-cart',
    },
    {
      id: 'results',
      icon: 'bar-chart',
    },
    {
      id: 'bookmarks',
      icon: 'bookmark',
    },
    {
      id: 'account',
      icon: 'user',
    },
  ];

  return (
    <View style={styles.toolbarContainer}>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.toolbarItem}
          onPress={() => handleSectionChange(item.id)}
        >
          <Icon
            name={item.icon}
            size={24}
            color={activeSection === item.id ? '#3399cc' : '#666'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  toolbarContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 4,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  toolbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StudentDashboardBottomToolbar;