declare global {
  interface GameState {
    ships: number[][][];
    gridColors: string[][];
    remainingShips: number;
    hits: number[][][];
    misses: number[][];
    score: number;
  }

  interface RoundState {
    isRoundOver: boolean;
    isPlayerTurn: boolean;
    winner?: 'PLAYER' | 'OPPONENT';
  }

  interface GameSettings {
    shipSizes: number[];
    gameColorMap: number[];
    rows: number;
    columns: number;
  }

  interface GameColors {
    empty: string;
    miss: string;
    ally: string[];
    hit: string[];
    sunk: string[];
    icon: string;
    iconSunk: string;
  }

  interface GameIconInfo {
    type: string;
    name: string;
    color: string;
    size: number;
  }

  type GameMode = 'CLASSIC' | 'MOBILE';

  type GameSettingsModalTitle = 'Game Settings' | 'Create Room' | 'Join Room';

  type GameSettingsMap = Record<GameMode, GameSettings>;

  type GameIconMap = Record<string, GameIconInfo>;
}

export { };