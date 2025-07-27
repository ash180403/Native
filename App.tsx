import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import PaymentScreen from './screens/Payment'; // Ensure this path is correct
import MyPlants from './screens/MyPlants';
import GuideScreen from './screens/GuideScreen';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import { store } from './store/index';
import { StripeProvider } from '@stripe/stripe-react-native';

const Tab = createBottomTabNavigator();

export default function App() {
  // It's crucial to load your publishable key.
  // For simplicity, I'm hardcoding it here for demonstration.
  // In a real app, you might fetch this from an environment variable or a config file.
  // Make sure this matches process.env.STRIPE_PUBLISHABLE_KEY on your backend.
  const STRIPE_PUBLISHABLE_KEY = "pk_test_********************"; // REPLACE WITH YOUR ACTUAL PUBLISHABLE KEY

  return (
    <Provider store={store}>
      <StripeProvider
        publishableKey="pk_test_51RWvlgCtoFQ1cnwJR1zrzxsiZejqI0e9giqCjRuGOaMtvMi1QICUkYKh3l46x1u4A3DdAy6c5W2rXXigl8N8yYaT00n4sRp4O6"
        // urlScheme="your-app-url-scheme" // required for 3D Secure and other flows
        // merchantIdentifier="merchant.com.your-app-name" // required for Apple Pay
      >
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                let iconName: string;

                switch (route.name) {
                  case 'Home':
                    iconName = 'home';
                    break;
                  case 'Payment':
                    iconName = 'card';
                    break;
                  case 'My Plants':
                    iconName = 'leaf';
                    break;
                  case 'Guide':
                    iconName = 'book';
                    break;
                  default:
                    iconName = 'ellipse';
                }

                return <Ionicons name={iconName as any} size={size} color={color} />;
              },
              tabBarActiveTintColor: 'black',
              tabBarInactiveTintColor: 'gray',
              headerShown: false,
            })}
          >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Payment" component={PaymentScreen} /> 
            <Tab.Screen name="My Plants" component={MyPlants} />
            <Tab.Screen name="Guide" component={GuideScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </StripeProvider>
    </Provider>
  );
}