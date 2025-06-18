import React from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';

const accounts = [
  'Energy Capital Holdings',
  'Hydro Carbon Finance',
  'Africa Finance Ltd',
  'Energy Conversation Holding',
];

const CustomDrawer = ({ navigation }: DrawerContentComponentProps) => {



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {/* <Image source={require('../screens/images.png')} style={styles.image} /> */}
        <Text style={styles.logoText}>Africa Finance Corporation </Text>
        <TouchableOpacity onPress={() => navigation.closeDrawer()}>
          <Icon name="close" size={28} color="#fff" />
        </TouchableOpacity>

      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Portfolio</Text>
        {accounts.map((acc, idx) => (
          <View key={idx} style={styles.accountRow}>
            <Text style={styles.accountName}>{acc}</Text>
            <TouchableOpacity style={[styles.switchBtn, idx === 0 && styles.selectedBtn]}>
              <Text style={[styles.switchText, idx === 0 && styles.selectedText]}>
                {idx === 0 ? 'Selected' : 'Switch'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* 
        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout </Text>
          <Icon name="log-out-outline" size={20} color="#00205B" />
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }}
        >
          <Text style={styles.logoutText}>Logout </Text>
          {/* <Icon name="log-out-outline" size={20} color="#00205B" /> */}
        </TouchableOpacity>


      </View>
    </ScrollView>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  container: { flexGrow: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#00205B',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  content: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#00205B' },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  accountName: { fontSize: 16, color: '#333' },
  switchBtn: {
    backgroundColor: '#E6F0FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  selectedBtn: {
    backgroundColor: '#007AFF',
  },
  switchText: { color: '#007AFF', fontSize: 12 },
  selectedText: { color: '#fff', fontWeight: 'bold' },
  logoutBtn: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#E6EBF5',
    borderRadius: 10,
  },
  logoutText: { color: '#00205B', fontSize: 16, fontWeight: 'bold' },
});