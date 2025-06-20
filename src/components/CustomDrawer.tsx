import React from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const accounts = [
  'Energy Capital Holdings',
  // 'Hydro Carbon Finance',
  // 'Africa Finance Ltd', 
  // 'Energy Conversation Holding',
];

const CustomDrawer = ({ navigation }: DrawerContentComponentProps) => {

  const handleLogout = async () => {
    debugger
    // Clear any stored authentication tokens
    // AsyncStorage.removeItem('authToken'); // Uncomment if using AsyncStorage
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.clear(); 
    // Reset navigation stack and navigate to Login 
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {/* Uncomment if you have an image */}
        {/* <Image 
          source={require('../assets/images.png')} 
          style={styles.image} 
        /> */}
        <Text style={styles.logoText}>Africa Finance Corporation</Text>
        <TouchableOpacity onPress={() => navigation.closeDrawer()}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Portfolio</Text>

        {accounts.map((acc, idx) => (
          <View key={`account-${idx}`} style={styles.accountRow}>
            <Text style={styles.accountName}>{acc}</Text>
            <TouchableOpacity
              style={[styles.switchBtn, idx === 0 && styles.selectedBtn]}
              onPress={() => console.log(`Switching to ${acc}`)}
            >
              <Text style={[styles.switchText, idx === 0 && styles.selectedText]}>
                {idx === 0 ? 'Selected' : 'Switch'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
          <Ionicons name="log-out-outline" size={20} color="#00205B" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff'
  },
  image: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  header: {
    backgroundColor: '#00205B',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  content: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#00205B'
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  accountName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  switchBtn: {
    backgroundColor: '#E6F0FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedBtn: {
    backgroundColor: '#007AFF',
  },
  switchText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '500',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  logoutBtn: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#E6EBF5',
    borderRadius: 10,
  },
  logoutText: {
    color: '#00205B',
    fontSize: 16,
    fontWeight: 'bold'
  },
});

export default CustomDrawer; 