import { validateMove } from '../../utils/game/validateMove';

/**
 * Generates a valid move based on the provided game settings and game state.
 * 
 * @param {GameSettings} gameSettings - The `CLASSIC` or `MOBILE` game settings.
 * @param {GameState} gameState - The game state that the move is validated against.
 * 
 * @returns {[number, number]} The generated move.
 */
export function getComputerMove(
  gameSettings: GameSettings,
  gameState: GameState
): [number, number] {
  const { shipSizes, rows, columns } = gameSettings;
  const { hits } = gameState;

  let computerMove: [number, number] = [-1, -1];
  let isValid: boolean = false;

  const attemptMove = (row: number, column: number): boolean => {
    computerMove = [row, column];
    isValid = validateMove(gameSettings, gameState, computerMove);

    return isValid;
  };

  for (let i: number = 0; i < hits.length; i++) {
    const currHit: number[][] = hits[i];

    if (currHit.length < shipSizes[i]) {
      let isVertical: boolean = false;

      if (currHit.length > 1) {
        const firstHit: [number, number] = [currHit[0][0], currHit[0][1]];

        if (
          currHit.some(([r, c]) =>
            (r === firstHit[0] - 1 || r === firstHit[0] + 1) && c === firstHit[1]
          )
        ) {
          isVertical = true;
        }
      }

      for (let j: number = 0; j < currHit.length; j++) {
        const row: number = currHit[j][0];
        const column: number = currHit[j][1];

        if (currHit.length > 1) {
          if (isVertical) {
            if (attemptMove(row - 1, column) || attemptMove(row + 1, column)) {
              break;
            }
          } else {
            if (attemptMove(row, column - 1) || attemptMove(row, column + 1)) {
              break;
            }
          }
        } else {
          if (
            attemptMove(row, column - 1) ||
            attemptMove(row - 1, column) ||
            attemptMove(row, column + 1) ||
            attemptMove(row + 1, column)
          ) {
            break;
          }
        }
      }
    }

    if (isValid) break;
  }

  while (!isValid) {
    const randomRow: number = Math.floor(Math.random() * rows);
    const randomColumn: number = Math.floor(Math.random() * columns);
    computerMove = [randomRow, randomColumn];
    isValid = validateMove(gameSettings, gameState, computerMove);
  }

  return computerMove;
}