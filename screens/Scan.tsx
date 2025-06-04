import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView } from 'react-native';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #f6f7fb;
`;

const ScrollWrapper = styled(ScrollView).attrs({
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

const Input = styled.TextInput`
  background-color: #ffffff;
  padding: 14px 18px;
  border-radius: 12px;
  font-size: 16px;
  color: #111827;
  border: 1px solid #d1d5db;

  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
  elevation: 1;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: 12px;
`;

const HalfInput = styled(Input)`
  flex: 1;
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

  shadow-color: #000;
  shadow-offset: 0px 3px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 4;
`;

const PayButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 700;
`;

export default function PaymentScreen() {
  return (
    <Container>
      <ScrollWrapper showsVerticalScrollIndicator={false}>
        <Title>Payment Details</Title>

        <Section>
          <Label>Cardholder Name</Label>
          <Input placeholder="John Doe" placeholderTextColor="#9ca3af" />
        </Section>

        <Section>
          <Label>Card Number</Label>
          <Input
            placeholder="1234 5678 9012 3456"
            keyboardType="numeric"
            placeholderTextColor="#9ca3af"
          />
        </Section>

        <Row>
          <Section style={{ flex: 1 }}>
            <Label>Expiry Date</Label>
            <HalfInput
              placeholder="MM/YY"
              keyboardType="numeric"
              placeholderTextColor="#9ca3af"
              maxLength={5}
            />
          </Section>

          <Section style={{ flex: 1 }}>
            <Label>CVV</Label>
            <HalfInput
              placeholder="123"
              keyboardType="numeric"
              placeholderTextColor="#9ca3af"
              maxLength={4}
              secureTextEntry
            />
          </Section>
        </Row>

        <Section>
          <Label>Billing Zip Code</Label>
          <Input placeholder="12345" keyboardType="numeric" placeholderTextColor="#9ca3af" />
        </Section>

        <AmountBox>
          <AmountText>Total Amount: $19.99</AmountText>
        </AmountBox>

        <PayButton onPress={() => alert('Payment Successful')}>
          <PayButtonText>Pay Now</PayButtonText>
        </PayButton>
      </ScrollWrapper>
    </Container>
  );
}
