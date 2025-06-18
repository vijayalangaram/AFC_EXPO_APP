
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, TextInput, Platform,
  ActivityIndicator, Alert, Linking
} from 'react-native';
import { verifyOtp, login } from '../api/auth';
import { setAuthToken } from '../utils/auth';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App'; // Adjust path as needed 

// Define route params for this screen
type OTPValidationRouteProp = RouteProp<RootStackParamList, 'OTPValidation'>;

// Define navigation prop type
type OTPValidationNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OTPValidation'>;

interface OTPValidationProps {
  navigation: OTPValidationNavigationProp;
  route: OTPValidationRouteProp;
}

const OTPValidation: React.FC<OTPValidationProps> = ({ navigation, route }) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [otpError, setOtpError] = useState<string>('');
  const otpInputRefs = useRef<Array<TextInput | null>>([]);
  const { loginId, email, password } = route.params;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [user, domain] = email.split('@');
  const starmailidcovenver = user.slice(0, 2) + '*'.repeat(user.length - 3) + user.slice(-1) + '@' + domain;

  // Initialize refs array
  useEffect(() => {
    otpInputRefs.current = otpInputRefs.current.slice(0, otp.length);
  }, [otp]);

  // Auto-submit when last digit is entered
  useEffect(() => {
    const isComplete = otp.every(digit => digit !== '');
    setIsButtonDisabled(!isComplete);
    setOtpError('');
    if (isComplete && otp[5] !== '') {
      handleVerifyOtp();
    }
  }, [otp]);

  // Expo-compatible SMS handling
  const handleOpenEmailApp = () => {
    Linking.openURL('message://'); // Opens default messaging app
  };

  const extractOtpFromClipboard = async () => {
    if (Platform.OS === 'web') return;

    // Note: Clipboard API is deprecated in favor of expo-clipboard
    const { Clipboard } = require('react-native');
    const content = await Clipboard.getString();
    const otpRegex = /\b\d{6}\b/;
    const match = content.match(otpRegex);
    if (match) {
      const otpArray = match[0].split('');
      setOtp(otpArray);
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    if (/^\d*$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (text.length === 1 && index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }

      if (text === '' && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerifyOtp = async () => {
    debugger

    setIsLoading(true);
    try {
      const otpcombine = otp.join('');
      const res = await verifyOtp(loginId, email, otpcombine);
      console.log(loginId, email, otpcombine, "loginId, email, otpcombine")

      if (res.data.success) {
        const token = res.headers.authorization || res.headers.Authorization;
        if (token) {
          await setAuthToken(token);
        }
        navigation.navigate('PortfolioScreen', {
        }); 
      } else {
        Alert.alert('Invalid OTP', res.data.message || '');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('OTP Error', 'Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtp(['', '', '', '', '', '']);
    try {
      await login(email, password);
      Alert.alert('OTP Sent', 'A new OTP has been sent to your email');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to resend OTP');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentimagetop}>
        <Image source={require('../../assets/images.png')} style={styles.image} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Welcome</Text>

        <Text style={styles.text}>
          We have sent a One-Time Password (OTP){'\n'}
          To your Registered Email Address{'\n'}
          {starmailidcovenver}
        </Text>

        <TouchableOpacity onPress={handleOpenEmailApp}>
          <Text style={[styles.text, styles.linkText]}>
            Please check your inbox and enter the{'\n'}
            OTP to proceed.
          </Text>
        </TouchableOpacity>

        {/* OTP Input Boxes */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (otpInputRefs.current[index] = ref)}
              style={[styles.otpBox, otpError ? styles.otpBoxError : null]}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              autoFocus={index === 0}
              editable={!isLoading}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace' && !digit && index > 0) {
                  otpInputRefs.current[index - 1]?.focus();
                }
              }}
            />
          ))}
        </View>

        <TouchableOpacity onPress={extractOtpFromClipboard}>
          <Text style={styles.pasteText}>Paste OTP from clipboard</Text>
        </TouchableOpacity>

        {isLoading && (
          <ActivityIndicator size="large" color="#0071CF" style={styles.loader} />
        )}

        {otpError && <Text style={styles.errorText}>{otpError}</Text>}

        <TouchableOpacity onPress={handleResendOtp} disabled={isLoading}>
          <Text style={styles.resendText}>
            Didn't receive the OTP? <Text style={styles.resendLink}>Resend OTP</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={[styles.loginButton, isButtonDisabled && styles.disabledButton]}
          onPress={handleVerifyOtp}
          disabled={isButtonDisabled || isLoading}
        >
          <Text style={styles.loginButtonText}>Verify OTP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  linkText: {
    textDecorationLine: 'underline',
    color: '#4DA6FF',
  },
  pasteText: {
    color: '#4DA6FF',
    textAlign: 'center',
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  loader: {
    marginVertical: 20,
  },
  loginButton: {
    backgroundColor: '#0071CF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10, // Add some spacing 
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentimagetop: {
    padding: 10,
    marginTop: 20,
  },
  image: {
    width: 200,
    height: 130,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  content: {
    backgroundColor: '#00205B',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 20,
    paddingTop: 40,
    marginBottom: 10,
    flex: 0,
    height: '75%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  resendText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  resendLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  divider: {
    height: 1,
    backgroundColor: '#fff',
    marginVertical: 20,
  },
  verifyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#0071CF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  otpBox: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    color: '#fff',
    fontSize: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  otpBoxError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});
export default OTPValidation;


