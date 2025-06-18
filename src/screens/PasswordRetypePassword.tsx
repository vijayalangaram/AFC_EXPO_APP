import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

interface RouteParams {
  email: string;
  loginId?: string;
  password?: string;
}

const PasswordRetypePassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params as RouteParams;

  const EyeIcon = ({ visible }: { visible: boolean }) => (
    <Text style={styles.eyeIcon}>
      {visible ? '🚫' : '👁️'}
    </Text>
  );

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please enter both password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!isPasswordValid(newPassword)) {
      Alert.alert(
        'Password Requirements',
        'Password must be at least 10 characters long and include a mix of uppercase, lowercase, numbers, and special symbols.'
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/user/reset-password`, {
        email,
        newPassword: confirmPassword
      });

      if (response.data) {
        Alert.alert('Success', response.data.message || 'Password reset successfully!');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', response.data.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      Alert.alert('Error', 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isPasswordValid = (password: string) => {
    if (password.length < 10) return false;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUpper && hasLower && hasNumber && hasSpecial;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentimagetop}>
        <Image source={require('../../assets/images.png')} style={styles.image} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Reset Your Password</Text>
        <Text style={styles.subtitle}>Enter a New Password for Your Account</Text>

        <Text style={styles.label}>Enter New Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            secureTextEntry={!showNewPassword}
            placeholder="Enter new password"
            placeholderTextColor="#999"
            value={newPassword}
            onChangeText={setNewPassword}
            autoCapitalize="none"
            editable={!isLoading}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowNewPassword(!showNewPassword)}
            disabled={isLoading}
          >
            <EyeIcon visible={showNewPassword} />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            secureTextEntry={!showConfirmPassword}
            placeholder="Confirm new password"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoCapitalize="none"
            editable={!isLoading}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
          >
            <EyeIcon visible={showConfirmPassword} />
          </TouchableOpacity>
        </View>

        <View style={styles.noteContainer}>
          <Text style={styles.noteTitle}>Note:</Text>
          <Text style={styles.noteText}>
            <Text style={styles.noteTitle}>• Length:</Text> Use at least 10 characters.
          </Text>
          <Text style={styles.noteText}>
            <Text style={styles.noteTitle}>• Mix of Characters:</Text> Include uppercase, lowercase, numbers, and symbols.
          </Text>
          <Text style={styles.noteText}>
            <Text style={styles.noteTitle}>• Avoid Common Words:</Text> Don't use easily guessable words.
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#0071CF" style={styles.loader} />
        ) : (
          <TouchableOpacity
            style={[styles.button, isLoading && styles.disabledButton]}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Reset Password</Text>
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
    margin: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#fff',
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
    color: '#000',
    paddingRight: 40,
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    padding: 10,
  },
  eyeIcon: {
    fontSize: Platform.OS === 'ios' ? 20 : 18,
    color: '#666',
  },
  noteContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  noteText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
    opacity: 0.8,
  },
  button: {
    backgroundColor: '#0071CF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginVertical: 20,
  },
});

export default PasswordRetypePassword;