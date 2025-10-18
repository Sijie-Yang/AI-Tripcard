import React, { useState } from 'react';
import styled from 'styled-components';
import { animated } from 'react-spring';
import { Mode } from '../types';

const CardContainer = styled(animated.div)`
  position: absolute;
  width: 90vw;
  max-width: 400px;
  height: 600px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  user-select: none;
  touch-action: none;
  overflow: hidden;
`;

const CardImage = styled.div<{ imageId: string }>`
  width: 100%;
  height: 70%;
  background: ${props => `url(${process.env.PUBLIC_URL}/60images/${props.imageId}.png)`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const CardContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.95);
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: #2c3e50;
  text-align: center;
  font-weight: 600;
`;

const PreviewButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const PreviewModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const PreviewContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const PreviewTitle = styled.h3`
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  text-align: center;
`;

const PreviewPrompt = styled.p`
  font-size: 1rem;
  color: #34495e;
  line-height: 1.6;
  margin: 1rem 0;
  white-space: pre-wrap;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #7f8c8d;
  
  &:hover {
    color: #34495e;
  }
`;

const SwipeInstruction = styled.div<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${props => props.direction === 'left' ? 'left: 1rem;' : 'right: 1rem;'}
  transform: translateY(-50%);
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  font-size: 1.2rem;
  color: ${props => props.direction === 'left' ? '#e74c3c' : '#2ecc71'};
  opacity: 0;
  transition: opacity 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  ${CardContainer}:hover & {
    opacity: 1;
  }
`;

interface CardProps {
  name: string;
  imageId: string;
  prompt: string;
  style?: any;
  mode: Mode;
}

const Card: React.FC<CardProps> = ({ name, imageId, prompt, style, mode }) => {
  const [showPreview, setShowPreview] = useState(false);

  const getInstructions = () => {
    if (mode === 'local') {
      return { left: "Haven't been", right: 'Been there' };
    }
    return { left: 'Not interested', right: 'Interested' };
  };

  const instructions = getInstructions();

  return (
    <>
      <CardContainer style={style}>
        <PreviewButton onClick={(e) => {
          e.stopPropagation();
          setShowPreview(true);
        }}>
          ℹ️
        </PreviewButton>
        <CardImage imageId={imageId} />
        <CardContent>
          <CardTitle>{name}</CardTitle>
        </CardContent>
        <SwipeInstruction direction="left">
          ← {instructions.left}
        </SwipeInstruction>
        <SwipeInstruction direction="right">
          {instructions.right} →
        </SwipeInstruction>
      </CardContainer>

      {showPreview && (
        <PreviewModal onClick={() => setShowPreview(false)}>
          <PreviewContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={() => setShowPreview(false)}>×</CloseButton>
            <PreviewTitle>{name}</PreviewTitle>
            <PreviewPrompt>{prompt}</PreviewPrompt>
          </PreviewContent>
        </PreviewModal>
      )}
    </>
  );
};

export default Card;