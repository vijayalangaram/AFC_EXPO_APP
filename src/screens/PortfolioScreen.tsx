import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert // Added missing import
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAccountSummary } from '../api/account';
import { RootStackParamList } from '../../App';
import * as Localization from 'expo-localization';

const HEADER_HEIGHT = 84;

// Define drawer param list
type DrawerParamList = {
  Portfolio: undefined;
  // Add other drawer screens here if needed 
};

// Corrected navigation props
type PortfolioScreenNavigationProp = DrawerNavigationProp<DrawerParamList>;
 
// Currency symbol mapping (same as original)
// const getCurrencySymbol = (currencyCode) => {
//   const currencySymbols = {
//     // North America
//     USD: '$',    // US Dollar
//     CAD: 'C$',   // Canadian Dollar
//     MXN: 'MX$',  // Mexican Peso

//     // South America
//     BRL: 'R$',   // Brazilian Real
//     ARS: '$',    // Argentine Peso
//     CLP: 'CLP$', // Chilean Peso
//     COP: 'COL$', // Colombian Peso
//     PEN: 'S/',   // Peruvian Sol

//     // Europe
//     EUR: '€',    // Euro
//     GBP: '£',    // British Pound
//     CHF: 'CHF',  // Swiss Franc
//     NOK: 'kr',   // Norwegian Krone
//     SEK: 'kr',   // Swedish Krona
//     DKK: 'kr',   // Danish Krone
//     RUB: '₽',    // Russian Ruble
//     TRY: '₺',    // Turkish Lira
//     PLN: 'zł',   // Polish Zloty
//     HUF: 'Ft',   // Hungarian Forint
//     CZK: 'Kč',   // Czech Koruna

//     // Middle East
//     AED: 'د.إ',  // UAE Dirham
//     SAR: '﷼',    // Saudi Riyal
//     QAR: '﷼',    // Qatari Riyal
//     ILS: '₪',    // Israeli Shekel
//     EGP: '£',    // Egyptian Pound
//     IRR: '﷼',    // Iranian Rial
//     IQD: 'ع.د',  // Iraqi Dinar

//     // Africa
//     ZAR: 'R',    // South African Rand
//     NGN: '₦',    // Nigerian Naira
//     KES: 'KSh',  // Kenyan Shilling
//     ETB: 'Br',   // Ethiopian Birr
//     GHS: 'GH₵',  // Ghanaian Cedi
//     MAD: 'د.م.', // Moroccan Dirham
//     DZD: 'د.ج',  // Algerian Dinar
//     TND: 'د.ت',  // Tunisian Dinar

//     // Africa
//     XAF: 'FCFA',  // Central African CFA franc
//     XOF: 'CFA',   // West African CFA franc
//     XPF: '₣',     // CFP franc   
//     UGX: 'USh',   // Ugandan Shilling
//     RWF: 'RF',    // Rwandan Franc
//     MWK: 'MK',    // Malawian Kwacha
//     ZMW: 'ZK',    // Zambian Kwacha
//     MZN: 'MTn',   // Mozambican Metical
//     AOA: 'Kz',    // Angolan Kwanza
//     BIF: 'FBu',   // Burundian Franc
//     CDF: 'FC',    // Congolese Franc
//     DJF: 'Fdj',   // Djiboutian Franc
//     ERN: 'Nfk',   // Eritrean Nakfa
//     GMD: 'D',     // Gambian Dalasi
//     GNF: 'FG',    // Guinean Franc
//     LRD: 'L$',    // Liberian Dollar
//     LSL: 'L',     // Lesotho Loti
//     LYD: 'ل.د',   // Libyan Dinar
//     MGA: 'Ar',    // Malagasy Ariary
//     MRO: 'UM',    // Mauritanian Ouguiya (pre-2018)
//     MRU: 'UM',    // Mauritanian Ouguiya
//     MUR: '₨',     // Mauritian Rupee
//     SCR: '₨',     // Seychellois Rupee
//     SDG: '£',     // Sudanese Pound
//     SHP: '£',     // Saint Helena Pound
//     SOS: 'Sh',    // Somali Shilling
//     SSP: '£',     // South Sudanese Pound
//     SZL: 'L',     // Swazi Lilangeni
//     TZS: 'TSh',   // Tanzanian Shilling
//     ZWL: 'Z$',    // Zimbabwean Dollar

//     // North America (additional)
//     BZD: 'BZ$',   // Belize Dollar
//     BSD: 'B$',    // Bahamian Dollar
//     BMD: 'BD$',   // Bermudian Dollar
//     KYD: 'CI$',   // Cayman Islands Dollar
//     CRC: '₡',     // Costa Rican Colon
//     HTG: 'G',     // Haitian Gourde
//     JMD: 'J$',    // Jamaican Dollar
//     NIO: 'C$',    // Nicaraguan Cordoba
//     PAB: 'B/.',   // Panamanian Balboa
//     TTD: 'TT$',   // Trinidad and Tobago Dollar

