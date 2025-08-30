import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './store';
import { StripeProvider } from '@stripe/stripe-react-native';
import AuthStack from './navigation/AuthStack';
import MainTabs from './navigation/MainTabs';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js'; // Import the Session type

export default function App() {
  // Explicitly define the type for the session state
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Check for an existing session on initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Set up the listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Provider store={store}>
      <StripeProvider publishableKey="pk_test_51RWvlgCtoFQ1cnwJR1zrzxsiZejqI0e9giqCjRuGOaMtvMi1QICUkYKh3l46x1u4A3DdAy6c5W2rXXigl8N8yYaT00n4sRp4O6">
        <NavigationContainer>
          {/* Now the session object is correctly typed, so the check works */}
          {session && session.user ? <MainTabs /> : <AuthStack />}
        </NavigationContainer>
      </StripeProvider>
    </Provider>
  );
}