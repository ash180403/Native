import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, Alert, ActivityIndicator } from 'react-native';
import {
  useStripe,
  CardForm,
  PaymentIntent,
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

const BACKEND_URL = 'http://192.168.29.222:3000/create-payment-intent';

export default function PaymentScreen() {
  const { confirmPayment } = useStripe();
  const [loading, setLoading] = useState(false);
  const [cardDetailsComplete, setCardDetailsComplete] = useState(false);

  const amountToPay = 1999; // $19.99
  const currency = 'usd';

  const fetchClientSecret = async (): Promise<string | null> => {
    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amountToPay, currency }),
      });

      const data = await response.json();

      if (!response.ok || !data.clientSecret) {
        Alert.alert('Server Error', data.error || 'Failed to get client secret.');
        return null;
      }

      return data.clientSecret;
    } catch (error) {
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
    } else if (paymentIntent?.status === 'Succeeded' ) {
      Alert.alert('Success', 'Payment completed!');
    } else {
      Alert.alert('Payment Status', `Status: ${paymentIntent?.status}`);
    }

    setLoading(false);
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

        <TestCardInfo>
          <TestCardText>💳 Test Card Number: 4242 4242 4242 4242</TestCardText>
          <TestCardText>📅 Expiry: Any future date (e.g., 04/27)</TestCardText>
          <TestCardText>🔐 CVC: Any 3-digit (e.g., 123)</TestCardText>
          <TestCardText>🌍 Country: India (or any)</TestCardText>
        </TestCardInfo>

        <AmountBox>
          <AmountText>Total Amount: ${(amountToPay / 100).toFixed(2)}</AmountText>
        </AmountBox>

        <PayButton onPress={handlePayPress} disabled={loading || !cardDetailsComplete}>
          {loading ? <ActivityIndicator color="#ffffff" /> : <PayButtonText>Pay Now</PayButtonText>}
        </PayButton>
      </ScrollWrapper>
    </Container>
  );
}
