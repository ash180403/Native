import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
`;

const Title = styled.Text`
  font-size: 24px;
  `;

export default function MyPlantsScreen() {
  return (
    <Container>
      <Title>My Plants</Title>
    </Container>
  );
}
