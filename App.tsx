import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './store';
import { StripeProvider } from '@stripe/stripe-react-native';
import AuthStack from './navigation/AuthStack';
import MainTabs from './navigation/MainTabs';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with actual auth logic

  return (
    <Provider store={store}>
      <StripeProvider publishableKey="pk_test_51RWvlgCtoFQ1cnwJR1zrzxsiZejqI0e9giqCjRuGOaMtvMi1QICUkYKh3l46x1u4A3DdAy6c5W2rXXigl8N8yYaT00n4sRp4O6">
        <NavigationContainer>
          <MainTabs />
          {/* Uncomment the line below to switch between AuthStack and MainTabs based on isLoggedIn */}
           {/* {isLoggedIn ? <MainTabs /> : <AuthStack />}  */}
        </NavigationContainer>
      </StripeProvider>
    </Provider>
  );
}
