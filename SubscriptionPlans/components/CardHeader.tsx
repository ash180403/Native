import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { HeaderContainer, IconWrapper, PlanNameText, BorderLine } from '../styles/CardHeaderStyles';

interface CardHeaderProps {
  planName: string;
  tag?: string | null;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ planName, tag }) => {
  return (
    <>
      <HeaderContainer>
        <IconWrapper>
          <Ionicons name="pricetag-outline" size={24} color="#fff" />
        </IconWrapper>
        <PlanNameText>{planName}</PlanNameText>
      </HeaderContainer>
      <BorderLine />
    </>
  );
};
