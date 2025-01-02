/**
 * Validates a move in the game based on the provided game settings and game state.
 * 
 * @param {GameSettings} gameSettings - The `CLASSIC` or `MOBILE` game settings.
 * @param {GameState} gameState - The game state that the move is validated against.
 * @param {[number, number]} move - The move to be validated.
 * 
 * @returns {boolean} `true` if the move is valid; `false` otherwise.
 */
export function validateMove(
  gameSettings: GameSettings,
  gameState: GameState,
  move: [number, number]
): boolean {
  const { rows, columns } = gameSettings;
  const { hits, misses } = gameState;

  const isInvalidRow: boolean = move[0] < 0 || move[0] >= rows;
  const isInvalidColumn: boolean = move[1] < 0 || move[1] >= columns;

  const isMiss: boolean = misses.some(miss =>
    miss[0] === move[0] && miss[1] === move[1]
  );

  const isHit: boolean = hits.some(currHit =>
    currHit.some(hit => hit[0] === move[0] && hit[1] === move[1])
  );

  return !(isInvalidRow || isInvalidColumn || isHit || isMiss);
}