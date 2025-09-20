import styled from 'styled-components/native';
import { StyleSheet } from 'react-native';

export const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

export const IconWrapper = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #3B82F6;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

export const BorderLine = styled.View`
  width: 100%;
  height: 1px;
  background-color: #E2E8F0;
  margin-top: 8px;
`;


export const PlanNameText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #1F2937;
`;

