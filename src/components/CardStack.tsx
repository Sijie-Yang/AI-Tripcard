import React, { useState } from 'react';
import { useSprings, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import styled from 'styled-components';
import Card from './Card';
import { Card as CardType, Mode, SwipeResult } from '../types';

const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const Progress = styled.div`
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  font-size: 1.2rem;
  color: #2c3e50;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

interface CardStackProps {
  cards: CardType[];
  mode: Mode;
  onComplete: (results: SwipeResult[]) => void;
}

const to = (i: number) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
});

const from = (_i: number) => ({
  x: 0,
  rot: 0,
  scale: 1.5,
  y: -1000,
});

const trans = (r: number, s: number) =>
  `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;

const CardStack: React.FC<CardStackProps> = ({ cards, mode, onComplete }) => {
  const [gone] = useState(() => new Set());
  const [results, setResults] = useState<SwipeResult[]>([]);

  const [props, api] = useSprings(cards.length, i => ({
    ...to(i),
    from: from(i),
  }));

  const bind = useDrag(({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
    const trigger = velocity > 0.2;
    const dir = xDir < 0 ? -1 : 1;
    
    if (!down && trigger) {
      gone.add(index);
      const newResult: SwipeResult = {
        cardId: cards[index].id,
        isInterested: dir > 0,
        mode,
        timestamp: Date.now(),
      };
      
      const newResults = [...results, newResult];
      setResults(newResults);

      if (gone.size === cards.length) {
        setTimeout(() => onComplete(newResults), 600);
      }
    }

    api.start(i => {
      if (index !== i) return;
      const isGone = gone.has(index);
      const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0;
      const rot = mx / 100 + (isGone ? dir * 10 * velocity : 0);
      const scale = down ? 1.1 : 1;
      return {
        x,
        rot,
        scale,
        delay: undefined,
        config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
      };
    });
  });

  return (
    <Container>
      <Progress>
        {gone.size} / {cards.length}
      </Progress>
      {props.map(({ x, y, rot, scale }, i) => (
        <animated.div
          key={i}
          style={{
            position: 'absolute',
            transform: to([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`),
          }}
        >
          <animated.div
            {...bind(i)}
            style={{
              transform: rot.to(rot => `rotate(${rot}deg)`),
              scale: scale,
            }}
          >
            <Card
              name={cards[i].name}
              imageId={cards[i].id}
              prompt={cards[i].prompt}
              mode={mode}
            />
          </animated.div>
        </animated.div>
      ))}
    </Container>
  );
};

export default CardStack;