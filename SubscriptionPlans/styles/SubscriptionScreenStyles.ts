import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #F8F9FA;
`;

export const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background-color: #fff;
  border-bottom-width: 1px;
  border-bottom-color: #E2E8F0;
  `;

export const BorderLine = styled.View`
  height: 1px;
  background-color: #E2E8F0;
`;

export const BackButton = styled.TouchableOpacity`
  padding: 8px;
`;

export const ScreenTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #1F2937;
  flex: 1; /* This makes the title take up all available space */
  text-align: center; 
  padding-right: 32px; /* To offset the back button space */
`;

export const CloseButton = styled.TouchableOpacity`
  padding: 8px;
`;

export const ScrollWrapper = styled.ScrollView`
  padding: 24px 20px;
`;

export const SectionTitle = styled.Text`
  font-size: 25px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 8px;
`;

export const SectionDescription = styled.Text`
  font-size: 15px;
  color: #000000ff;
  line-height: 20px;
  margin-bottom: 24px;
  font-weight: 600;
`;

export const LearnMoreText = styled.Text`
  color: #3B82F6;
  font-weight: 500;
`;