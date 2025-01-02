/**
 * Initializes the round state based on the provided `isPlayerTurn` parameter.
 * 
 * @param {boolean} isPlayerTurn - A flag indicating whether is the player's turn.
 * 
 * @returns {RoundState} The initialized round state.
 */
export function initializeRoundState(isPlayerTurn: boolean): RoundState {
  const newRoundState: RoundState = {
    isRoundOver: true,
    isPlayerTurn: isPlayerTurn,
    winner: undefined
  };

  return newRoundState;
}