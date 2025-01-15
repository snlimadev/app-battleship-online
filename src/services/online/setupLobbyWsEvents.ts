import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { showMessage } from 'react-native-flash-message';
import { sendJsonMessage, parseJsonMessage } from '../../utils/online';

/**
 * Sets up WebSocket event listeners for the `Lobby` screen.
 * 
 * @param {WebSocket} ws - The WebSocket connection object.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setIsClientConnected
 * - The function to update the connection status of the client.
 * @param {React.Dispatch<React.SetStateAction<LobbyInfo>>} setLobbyInfo
 * - The function to update the lobby information.
 * @param {NativeStackNavigationProp<RootStackParamList, 'Lobby'>} navigation
 * - The navigation prop to manage screen transitions.
 * 
 * @returns {void} This function does not return any value.
 */
export function setupLobbyWsEvents(
  ws: WebSocket,
  setIsClientConnected: React.Dispatch<React.SetStateAction<boolean>>,
  setLobbyInfo: React.Dispatch<React.SetStateAction<LobbyInfo>>,
  navigation: NativeStackNavigationProp<RootStackParamList, 'Lobby'>
): void {
  if (ws) {
    ws.onopen = () => {
      sendJsonMessage(ws, { action: 'ENTER_LOBBY' });
      showMessage({ message: 'Connected', type: 'success', icon: 'success' });
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

      if (parsedMessage.lobbyInfo) {
        setIsClientConnected(true);
        setLobbyInfo(parsedMessage.lobbyInfo);
      }
    };
  }
}