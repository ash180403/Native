import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { supabase } from '../lib/supabase'; // Adjust the path as needed

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
`;

const Title = styled.Text`
  font-size: 24px;
  margin-bottom: 20px;
`;

const LogoutButton = styled.TouchableOpacity`
  background-color: #ef4444;
  padding: 12px 24px;
  border-radius: 20px;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 10px;
  shadow-offset: 0px 5px;
  elevation: 5;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;

export default function GuideScreen() {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      console.log('User logged out successfully');
    }
  };

  return (
    <Container>
      <Title>Guide</Title>
      <LogoutButton onPress={handleLogout}>
        <ButtonText>Logout</ButtonText>
      </LogoutButton>
    </Container>
  );
}