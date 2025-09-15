import React from 'react';
import { View } from 'react-native';
import { ToggleContainer, LearnMoreText } from '../styles/SubscriptionStyles';
import { Switch } from 'react-native';
import styled from 'styled-components/native';

interface ToggleButtonProps {
  isVisible: boolean;
  onPress: () => void;
}

const ToggleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`;

const ToggleText = styled.Text`
  font-size: 16px;
  color: #4B5563;
  margin-right: 10px;
`;

export const ToggleButton: React.FC<ToggleButtonProps> = ({ isVisible, onPress }) => (
  <ToggleContainer>
    <ToggleRow>
      <ToggleText>View All Controller Plans</ToggleText>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isVisible ? "#3B82F6" : "#f4f3f4"}
        onValueChange={onPress}
        value={isVisible}
      />
    </ToggleRow>
  </ToggleContainer>
);