import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { showMessage } from 'react-native-flash-message';
import { parseJsonMessage } from '../../utils/online';

/**
 * Sets up WebSocket event listeners for the `Multiplayer` screen.
 * 
 * @param {WebSocket} ws - The WebSocket connection object.
 * @param {() => void} handleCreateOrJoinRoom
 * - The function called once the WebSocket connection is successfully opened.
 * @param {React.Dispatch<React.SetStateAction<IncomingMessageParams>>} setMessage
 * - The function to update the message state with the latest JSON message received.
 * @param {NativeStackNavigationProp<RootStackParamList, 'Multiplayer'>} navigation
 * - The navigation prop to manage screen transitions.
 * 
 * @returns {void} This function does not return any value.
 */
export function setupMultiplayerWsEvents(
  ws: WebSocket,
  handleCreateOrJoinRoom: () => void,
  setMessage: React.Dispatch<React.SetStateAction<IncomingMessageParams>>,
  navigation: NativeStackNavigationProp<RootStackParamList, 'Multiplayer'>
): void {
  if (ws) {
    ws.onopen = () => {
      handleCreateOrJoinRoom();
    };

    ws.onclose = () => { };

    ws.onerror = () => {
      showMessage({
        message: 'Connection to the server lost or expired',
        description: 'Please check your internet connection and try again later.',
        type: 'danger',
        icon: 'danger',
        duration: 5000
      });

      navigation.navigate('Home');
    };

    ws.onmessage = (event: MessageEvent) => {
      const parsedMessage: IncomingMessageParams = parseJsonMessage(event);
      setMessage(parsedMessage);
    };
  }
}