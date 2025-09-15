import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {
  Container,
  ScrollWrapper,
  SectionTitle,
  SectionDescription,
  LearnMoreText,
  HeaderContainer,
  BackButton,
  ScreenTitle,
  CloseButton,
} from './styles/SubscriptionStyles';
import { PlanCard } from './components/PlanCard';
import { useSubscriptionPlans } from './hooks/useSubscriptionPlans';
import { ToggleButton } from './components/ToggleButton';

type MainTabParamList = {
  Home: undefined;
  Subscription: undefined;
  'My Plants': undefined;
  Profile: undefined;
};

import { StackNavigationProp } from '@react-navigation/stack';
type SubscriptionScreenNavigationProp = StackNavigationProp<MainTabParamList, 'Subscription'>;

export default function SubscriptionScreen() {
  const navigation = useNavigation<SubscriptionScreenNavigationProp>();
  const { plans, showAllPlans, toggleAllPlans } = useSubscriptionPlans();

  const handlePressPlan = () => {
    console.log("Plan button pressed!");
    // Logic for what happens when a plan is selected.
    // We can add navigation to a payment screen here later.
  };

  return (
    <Container>
      <HeaderContainer>
        <BackButton onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </BackButton>
        <ScreenTitle>Select Plan</ScreenTitle>
        <CloseButton onPress={() => navigation.navigate('Home')}>
          <Ionicons name="close" size={24} color="#1F2937" />
        </CloseButton>
      </HeaderContainer>

      <ScrollWrapper>
        <SectionTitle>Select Plan</SectionTitle>
        <SectionDescription>
          Step 1: Choose a plan based on your controller
          count, storage, and support needs. <LearnMoreText>Learn how plans vary by capacity,
          storage, and support.</LearnMoreText>
        </SectionDescription>

        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onPress={handlePressPlan} />
        ))}
        
        <ToggleButton isVisible={showAllPlans} onPress={toggleAllPlans} />

      </ScrollWrapper>
    </Container>
  );
}
