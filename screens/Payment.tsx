import React, { useState, useEffect } from 'react'; // Import useEffect
import styled from 'styled-components/native';
import { ScrollView, Alert, ActivityIndicator, Platform } from 'react-native'; // Import Platform
import {
  useStripe,
  CardForm,
  PaymentIntent,
  usePlatformPay, // Import usePlatformPay
  PlatformPayButton, // Import PlatformPayButton
  PlatformPay, // Import PlatformPay types
} from '@stripe/stripe-react-native';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #f6f7fb;
`;

const ScrollWrapper = styled.ScrollView.attrs({
  contentContainerStyle: {
    padding: 24,
    paddingBottom: 60,
  },
})``;

const Title = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin-top: 24px;
  margin-bottom: 30px;
`;

const Section = styled.View`
  margin-bottom: 28px;
`;

const Label = styled.Text`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 6px;
`;

const StyledCardForm = styled(CardForm)`
  height: 200px;
  margin-bottom: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
  elevation: 1;
`;

const AmountBox = styled.View`
  background-color: #e0f2f1;
  padding: 18px;
  border-radius: 14px;
  align-items: center;
`;

const AmountText = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: #009688;
`;

const PayButton = styled.TouchableOpacity`
  background-color: #3b82f6;
  padding: 16px;
  border-radius: 14px;
  align-items: center;
  margin-top: 28px;
`;

const PayButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 700;
`;

const TestCardInfo = styled.View`
  margin-top: 10px;
  background-color: #fff7ed;
  padding: 14px;
  border-radius: 12px;
  border: 1px dashed #fbbf24;
`;

const TestCardText = styled.Text`
  font-size: 14px;
  color: #92400e;
  line-height: 22px;
`;

// Styled component for Google Pay button to match your existing button style if desired
const StyledPlatformPayButton = styled(PlatformPayButton)`
  width: 100%;
  height: 50px; /* Standard button height for Google Pay */
  margin-top: 20px; /* Spacing */
`;


const BACKEND_URL = 'http://192.168.29.222:3000/create-payment-intent';

export default function PaymentScreen() {
  const { confirmPayment } = useStripe();
  const { isPlatformPaySupported, confirmPlatformPayPayment } = usePlatformPay(); // Destructure from usePlatformPay
  const [loading, setLoading] = useState(false);
  const [cardDetailsComplete, setCardDetailsComplete] = useState(false);
  const [googlePaySupported, setGooglePaySupported] = useState(false); // New state for Google Pay support

  const amountToPay = 1999; // $19.99
  const currency = 'usd'; // Match this with your backend's expected currency

  // Check for Google Pay support on component mount
  useEffect(() => {
    async function checkSupport() {
      if (Platform.OS === 'android') { // Google Pay is Android-specific
        const supported = await isPlatformPaySupported({
          googlePay: {
            testEnv: true, // Set to false for production
          },
        });
        setGooglePaySupported(supported);
      }
    }
    checkSupport();
  }, [isPlatformPaySupported]);


  const fetchClientSecret = async (): Promise<string | null> => {
    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // It's good practice to send the payment method type to the backend
        // so it can create a PaymentIntent with the correct capabilities.
        // For Google Pay, it's 'card' by default or 'google_pay' if specifically enabled on PI.
        // For simplicity here, we'll assume 'card' is sufficient.
        body: JSON.stringify({ amount: amountToPay, currency, paymentMethodType: 'card' }), // Add paymentMethodType
      });

      const data = await response.json();

      if (!response.ok || !data.clientSecret) {
        Alert.alert('Server Error', data.error || 'Failed to get client secret.');
        return null;
      }

      return data.clientSecret;
    } catch (error) {
      console.error("Fetch client secret error:", error); // Log the actual error
      Alert.alert('Network Error', 'Could not connect to backend.');
      return null;
    }
  };

  const handlePayPress = async () => {
    if (!cardDetailsComplete) {
      Alert.alert('Incomplete Details', 'Please complete the card form.');
      return;
    }

    setLoading(true);
    const clientSecret = await fetchClientSecret();

    if (!clientSecret) {
      setLoading(false);
      return;
    }

    const { paymentIntent, error } = await confirmPayment(clientSecret, {
      paymentMethodType: 'Card',
    });

    if (error) {
      Alert.alert('Payment Failed', error.message || 'Try again later.');
    } else if (paymentIntent?.status === 'Succeeded') {
      Alert.alert('Success', 'Payment completed!');
    } else {
      Alert.alert('Payment Status', `Status: ${paymentIntent?.status}`);
    }

    setLoading(false);
  };


  const handleGooglePayPress = async () => {
    setLoading(true); // Indicate loading for Google Pay as well

    const clientSecret = await fetchClientSecret();

    if (!clientSecret) {
      setLoading(false);
      return;
    }

    try {
      // Configuration for Google Pay
      const googlePayConfig = {
  testEnv: true,
  merchantName: 'Your Business Name',
  merchantCountryCode: 'IN',
  currencyCode: currency.toUpperCase(),
  billingAddressConfig: {
    format: PlatformPay.BillingAddressFormat.Full,
    isPhoneNumberRequired: false,
    isRequired: false,
  },
};

      const { paymentIntent, error } = await confirmPlatformPayPayment(
        clientSecret,
        {
          googlePay: googlePayConfig,
        }
      );

      if (error) {
        Alert.alert('Google Pay Failed', error.message || 'Google Pay transaction failed.');
      } else if (paymentIntent?.status === 'Succeeded') {
        Alert.alert('Success', 'Google Pay payment completed!');
      } else {
        Alert.alert('Google Pay Status', `Status: ${paymentIntent?.status}`);
      }
    } catch (e) {
      console.error("Google Pay error:", e);
      Alert.alert('Google Pay Error', 'An unexpected error occurred with Google Pay.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <ScrollWrapper showsVerticalScrollIndicator={false}>
        <Title>Payment Details</Title>

        <Section>
          <Label>Card Details</Label>
          <StyledCardForm
            onFormComplete={(cardDetails) => {
              setCardDetailsComplete(cardDetails.complete);
            }}
            cardStyle={{
              backgroundColor: '#ffffff',
              textColor: '#111827',
              placeholderColor: '#9ca3af',
              borderColor: '#d1d5db',
              borderWidth: 1,
              borderRadius: 12,
            }}
          />
        </Section>

        {/* Google Pay Button */}
       {Platform.OS === 'android' && googlePaySupported && (
  <Section>
    <Label>Pay with Google Pay</Label>
   <PlatformPayButton
  type={PlatformPay.ButtonType.Pay}
  style={{ width: '100%', height: 50, marginTop: 20 }}
  onPress={handleGooglePayPress}
  disabled={loading}
/>
  </Section>
)}
        <AmountBox>
          <AmountText>Total Amount: ${(amountToPay / 100).toFixed(2)}</AmountText>
        </AmountBox>

        <PayButton onPress={handlePayPress} disabled={loading || !cardDetailsComplete}>
          {loading ? <ActivityIndicator color="#ffffff" /> : <PayButtonText>Pay Now (Card)</PayButtonText>}
        </PayButton>
      </ScrollWrapper>
    </Container>
  );
}