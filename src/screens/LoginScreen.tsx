import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { login } from '../api/auth';
import { fetchAccountSummary } from '../api/account';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../App'; // Adjust path as needed
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';



// Define navigation prop type for this screen
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  // Initialize navigation with proper typing
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberDevice, setRememberDevice] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [biometricAttempted, setBiometricAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    // debugger

    let isMounted = true; // To prevent state updates after component unmounts

    const loadCredentials = async () => {
      try {
        // Get all items at once (more efficient)
        const [savedEmail, savedPassword, rememberStatus] = await Promise.all([
          AsyncStorage.getItem('savedEmail'),
          AsyncStorage.getItem('savedPassword'),
          AsyncStorage.getItem('rememberDevice'),
        ]);

        if (isMounted && savedEmail && savedPassword && rememberStatus === 'true') {
          setEmail(savedEmail);
          setPassword(savedPassword);
          setRememberDevice(true);
        }
      } catch (error) {
        console.error('Error loading credentials:', error);
        if (isMounted) {
          // Optional: Reset to default state on error
          setEmail('');
          setPassword('');
          setRememberDevice(false);
        }
      }
    };
    loadCredentials();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, []); // Empty array ensures this runs only once on mount




  const handleRememberDevice = async () => {
    // debugger
    const newRememberStatus = !rememberDevice;
    setRememberDevice(newRememberStatus);
    try {
      if (newRememberStatus) {
        // Save credentials
        await AsyncStorage.setItem('savedEmail', email);
        await AsyncStorage.setItem('savedPassword', password);
        await AsyncStorage.setItem('rememberDevice', 'true');
      } else {
        // debugger
        // Remove credentials
        await AsyncStorage.removeItem('savedEmail');
        await AsyncStorage.removeItem('savedPassword');
        await AsyncStorage.removeItem('rememberDevice');
        setEmail("");
        setPassword("");
        setRememberDevice(false);
      }
    } catch (error) {
      console.log('Error saving credentials:', error);
    }
  };

  useEffect(() => {
    const initiateBiometricFlow = async () => {
      setIsLoading(true);
      try {
        const res = await fetchAccountSummary();
        console.log(res?.status, "fetchAccountSummary status");
        if (res?.status === 200) {
          const hasHardware = await LocalAuthentication.hasHardwareAsync();
          const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
          if (hasHardware && supportedTypes.length > 0) {
            setIsBiometricSupported(true);
            await handleFaceIdLogin(); // 🟢 Only call Face ID if eligible
          }
        }
      } catch (error) {
        console.log("fetchAccountSummary or biometric setup failed:", error);
      }
      setIsLoading(false);
    };
    initiateBiometricFlow();
  }, []);


  useEffect(() => {
    if (isBiometricSupported && !biometricAttempted) {
      handleFaceIdLogin();
    }
  }, [isBiometricSupported, biometricAttempted]);


  const checkBiometricSupport = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (hasHardware && supportedTypes.length > 0) {
        setIsBiometricSupported(true);
      }
    } catch (error) {
      console.log('Biometric check error:', error);
    }
  };


  const handleForgotPassword = async () => {
    if (email) {
      navigation.navigate('ForgotPassword', {
        email // Type-safe - must match ForgotPassword params
      });
    } else {
      Alert.alert('Enter a valid Email');
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await login(email, password);
      if (res.data?.success && res.data?.result) {
        navigation.navigate('OTPValidation', {
          loginId: res.data.result, // Type-checked
          email,                   // Type-checked
          password                 // Type-checked
        });
      } else {
        Alert.alert('Login failed', res.data.message || 'Unknown error');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Login error', 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // const handleFaceIdLogin = async () => {
  //   setBiometricAttempted(true);
  //   try {
  //     const result = await LocalAuthentication.authenticateAsync({
  //       promptMessage: 'Authenticate to login',
  //       cancelLabel: 'Cancel',
  //     });

  //     if (result.success) {
  //       Alert.alert('Success', 'Authentication successful!');
  //       // Proceed with your login logic
  //     }
  //   } catch (error) {
  //     console.log('Biometric error:', error);
  //     if (biometricAttempted) {
  //       Alert.alert('Error', 'Authentication failed');
  //     }
  //   }
  // };

  const handleFaceIdLogin = async () => {
    setBiometricAttempted(true);

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to continue for Launch',
        cancelLabel: 'Cancel',
      });
      if (result.success) {
        // Alert.alert('Success', 'Authentication successful!'); 
        navigation.reset({
          index: 0,
          routes: [{ name: 'PortfolioScreen' }],
        });
      } else {
        Alert.alert('Failed', 'Biometric authentication failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Biometric authentication error occurred');
      console.log('Biometric error:', error);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentimagetop}>
        <Image source={require('../../assets/AfcTraverseLogo.png')} style={styles.image} />
      </View>
 
      <View style={styles.content}>
        <View style={styles.headerContainerWelcome}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.subtitle}>Please enter your details to login.</Text>
        </View>

        <Text style={styles.label}>Email Address*</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Enter Email"
        />
        <Text style={styles.label}>Password*</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            value={showPassword ? '*********' : password}
            onChangeText={setPassword}
            placeholder="Enter Password"
            secureTextEntry={showPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={toggleShowPassword}
          >
            <Text style={styles.eyeIcon}>
              {showPassword ? '👁' : '🚫'}
            </Text>
          </TouchableOpacity>
        </View>

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}

        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity onPress={handleForgotPassword} >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={handleRememberDevice}
          >
            {rememberDevice ? (
              <Text style={styles.checkboxChecked}>✓</Text>
            ) : (
              <Text style={styles.checkboxUnchecked}>□</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.checkboxLabel}>Remember this device</Text>
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {isBiometricSupported && (
          <>
            <Text style={styles.orText}>or login using</Text>
            <TouchableOpacity
              onPress={handleFaceIdLogin}
              style={styles.biometricButton}
            >
              <Image source={require('../../assets/faceid.png')} style={styles.biometricImage} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loader: {
    marginVertical: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainerWelcome: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '800',
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
  contentimagetop: {
    padding: 10,
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#fff',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  eyeButton: {
    padding: 10,
  },
  eyeIcon: {
    fontSize: 20,
    lineHeight: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#fff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    fontSize: 14,
    color: '#fff',
  },
  checkboxUnchecked: {
    fontSize: 14,
    color: 'transparent',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#fff',
  },
  loginButton: {
    backgroundColor: '#0071CF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  orText: {
    textAlign: 'center',
    color: '#fff',
    marginBottom: 20,
  },
  biometricButton: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20, // ✅ prevents overlap with bottom
  },
  biometricImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // ensure it's on top
  },
});

export default LoginScreen; 