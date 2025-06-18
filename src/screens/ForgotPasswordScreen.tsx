import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  TextInput,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { API_BASE_URL } from '../config/constants';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

// Update the navigation prop type
interface ForgotPasswordScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;
}


const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [otpError, setOtpError] = useState<string>('');
  const otpInputRefs = useRef<Array<TextInput | null>>([]);
  const route = useRoute();
  const { loginId, email, password } = route.params as any;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, domain] = email.split('@');
  const starmailidcovenver = user.slice(0, 2) + '*'.repeat(user.length - 3) + user.slice(-1) + '@' + domain;


  useEffect(() => {
    console.log("Navigation object:", navigation);
    console.log("Available routes:", navigation.getState()?.routes);
  }, [navigation]);

  useEffect(() => {
    handleResendOtp();
  }, [email]);

  useEffect(() => {
    otpInputRefs.current = otpInputRefs.current.slice(0, otp.length);
  }, [otp]);

  useEffect(() => {
    const isComplete = otp.every(digit => digit !== '');
    setIsButtonDisabled(!isComplete);
    setOtpError('');

    if (isComplete && otp[5] !== '') {
      handleVerifyOtp();
    }
  }, [otp]);

  const handleOtpChange = (text: string, index: number) => {
    if (/^\d*$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (text.length === 1 && index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }

      if (text && index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }

      if (text === '' && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    }
  };

  // In your handleVerifyOtp function:
  const handleVerifyOtp = async () => {
    setIsLoading(true);
    try {
      const otpcombine = otp.join('');
      const response = await axios.post(`${API_BASE_URL}/otp/verify`, {
        code: otpcombine,
        email,
        actionType: "Reset password"
      });
      if (response.data) {
        debugger
        Alert.alert('Success', response.data.message || 'OTP Verified Successfully!');
        navigation.navigate('Password_retype_password', { email });
      } else {
        Alert.alert('Invalid OTP', response.data.message || '');
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
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/user/email-verify`, {
        email,
        actionType: "Reset password"
      });

      if (!response.data?.success) {
        Alert.alert('Error', 'Failed to resend OTP. Please try again later.');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentimagetop}>
        <Image source={require('../../assets/images.png')} style={styles.image} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Forgot Password</Text>

        <Text style={styles.text}>
          We have sent a One-Time Password (OTP){'\n'}
          To your Registered Email Address{'\n'}
          {starmailidcovenver}
        </Text>

        <Text style={styles.text}>
          Please check your inbox and enter the{'\n'}
          OTP to proceed.
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (otpInputRefs.current[index] = ref)}
              style={[styles.otpBox, otpError ? styles.otpBoxError : null]}
              value={digit}
              onChangeText={(text: string) => handleOtpChange(text, index)}
              keyboardType="numeric"
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

        {isLoading && (
          <ActivityIndicator
            size="large"
            color="#0071CF"
            style={styles.loader}
          />
        )}

        {otpError && <Text style={styles.errorText}>{otpError}</Text>}

        <TouchableOpacity onPress={handleResendOtp} disabled={isLoading}>
          <Text style={styles.resendText}>
            Didn't receive the OTP? <Text style={styles.resendLink}>Resend OTP</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {!isLoading && (
          <TouchableOpacity
            style={[styles.loginButton, isButtonDisabled ? styles.disabledButton : null]}
            onPress={handleVerifyOtp}
            disabled={isButtonDisabled || isLoading}
          >
            <Text style={styles.loginButtonText}>Verify OTP</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    borderRadius: 30,
    padding: 20,
    paddingTop: 40,
    marginBottom: 10,
    flex: 0,
    height: '75%',
    marginHorizontal: 20,
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
  loader: {
    marginVertical: 20,
  },
});

export default ForgotPasswordScreen; 