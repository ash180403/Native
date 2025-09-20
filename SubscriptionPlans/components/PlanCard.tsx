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

  const getIconColor = (planName: string) => {
    switch (planName) {
      case 'Starter':
        return '#81B29A';
      case 'Contractor':
        return '#4ADE80';
      case 'Bronze':
        return '#E59124';
      case 'Silver':
        return '#9CA3AF';
      case 'Gold':
        return '#FBBF24';
      case 'Platinum':
        return '#8B5CF6';
      case 'Double Platinum':
        return '#A78BFA';
      case 'Triple Platinum':
        return '#6366F1';
      default:
        return '#3B82F6';
    }
  };

  return (
    <CardWrapper isCurrent={plan.tag === 'Your Current Plan'} isRecommended={plan.tag === 'Recommended'}>
      <HeaderRow>
        <NameWrapper>
          <IconBox style={{ backgroundColor: getIconColor(plan.name) }} />
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