import { sendJsonMessage } from '../../utils/online';

/**
 * Sends the player's ships data to the WebSocket server to start the round.
 * 
 * @param {WebSocket} ws - The WebSocket connection object.
 * @param {GameState} playerState - The player's game state.
 * 
 * @returns {void} This function does not return any value.
 */
export function sendPlayerShips(
  ws: WebSocket,
  playerState: GameState
): void {
  const { ships } = playerState;
  let playerShips: Ship[] = [];

  for (let i: number = 0; i < ships.length; i++) {
    const ship: number[][] = ships[i];
    const startCoord: [number, number] = [ship[0][0], ship[0][1]];
    let isVertical: boolean = false;

    if (
      ship.some(([r, c]) =>
        (r === startCoord[0] - 1 || r === startCoord[0] + 1) && c === startCoord[1]
      )
    ) {
      isVertical = true;
    }

    playerShips.push({ startPosition: startCoord, isVertical: isVertical });
  }

  sendJsonMessage(ws, { action: 'START_ROUND', ships: playerShips });
}