import { GAME_COLORS } from '../../config/gameConfig';

/**
 * Initializes the game state based on the provided parameters.
 * 
 * @param {GameSettings} gameSettings - The `CLASSIC` or `MOBILE` game settings.
 * @param {number} [score=0] - Optional value for the score; 0 if not provided.
 * 
 * @returns {GameState} The initialized game state.
 */
export function initializeGameState(
  gameSettings: GameSettings,
  score?: number
): GameState {
  const { shipSizes, rows, columns } = gameSettings;

  const newGameState: GameState = {
    ships: shipSizes.map(size => Array.from({ length: size }, () => [])),
    gridColors: Array.from({ length: rows }, () => Array(columns).fill(GAME_COLORS.empty)),
    remainingShips: shipSizes.length,
    hits: Array.from({ length: shipSizes.length }, () => []),
    misses: [],
    score: score || 0
  };

  return newGameState;
}