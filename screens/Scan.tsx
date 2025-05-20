import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
`;

const ScreenText = styled.Text`
  font-size: 24px;
  color:rgb(0, 0, 0);
`;

export default function ScanScreen() {
  return (
    <Container>
      <ScreenText>Scan Screen</ScreenText>
    </Container>
  );
}
