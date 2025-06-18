import AsyncStorage from '@react-native-async-storage/async-storage';

export const setAuthToken = async (token: string) => {
  await AsyncStorage.setItem('authToken', token);
};

export const getAuthToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('authToken');
};

export const clearAuthToken = async () => {
  await AsyncStorage.removeItem('authToken');
};
 