import React from 'react';
import styled from 'styled-components';
import { Mode } from '../types';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 80%;
  max-width: 300px;
`;

const ModeButton = styled.button<{ mode: Mode }>`
  padding: 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
  background: ${props => props.mode === 'local' ? '#3498db' : '#e74c3c'};
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Description = styled.p`
  font-size: 1rem;
  color: #7f8c8d;
  text-align: center;
  margin-top: 0.5rem;
`;

interface ModeSelectorProps {
  onModeSelect: (mode: Mode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ onModeSelect }) => {
  return (
    <Container>
      <Title>Welcome to Singapore TripCard</Title>
      <ButtonContainer>
        <div>
          <ModeButton mode="local" onClick={() => onModeSelect('local')}>
            Local Mode
          </ModeButton>
          <Description>Have you been to these places?</Description>
        </div>
        <div>
          <ModeButton mode="tourist" onClick={() => onModeSelect('tourist')}>
            Tourist Mode
          </ModeButton>
          <Description>Would you like to explore these places?</Description>
        </div>
      </ButtonContainer>
    </Container>
  );
};

export default ModeSelector;
