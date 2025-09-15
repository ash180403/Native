import styled from 'styled-components/native';
import { StyleSheet } from 'react-native';

interface CardWrapperProps {
  isCurrent: boolean;
  isRecommended: boolean;
}

export const CardWrapper = styled.View<CardWrapperProps>`
  background-color: #fff;
  border-radius: 16px;
  border: 2px solid ${({ isCurrent, isRecommended }) =>
    isCurrent ? '#22C55E' : isRecommended ? '#4ADE80' : '#E5E7EB'};
  padding: 20px;
  margin-bottom: 20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 6px;
  elevation: 3;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const IconBox = styled.View`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background-color: #3B82F6;
  margin-right: 10px;
`;

export const NameWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const PlanName = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #1F2937;
`;

export const TagBadge = styled.View`
  padding: 4px 10px;
  border-radius: 20px;
  background-color: #ECFDF5;
`;

export const TagBadgeText = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: #047857;
`;

export const NotEligibleBadge = styled(TagBadge)`
  background-color: #FEE2E2;
`;

export const NotEligibleBadgeText = styled(TagBadgeText)`
  color: #EF4444;
`;

export const ControllersText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  margin-top: 12px;
  color: #1F2937;
`;

export const SmsStorageText = styled.Text`
  font-size: 13px;
  color: #6B7280;
  margin-top: 2px;
  margin-bottom: 12px;
`;

export const FeaturesTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 6px;
`;

export const FeatureRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 6px;
`;

export const FeatureText = styled.Text`
  font-size: 14px;
  color: #4B5563;
  margin-left: 8px;
`;

export const PriceButton = styled.TouchableOpacity`
  border: 1px solid #D1D5DB;
  border-radius: 25px;
  padding: 12px;
  align-items: center;
  margin-top: 16px;
`;

export const PriceButtonText = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: #1F2937;
`;

export const styles = StyleSheet.create({
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#374151',
    marginRight: 6,
  },
});
