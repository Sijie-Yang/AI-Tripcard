import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ModeSelector from './components/ModeSelector';
import CardStack from './components/CardStack';
import { Mode, Card, SwipeResult, AppState } from './types';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const ResultScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const ResultTitle = styled.h2`
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ResultStats = styled.div`
  font-size: 1.2rem;
  color: #34495e;
  margin-bottom: 2rem;
  text-align: center;
`;

const RestartButton = styled.button`
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  background: #3498db;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    mode: null,
    currentCardIndex: 0,
    swipeResults: [],
    cards: []
  });

  useEffect(() => {
    // Load cards from your JSON files
    const loadCards = async () => {
      try {
        const response1 = await fetch('/poi_sg_01_20.json');
        const cards1 = await response1.json();
        const response2 = await fetch('/poi_sg_21_40.json');
        const cards2 = await response2.json();
        const response3 = await fetch('/poi_sg_41_60.json');
        const cards3 = await response3.json();
        
        setState(prev => ({
          ...prev,
          cards: [...cards1, ...cards2, ...cards3]
        }));
      } catch (error) {
        console.error('Error loading cards:', error);
      }
    };

    loadCards();
  }, []);

  const handleModeSelect = (selectedMode: Mode) => {
    setState(prev => ({ ...prev, mode: selectedMode }));
  };

  const handleComplete = (results: SwipeResult[]) => {
    setState(prev => ({ ...prev, swipeResults: results }));
  };

  const handleRestart = () => {
    setState(prev => ({
      ...prev,
      mode: null,
      currentCardIndex: 0,
      swipeResults: []
    }));
  };

  const renderContent = () => {
    if (!state.mode) {
      return <ModeSelector onModeSelect={handleModeSelect} />;
    }

    if (state.swipeResults.length === state.cards.length) {
      const interestedCount = state.swipeResults.filter(r => r.isInterested).length;
      return (
        <ResultScreen>
          <ResultTitle>
            {state.mode === 'local' ? 'Places You\'ve Been' : 'Places You Want to Visit'}
          </ResultTitle>
          <ResultStats>
            {interestedCount} out of {state.cards.length} places
            {state.mode === 'local' ? ' visited!' : ' interested in visiting!'}
          </ResultStats>
          <RestartButton onClick={handleRestart}>
            Start Over
          </RestartButton>
        </ResultScreen>
      );
    }

    return (
      <CardStack
        cards={state.cards}
        mode={state.mode}
        onComplete={handleComplete}
      />
    );
  };

  return <AppContainer>{renderContent()}</AppContainer>;
};

export default App;
