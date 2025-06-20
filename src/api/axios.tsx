import React from 'react'; // Add this import
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/constants';
import { Alert } from 'react-native';
import { NavigationContainerRef } from '@react-navigation/native';


// Create a ref to hold the navigation object
// export const navigationRef = React.createRef();
export const navigationRef = React.createRef<NavigationContainerRef<any>>();


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  // debugger
  // console.log('Starting Request', config); 
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(['authToken', 'accountId']);
      await AsyncStorage.removeItem('authToken');
      const currentRoute = navigationRef.current?.getCurrentRoute()?.name;
      if (currentRoute !== 'Login') {
        navigationRef.current?.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
      // Alert.alert('Session Expired', 'Please click OK to login again.', [
      //   {
      //     text: 'OK',
      //     onPress: () => {
      //       const currentRoute = navigationRef.current?.getCurrentRoute()?.name;
      //       if (currentRoute !== 'Login') {
      //         navigationRef.current?.reset({
      //           index: 0,
      //           routes: [{ name: 'Login' }],
      //         });
      //       }
      //     }
      //   },
      // ]);
    }
    return Promise.reject(error);
  }
);

export default api;
