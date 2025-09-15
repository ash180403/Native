import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';

interface CardHeaderProps {
  planName: string;
  tag?: string | null; 
}

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const IconWrapper = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #3B82F6;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const PlanNameText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #1F2937;
`;

export const CardHeader: React.FC<CardHeaderProps> = ({ planName, tag }) => {
  return (
    <HeaderContainer>
      <IconWrapper>
        <Ionicons name="pricetag-outline" size={24} color="#fff" />
      </IconWrapper>
      <PlanNameText>{planName}</PlanNameText>
    </HeaderContainer>
  );
};
