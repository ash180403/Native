import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #F8F9FA;
`;

export const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #fff;
  border-bottom-width: 1px;
  border-bottom-color: #E2E8F0;
`;

export const BackButton = styled.TouchableOpacity`
  padding: 8px;
`;

export const ScreenTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #1F2937;
`;

export const CloseButton = styled.TouchableOpacity`
  padding: 8px;
`;

export const ScrollWrapper = styled.ScrollView`
  padding: 24px 20px;
`;

export const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: #1F2937;
  text-align: center;
  margin-bottom: 8px;
`;

export const SectionDescription = styled.Text`
  font-size: 14px;
  color: #6B7280;
  text-align: center;
  line-height: 20px;
  margin-bottom: 24px;
`;

export const LearnMoreText = styled.Text`
  color: #3B82F6;
  font-weight: 500;
`;

export const ToggleContainer = styled.View`
  align-items: center;
  margin-top: 10px;
  margin-bottom: 20px;
`;

export const ToggleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`; 

export const ToggleText = styled.Text`
  font-size: 18px;
  color: #000000ff;
  margin-right: 10px;`;

  export const NextStepText = styled.Text`
  font-size: 14px;
  color: #a0a0a0ff;
  text-align: center;
  margin-top: 5px;
  padding-bottom: 10px;
`;