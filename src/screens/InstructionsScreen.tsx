import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

type Instruction = {
  id: string;
  date: string;
  name: string;
  amount: string;
};

const mockData = {
  Pending: [
    { id: 'DE25051509560793U', date: '14/04/2024', name: 'Ikenna Agboola', amount: '$300,000' },
    { id: 'DE25051509560792U', date: '12/04/2024', name: 'Obioma Aderonke', amount: '$20,000' },
    { id: 'DE25051509560789U', date: '10/04/2024', name: 'Obioma Aderonke', amount: '$80,000' },
    { id: 'DE25051509560777U', date: '10/04/2024', name: 'Ikenna Agboola', amount: '$120,000' },
  ],
  Accepted: [
    { id: 'DE25051509560793U', date: '14/04/2024', name: 'Ikenna Agboola', amount: '$300,000' },
    { id: 'DE25051509560793U', date: '14/04/2024', name: 'Muyiwa Omowale', amount: '$300,000' },
    { id: 'DE25051509560793U', date: '14/04/2024', name: 'Obioma Aderonke', amount: '$300,000' },
  ],
  Rejected: [
    { id: 'DE25051509560793U', date: '14/04/2024', name: 'Muyiwa Omowale', amount: '$300,000' },
    { id: 'DE25051509560793U', date: '14/04/2024', name: 'Ikenna Agboola', amount: '$300,000' },
  ],
};

const tabs = ['Pending', 'Accepted', 'Rejected'] as const;
type TabKey = typeof tabs[number];

export default function InstructionsScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('Pending');
  const [search, setSearch] = useState('');
  const navigation = useNavigation();

  const filteredData = mockData[activeTab].filter(item =>
    item.id.includes(search) || item.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderInstruction = ({ item }: { item: Instruction }) => (
    <View style={styles.card}>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.id}><Text style={styles.bold}>{item.id}</Text></Text>
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.row}>
        <Text style={styles.amount}>{item.amount}</Text>
        <TouchableOpacity>
          <Text style={styles.action}>
            {activeTab === 'Pending' ? 'Review' : 'Details'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Instructions</Text>
        <Text style={styles.account}>Energy Capital Holdings - 7087187300405 - (USD)</Text>
      </View>

      <View style={styles.tabContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.subTitle}>
          {activeTab === 'Pending'
            ? 'Pending Instructions'
            : activeTab === 'Accepted'
            ? 'Approved Instructions'
            : 'Rejected Instructions'}
        </Text>
        <SearchBar
          placeholder="Search"
          onChangeText={setSearch}
          value={search}
          lightTheme
          round
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderInstruction}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 10,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#002B5B',
  },
  account: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    marginVertical: 12,
    justifyContent: 'space-around',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  tabText: {
    color: '#888',
    fontWeight: '600',
  },
  activeTab: {
    backgroundColor: '#fff',
    elevation: 2,
  },
  activeTabText: {
    color: '#002B5B',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    width: 150,
  },
  searchInput: {
    backgroundColor: '#eee',
    height: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    elevation: 1,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  id: {
    fontSize: 14,
    marginTop: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
  name: {
    fontSize: 13,
    color: '#444',
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  amount: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  action: {
    fontSize: 14,
    color: '#0056CC',
    fontWeight: '600',
  },
});
 