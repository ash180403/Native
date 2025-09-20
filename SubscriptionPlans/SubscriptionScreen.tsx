import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollWrapper,
  SectionTitle,
  SectionDescription,
  LearnMoreText,
  HeaderContainer,
  BackButton,
  ScreenTitle,
  CloseButton, 
} from './styles/SubscriptionScreenStyles';
import { PlanCard } from './components/PlanCard';
import { useSubscriptionPlans } from './hooks/useSubscriptionPlans';
import { ToggleButton } from './components/ToggleButton';
import { StackNavigationProp } from '@react-navigation/stack';

type MainTabParamList = {
  Home: undefined;
  Subscription: undefined;
  'My Plants': undefined;
  Profile: undefined;
};

type SubscriptionScreenNavigationProp = StackNavigationProp<MainTabParamList, 'Subscription'>;

export default function SubscriptionScreen() {
  const navigation = useNavigation<SubscriptionScreenNavigationProp>();
  const { plans, showAllPlans, toggleAllPlans } = useSubscriptionPlans();

  const handlePressPlan = () => {
    console.log("Plan button pressed!");
    // Logic for what happens when a plan is selected.
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <HeaderContainer>
        <BackButton onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#1F2937" />
        </BackButton>
        <ScreenTitle>Your Subscriptions</ScreenTitle>
        <CloseButton onPress={() => console.log("Close pressed!")}>
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
    </SafeAreaView>
  );
}
