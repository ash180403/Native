import React from 'react';
import { View } from 'react-native';
import { ToggleContainer, ToggleRow, ToggleText, NextStepText } from '../styles/ToggleButtonStyles';
import { Switch } from 'react-native';

interface ToggleButtonProps {
  isVisible: boolean;
  onPress: () => void;
}

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
    <NextStepText>Next: Choose your feature level (Essentials or Elite)</NextStepText>
  </ToggleContainer>
);