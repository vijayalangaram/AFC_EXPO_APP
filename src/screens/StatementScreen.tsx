import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface Transaction {
  id: string;
  date: string;
  ref: string;
  type: string;
  amount: string;
}

const transactions: Transaction[] = [
  { id: '1', date: '04/05/2025', ref: 'DE25051509560486U', type: 'Debited', amount: '$120,000' },
  { id: '2', date: '04/05/2025', ref: 'DE25051509560489U', type: 'Debited', amount: '$30,000' },
  { id: '3', date: '04/05/2025', ref: 'DE25051509560254U', type: 'Credited', amount: '$110,000' },
  { id: '4', date: '04/05/2025', ref: 'DE25051509560256U', type: 'Interest', amount: '$134,000' },
  { id: '5', date: '04/05/2025', ref: 'DE25051509560251U', type: 'Credited', amount: '$134,000' },
];

const StatementScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const filteredData = transactions.filter(t =>
    t.ref.toLowerCase().includes(search.toLowerCase())
  );

  // Render statement list item
  const renderItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setSelectedTransaction(item)} // Show details for selected item
    >
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.ref}>{item.ref}</Text>
      <Text style={styles.type}>{item.type}</Text>
      <Text style={styles.amount}>{item.amount}</Text>
    </TouchableOpacity>
  );

  // Render statement details view
  const renderDetails = () => (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() => setSelectedTransaction(null)} // Back to list
        style={{ marginBottom: 16 }}
      >
        <Text style={{ color: '#007BFF', fontWeight: '600' }}>‹ Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Approval Timeline</Text>

      {/* Initiator */}
      <View style={styles.section}>
        <View style={styles.stepContainer}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>1</Text>
          </View>
          <View style={styles.verticalLine} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>Initiator</Text>
          <Text style={styles.bold}>Maker - Ikenna Agboola</Text>
          <Text style={styles.label}>
            Initiated date - <Text style={styles.normal}>03/03/2025 08:15 AM</Text>
          </Text>
          <Text style={styles.label}>
            Amount - <Text style={styles.normal}>{selectedTransaction?.amount}</Text>
          </Text>
          <Text style={styles.label}>
            Account Number - <Text style={styles.normal}>1234567890</Text>
          </Text>
          <Text style={styles.label}>
            Branch - <Text style={styles.normal}>New York, USA</Text>
          </Text>
          <Text style={styles.label}>
            SWIFT Code - <Text style={styles.normal}>ZEIBNGLA</Text>
          </Text>
          <Text style={styles.label}>
            Project - <Text style={styles.normal}>Base Infrastructure Development in Dam Sector</Text>
          </Text>
          <TouchableOpacity>
            <Text style={styles.detailsLink}>› Details</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Checker */}
      <View style={styles.section}>
        <View style={styles.stepContainer}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>2</Text>
          </View>
          <View style={styles.verticalLine} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>Checker</Text>

          {/* Checker 1 */}
          <View style={styles.subStep}>
            <View style={styles.smallCircle}>
              <Text style={styles.subStepNumber}>1</Text>
            </View>
            <View>
              <Text style={styles.bold}>Muyiwa Omowale</Text>
              <Text style={styles.label}>
                Date - <Text style={styles.normal}>04/03/2025 08:15 AM</Text>
              </Text>
              <Text style={styles.label}>
                Status - <Text style={styles.normal}>Accepted</Text>
              </Text>
              <Text style={styles.label}>
                Comments - <Text style={styles.normal}>Checker accepts Draw</Text>
              </Text>
            </View>
          </View>

          {/* Checker 2 */}
          <View style={styles.subStep}>
            <View style={styles.smallCircle}>
              <Text style={styles.subStepNumber}>2</Text>
            </View>
            <View>
              <Text style={styles.bold}>Olaide Adewale</Text>
              <Text style={styles.label}>
                Status - <Text style={styles.normal}>Successfully</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  // Render main view: list or details depending on selection
  return (
    <SafeAreaView style={styles.container}>
      {!selectedTransaction ? (
        <>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity>
              <Icon name="menu" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profile}>
              <Text style={styles.signatoryText}>Signatory</Text>
            </TouchableOpacity>
          </View>

          {/* Title & Account Info */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Statement</Text>
            <Text style={styles.subtitle}>
              Energy Capital Holdings - 7087187300405 - (USD)
            </Text>
          </View>

          {/* Search and Actions */}
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Icon name="search" size={18} color="#333" />
              <TextInput
                placeholder="Search"
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
              />
            </View>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="filter" size={18} color="#002147" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="download" size={18} color="#002147" />
            </TouchableOpacity>
          </View>

          {/* Statement List */}
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
        </>
      ) : (
        renderDetails()
      )}
    </SafeAreaView>
  );
};

export default StatementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F8',
    paddingHorizontal: 16,
  },
  header: {
    backgroundColor: '#002147',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: -16,
  },
  profile: {
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  signatoryText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#002147',
    fontWeight: '600',
  },
  titleContainer: {
    paddingVertical: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#002147',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    color: '#002147',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  searchBox: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 24,
    elevation: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#ccc',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  ref: {
    fontSize: 14,
    color: '#002147',
    fontWeight: '600',
    marginVertical: 4,
    textDecorationLine: 'underline',
  },
  type: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    position: 'absolute',
    right: 16,
    top: 16,
  },

  // Details styles (copy from your StatementDetailsScreen)
  header: {
    fontSize: 20,
    fontWeight: '700',
    color: '#002F6C',
    marginBottom: 16,
  },
  section: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  stepContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  stepCircle: {
    backgroundColor: '#34A853',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    color: '#fff',
    fontWeight: '600',
  },
  verticalLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#ccc',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    color: '#002F6C',
    marginBottom: 4,
  },
  bold: {
    fontWeight: '700',
    fontSize: 14,
    color: '#002F6C',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  normal: {
    fontWeight: '400',
    color: '#444',
  },
  detailsLink: {
    color: '#007BFF',
    marginTop: 8,
    fontWeight: '500',
  },
  subStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
  },
  smallCircle: {
    width: 20,
    height: 20,
    backgroundColor: '#34A853',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  subStepNumber: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
}); 