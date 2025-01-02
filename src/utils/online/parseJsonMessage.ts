/**
 * Parses the JSON message received from the WebSocket server.
 * 
 * @param {MessageEvent} event - The message event containing the data to be parsed.
 * 
 * @returns {IncomingMessageParams} The parsed JSON message received.
 */
export function parseJsonMessage(event: MessageEvent): IncomingMessageParams {
  let parsedMessage: IncomingMessageParams = {};

  try {
    parsedMessage = JSON.parse(event.data);
  } catch (error) {
    console.error(`Failed to parse message data: ${error}`);
  }

  return parsedMessage;
}