//     // South America (additional)
//     BOB: 'Bs.',   // Bolivian Boliviano
//     GYD: 'G$',    // Guyanese Dollar
//     PYG: '₲',     // Paraguayan Guarani
//     SRD: '$',     // Surinamese Dollar
//     UYU: '$U',    // Uruguayan Peso
//     VEF: 'Bs.',   // Venezuelan Bolivar
//     VES: 'Bs.S',  // Venezuelan Bolivar Soberano

//     // Asia (additional)
//     AMD: '֏',     // Armenian Dram
//     AZN: '₼',     // Azerbaijani Manat
//     BHD: '.د.ب',  // Bahraini Dinar
//     BTN: 'Nu.',   // Bhutanese Ngultrum
//     KHR: '៛',     // Cambodian Riel
//     FJD: 'FJ$',   // Fijian Dollar
//     GEL: '₾',     // Georgian Lari
//     HKD: 'HK$',   // Hong Kong Dollar
//     JOD: 'د.ا',   // Jordanian Dinar
//     KZT: '₸',     // Kazakhstani Tenge
//     KWD: 'د.ك',   // Kuwaiti Dinar
//     KGS: 'с',     // Kyrgyzstani Som
//     LAK: '₭',     // Lao Kip
//     LBP: 'ل.ل',   // Lebanese Pound
//     MNT: '₮',     // Mongolian Tugrik
//     MMK: 'K',     // Myanmar Kyat
//     NPR: '₨',     // Nepalese Rupee
//     OMR: 'ر.ع.',  // Omani Rial
//     PGK: 'K',     // Papua New Guinean Kina
//     RSD: 'дин',   // Serbian Dinar
//     SYP: '£',     // Syrian Pound
//     TWD: 'NT$',   // New Taiwan Dollar
//     TMT: 'T',     // Turkmenistani Manat
//     UZS: 'сўм',   // Uzbekistani Som
//     YER: '﷼',     // Yemeni Rial

//     // Europe (additional)
//     ALL: 'L',     // Albanian Lek
//     BAM: 'KM',    // Bosnia-Herzegovina Convertible Mark
//     BGN: 'лв',    // Bulgarian Lev
//     HRK: 'kn',    // Croatian Kuna
//     ISK: 'kr',    // Icelandic Króna
//     MDL: 'L',     // Moldovan Leu
//     MKD: 'ден',   // Macedonian Denar
//     RON: 'lei',   // Romanian Leu
//     UAH: '₴',     // Ukrainian Hryvnia

//     // Oceania (additional)
//     TOP: 'T$',    // Tongan Pa'anga
//     WST: 'WS$',   // Samoan Tala
//     SBD: 'SI$',   // Solomon Islands Dollar
//     VUV: 'VT',    // Vanuatu Vatu

//     // Cryptocurrencies (additional)
//     LTC: 'Ł',     // Litecoin
//     BCH: 'BCH',   // Bitcoin Cash
//     XLM: 'XLM',   // Stellar Lumen
//     USDT: '₮',    // Tether
//     ADA: '₳',     // Cardano
//     DOGE: 'Ð',    // Dogecoin

//     // Asia
//     CNY: '¥',    // Chinese Yuan
//     JPY: '¥',    // Japanese Yen
//     INR: '₹',    // Indian Rupee
//     KRW: '₩',    // South Korean Won
//     SGD: 'S$',   // Singapore Dollar
//     MYR: 'RM',   // Malaysian Ringgit
//     THB: '฿',    // Thai Baht
//     VND: '₫',    // Vietnamese Dong
//     IDR: 'Rp',   // Indonesian Rupiah
//     PHP: '₱',    // Philippine Peso
//     PKR: '₨',    // Pakistani Rupee
//     BDT: '৳',    // Bangladeshi Taka
//     LKR: 'Rs',   // Sri Lankan Rupee
//     AFN: '؋',    // Afghan Afghani

//     // Oceania
//     AUD: 'A$',   // Australian Dollar
//     NZD: 'NZ$',  // New Zealand Dollar 

//     // Special cases and cryptocurrencies
//     BTC: '₿',    // Bitcoin
//     ETH: 'Ξ',    // Ethereum
//     XRP: 'XRP',  // Ripple

//     // CFA Francs
//     XAF: 'FCFA',  // Central African CFA franc
//     XOF: 'CFA',   // West African CFA franc 
//   };

//   // Return the symbol if found, otherwise return the currency code
//   return currencySymbols[currencyCode] || currencyCode;
// }; 


