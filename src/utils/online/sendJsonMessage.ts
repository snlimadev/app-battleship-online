/**
 * Sends a message in JSON format to the WebSocket server.
 * 
 * @param {WebSocket | null} ws - The WebSocket connection object.
 * @param {OutgoingMessageParams} message - The message object to be sent.
 * 
 * @returns {void} This function does not return any value.
 */
export function sendJsonMessage(
  ws: WebSocket | null,
  message: OutgoingMessageParams
): void {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}