import { GAME_COLORS } from '../../config/gameConfig';

/**
 * Randomly places ships on the grid based on the provided game settings.
 * 
 * @param {GameSettings} gameSettings - The `CLASSIC` or `MOBILE` game settings.
 * @param {React.Dispatch<React.SetStateAction<GameState>>} setGameState
 * - The function to update the game state.
 * @param {boolean} [shouldShowPositions=false]
 * - Optional flag to indicate whether to display the positions of the ships.
 * 
 * @returns {void} This function does not return any value.
 */
export function setupRandomBattleGrid(
  gameSettings: GameSettings,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  shouldShowPositions?: boolean
): void {
  const { shipSizes, gameColorMap, rows, columns } = gameSettings;
  const usedCoordinates: Set<string> = new Set();

  const newShips: number[][][] = Array.from(
    { length: shipSizes.length },
    () => []
  );

  const newGridColors: string[][] = Array.from(
    { length: rows },
    () => Array(columns).fill(GAME_COLORS.empty)
  );

  const getRandomCoordinates = (index: number, length: number): void => {
    let startRow: number = -1;
    let startCol: number = -1;
    let isVertical: boolean = Math.random() < 0.5;
    let isValid: boolean = false;

    while (!isValid) {
      startRow = Math.floor(Math.random() * rows);
      startCol = Math.floor(Math.random() * columns);

      if (
        (isVertical && startRow + length <= rows) ||
        (!isVertical && startCol + length <= columns)
      ) {
        isValid = true;

        for (let i: number = 0; i < length; i++) {
          const coord: [number, number] = (isVertical)
            ? [startRow + i, startCol]
            : [startRow, startCol + i];

          if (usedCoordinates.has(`${coord[0]},${coord[1]}`)) {
            isValid = false;
            break;
          }
        }
      }
    }

    for (let i: number = 0; i < length; i++) {
      const coord: [number, number] = (isVertical)
        ? [startRow + i, startCol]
        : [startRow, startCol + i];

      usedCoordinates.add(`${coord[0]},${coord[1]}`);
      newShips[index][i] = [coord[0], coord[1]];

      if (shouldShowPositions) {
        newGridColors[coord[0]][coord[1]] = GAME_COLORS.ally[gameColorMap[index]];
      }
    }
  };

  for (let i: number = 0; i < shipSizes.length; i++) {
    getRandomCoordinates(i, shipSizes[i]);
  }

  setGameState((prevState) => ({
    ...prevState,
    ships: newShips,
    gridColors: newGridColors
  }));
}