export const formatCurrency = (currencyCode: string, amount: number | string): string => {
  try {
    const number = typeof amount === 'string' ? parseFloat(amount) : amount;

    return new Intl.NumberFormat(Localization.locale, {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'symbol', // Or 'code' if you want to fall back to e.g. "USD 1,234.00"
    }).format(number);
  } catch (error) {
    console.warn('Currency formatting failed:', error);
    return `${currencyCode} ${amount}`;
  }
};

// Enhanced formatting function with TypeScript
// const formatCurrency = (currencyType: string, amount: string | number) => {
//   const symbol = getCurrencySymbol(currencyType);
//   let formattedAmount: string;

//   try {
//     formattedAmount = typeof amount === 'string'
//       ? parseFloat(amount).toLocaleString('en-US')
//       : amount.toLocaleString('en-US');
//   } catch (e) {
//     formattedAmount = amount.toString();
//   }

//   const rtlCurrencies = ['AED', 'SAR', 'QAR', /* ... */];
//   const suffixSymbols = ['XAF', 'XOF', 'XPF'];

//   if (rtlCurrencies.includes(currencyType)) {
//     return `${formattedAmount} ${symbol}`;
//   }
//   if (suffixSymbols.includes(currencyType)) {
//     return `${symbol} ${formattedAmount}`;
//   }
//   return `${symbol} ${formattedAmount}`;
// };

// Define Account interface for TypeScript
interface Account {
  id: string;
  accountId: string;
  countryName: string;
  currencyType: string;
  totalDebits: string;
  availableBalance: string;
}


// AccountCard component with TypeScript
const AccountCard: React.FC<{
  item: Account;
  onPress: (item: Account) => void;
}> = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
    <View style={styles.topRightArrow}>
      <Text style={styles.arrow}>→</Text>
    </View>

    <View style={styles.cardContent}>
      <View style={styles.accountInfo}>
        <Text style={styles.name} numberOfLines={4} ellipsizeMode="tail">
          {item.countryName}
        </Text>
        <Text style={styles.subtext}>
          {item.accountId} ({item.currencyType})
        </Text>
        <Text style={styles.debitLabel}>Total Debits</Text>
        <Text style={styles.debitAmount}>
          {formatCurrency(item.currencyType, item.totalDebits)}
        </Text>
      </View>
      <View style={styles.rightContainer}>
        <View style={styles.balanceBox}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balance}>
            {formatCurrency(item.currencyType, item.availableBalance)}
          </Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const PortfolioScreen: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation<PortfolioScreenNavigationProp>();
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetchAccountSummary();
        setAccounts(res.data.data || []);
      } catch (err) {
        console.error('Fetch error', err);
        Alert.alert('Error', 'Failed to load accounts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAccountPress = async (item: Account) => {
    try {
      await AsyncStorage.setItem('accountId', item.accountId);
      navigation.navigate('SummaryScreen', {
        account: item // Pass the account data directly
      });
    } catch (error) {
      console.error('Navigation error', error);
      Alert.alert('Error', 'Failed to navigate to account details');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#002A5C" />

      {/* Header */}
      <View style={[styles.fixedHeader, { paddingTop: statusBarHeight }]}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Text style={styles.menu}>☰</Text>
        </TouchableOpacity>
        <View style={styles.profile}>
          <Text style={styles.signatory}>Signatory</Text>
          <Image
            source={require('../../assets/images.png')}
            style={styles.image}
          />
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#0071CF"
          style={styles.loader}
        />
      ) : (
        <View style={styles.content}>
          <Text style={styles.portfolioTitle}>Portfolio</Text>
          <FlatList
            data={accounts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <AccountCard
                item={item}
                onPress={handleAccountPress}
              />
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No accounts found</Text>
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  listContent: {
    paddingBottom: 20
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666'
  },
  image: {
    width: 20,
    height: 13,
    resizeMode: 'contain',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topRightArrow: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  arrow: {
    fontSize: 18,
    color: '#002A5C',
  },
  loader: {
    marginVertical: 20,
  },
  accountInfo: {
    flex: 1,
    marginRight: 10,
  },
  fixedHeader: {
    backgroundColor: '#002A5C',
    height: HEADER_HEIGHT,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  menu: {
    fontSize: 24,
    color: 'white'
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  signatory: {
    marginRight: 8,
    fontWeight: 'bold',
    color: '#002A5C'
  },
  portfolioTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    color: '#002A5C'
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00205b',
    marginBottom: 4,
  },
  subtext: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  debitLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  debitAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002A5C',
  },
  balanceBox: {
    backgroundColor: '#DFF6DF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'flex-end',
    minWidth: 120,
    maxWidth: 140,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#006400',
    marginBottom: 4,
  },
  balance: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default PortfolioScreen;