import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import OTPValidation from './src/screens/OTPValidation';
import PortfolioScreen from './src/screens/PortfolioScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import SummaryScreen from './src/screens/SummaryScreen';
import PasswordRetypePassword from "./src/screens/PasswordRetypePassword"

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
  SummaryScreen: { account?: any }; // Make account optional or define proper type 
};

// Define drawer param list if you have additional screens in the drawer
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
      screenOptions={{
        headerShown: false // Hide header since you're handling it in PortfolioScreen
      }}
    >
      <Drawer.Screen
        name="Portfolio"
        component={PortfolioScreen}
        options={{ title: 'My Portfolio' }} // Customize drawer label
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
          animation: 'slide_from_right', // Add smooth transitions
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
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
        <Stack.Screen
          name="PortfolioScreen"
          component={MainDrawer} 
          options={{
            gestureEnabled: false, // Disable swipe back on iOS
          }}
        />
        <Stack.Screen
          name="SummaryScreen"
          component={SummaryScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 