import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import LoginScreen from './src/screens/LoginScreen';
import OTPValidation from './src/screens/OTPValidation';
import PortfolioScreen from './src/screens/PortfolioScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import SummaryScreen from './src/screens/SummaryScreen';
import PasswordRetypePassword from "./src/screens/PasswordRetypePassword";
import CustomDrawer from './src/components/CustomDrawer'; // Import your custom drawer

// Define your main stack param list
export type RootStackParamList = {
  Login: undefined;
  ForgotPassword: { email: string };
  OTPValidation: {
    loginId: string;
    email: string;
    password: string;
  };
  Password_retype_password: { email: string };
  PortfolioScreen: undefined;
  SummaryScreen: { account: any }; // Consider replacing 'any' with proper interface
};

// Define drawer param list
type DrawerParamList = {
  Portfolio: undefined;
  // Add other drawer screens here if needed
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

function MainDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Portfolio"
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        overlayColor: 'transparent',
        drawerStyle: {
          width: '80%', // Adjust drawer width
        }
      }}
    >
      <Drawer.Screen
        name="Portfolio"
        component={PortfolioScreen}
        options={{ 
          title: 'My Portfolio',
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: 'bold',
          }
        }}
      />
      {/* Add other drawer screens here when needed */}
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      >
        {/* Auth Screens */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen 
          name="OTPValidation" 
          component={OTPValidation} 
        />
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPasswordScreen} 
        />
        <Stack.Screen 
          name="Password_retype_password" 
          component={PasswordRetypePassword} 
        />

        {/* Main App Screens */}
        <Stack.Screen
          name="PortfolioScreen"
          component={MainDrawer}
          options={{
            gestureEnabled: false, // Disable swipe back to auth screens
          }}
        />
        <Stack.Screen
          name="SummaryScreen"
          component={SummaryScreen}
          options={{
            presentation: 'card', // Default iOS style navigation
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 