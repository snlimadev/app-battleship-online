import { GAME_COLORS } from '../../config/gameConfig';

/**
 * Updates the player's and opponent's game state, as well as the round state,
 * based on the provided `move` parameter.
 * 
 * @param {GameSettings} gameSettings - The `CLASSIC` or `MOBILE` game settings.
 * @param {[number, number]} move - The player's move.
 * @param {GameState} playerState - The player's game state.
 * @param {React.Dispatch<React.SetStateAction<GameState>>} setPlayerState
 * - The function to update the player's game state.
 * @param {GameState} opponentState - The opponent's game state.
 * @param {React.Dispatch<React.SetStateAction<GameState>>} setOpponentState
 * - The function to update the opponent's game state.
 * @param {React.Dispatch<React.SetStateAction<RoundState>>} setRoundState
 * - The function to update the round state.
 * 
 * @returns {void} This function does not return any value.
 */
export function updateGameState(
  gameSettings: GameSettings,
  move: [number, number],
  playerState: GameState,
  setPlayerState: React.Dispatch<React.SetStateAction<GameState>>,
  opponentState: GameState,
  setOpponentState: React.Dispatch<React.SetStateAction<GameState>>,
  setRoundState: React.Dispatch<React.SetStateAction<RoundState>>
): void {
  const { gameColorMap } = gameSettings;

  const newPlayerState: GameState = { ...playerState };
  const newOpponentState: GameState = { ...opponentState };
  const ships: readonly number[][][] = opponentState.ships;
  const newGridColors: string[][] = newOpponentState.gridColors;
  const newHits: number[][][] = newPlayerState.hits;
  const newMisses: number[][] = newPlayerState.misses;

  let isHit: boolean = false;
  let shipIndex: number = -1;
  let isRoundOver: boolean = false;

  for (let i: number = 0; i < ships.length; i++) {
    if (ships[i].some(ship => move[0] === ship[0] && move[1] === ship[1])) {
      isHit = true;
      shipIndex = i;
      break;
    }
  }

  if (isHit) {
    newHits[shipIndex].push(move);
    newGridColors[move[0]][move[1]] = GAME_COLORS.hit[gameColorMap[shipIndex]];

    if (newHits[shipIndex].length === ships[shipIndex].length) {
      newOpponentState.remainingShips -= 1;

      ships[shipIndex].forEach(([row, column]) => {
        newGridColors[row][column] = GAME_COLORS.sunk[gameColorMap[shipIndex]];
      });

      if (newOpponentState.remainingShips === 0) {
        newPlayerState.score += 1;
        isRoundOver = true;
      }
    }
  } else {
    newMisses.push(move);
    newGridColors[move[0]][move[1]] = GAME_COLORS.miss;
  }

  setPlayerState(newPlayerState);
  setOpponentState(newOpponentState);

  setRoundState((prevState) => ({
    isRoundOver: isRoundOver,
    isPlayerTurn: !prevState.isPlayerTurn,
    winner: (isRoundOver) ? ((prevState.isPlayerTurn) ? 'PLAYER' : 'OPPONENT') : undefined
  }));
}