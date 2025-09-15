import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  CardWrapper,
  HeaderRow,
  NameWrapper,
  IconBox,
  PlanName,
  TagBadge,
  TagBadgeText,
  NotEligibleBadge,
  NotEligibleBadgeText,
  ControllersText,
  SmsStorageText,
  FeaturesTitle,
  FeatureRow,
  FeatureText,
  PriceButton,
  PriceButtonText
} from '../styles/PlanCardStyles';
import { SubscriptionPlan } from '../types';

interface PlanCardProps {
  plan: SubscriptionPlan;
  onPress: () => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, onPress }) => {
  const renderTag = () => {
    if (plan.tag === 'Your Current Plan') {
      return <TagBadge><TagBadgeText>{plan.tag}</TagBadgeText></TagBadge>;
    }
    if (plan.tag === 'Recommended') {
      return <TagBadge><TagBadgeText>{plan.tag}</TagBadgeText></TagBadge>;
    }
    if (plan.tag === 'Not Eligible') {
      return <NotEligibleBadge><NotEligibleBadgeText>{plan.tag}</NotEligibleBadgeText></NotEligibleBadge>;
    }
    return null;
  };

  return (
    <CardWrapper isCurrent={plan.tag === 'Your Current Plan'} isRecommended={plan.tag === 'Recommended'}>
      <HeaderRow>
        <NameWrapper>
          <IconBox />
          <PlanName>{plan.name}</PlanName>
        </NameWrapper>
        {renderTag()}
      </HeaderRow>

      <ControllersText>{plan.controllers}</ControllersText>
      <SmsStorageText>{plan.smsStorage}</SmsStorageText>

      <FeaturesTitle>Everything in previous plan, plus:</FeaturesTitle>

      {plan.features.map((feature) => (
  <FeatureRow key={feature.id}>
    <Ionicons
      name={feature.isIncluded ? 'checkmark' : 'close'}
      size={16}
      color={feature.isIncluded ? '#22C55E' : '#EF4444'}
    />
    <FeatureText>{feature.text}</FeatureText>
  </FeatureRow>
))}


      <PriceButton onPress={onPress}>
        <PriceButtonText>From ${plan.priceAmount}/year</PriceButtonText>
      </PriceButton>
    </CardWrapper>
  );
};
