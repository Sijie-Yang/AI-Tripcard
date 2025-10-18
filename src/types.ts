export type Mode = 'local' | 'tourist';

export interface Card {
  id: string;
  name: string;
  prompt: string;
  imageId: string; // 对应 60images 文件夹中的图片ID，如 "poi_001"
}

export interface SwipeResult {
  cardId: string;
  isInterested: boolean;
  mode: Mode;
  timestamp: number;
}

export interface AppState {
  mode: Mode | null;
  currentCardIndex: number;
  swipeResults: SwipeResult[];
  cards: Card[];
}