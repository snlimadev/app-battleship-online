import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { showMessage } from 'react-native-flash-message';
import { GAME_SETTINGS } from '../../config/gameConfig';

/**
 * Processes the WebSocket message event in the `Multiplayer` screen.
 * 
 * @param {IncomingMessageParams} message - The parsed JSON message received.
 * @param {SocketUser} player - Indicates if the player is `PLAYER_1` or `PLAYER_2`.
 * @param {GameState} playerState - The player's game state.
 * @param {GameState} opponentState - The opponent's game state.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setIsClientConnected
 * - The function to update the connection status of the client.
 * @param {React.Dispatch<React.SetStateAction<string>>} setRoomCode
 * - The function to update the room code.
 * @param {React.Dispatch<React.SetStateAction<GameSettings>>} setGameSettings
 * - The function to update the game settings.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setHasGameStarted
 * - The function to update whether the game has started.
 * @param {React.Dispatch<React.SetStateAction<number>>} setCounter
 * - The function to update the countdown timer.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setIsWaiting
 * - The function to update the player's waiting state between rounds.
 * @param {React.Dispatch<React.SetStateAction<RoundState>>} setRoundState
 * - The function to update the round state.
 * @param {React.Dispatch<React.SetStateAction<GameState>>} setOpponentState
 * - The function to update the opponent’s game state.
 * @param {React.Dispatch<React.SetStateAction<MoveInfo | undefined>>} setCurrMoveInfo
 * - The function to update the current move information.
 * @param {NativeStackNavigationProp<RootStackParamList, 'Multiplayer'>} navigation
 * - The navigation prop to manage screen transitions.
 * 
 * @returns {void} This function does not return any value.
 */
export function processMultiplayerMessageEvent(
  message: IncomingMessageParams,
  player: SocketUser,
  playerState: GameState,
  opponentState: GameState,
  setIsClientConnected: React.Dispatch<React.SetStateAction<boolean>>,
  setRoomCode: React.Dispatch<React.SetStateAction<string>>,
  setGameSettings: React.Dispatch<React.SetStateAction<GameSettings>>,
  setHasGameStarted: React.Dispatch<React.SetStateAction<boolean>>,
  setCounter: React.Dispatch<React.SetStateAction<number>>,
  setIsWaiting: React.Dispatch<React.SetStateAction<boolean>>,
  setRoundState: React.Dispatch<React.SetStateAction<RoundState>>,
  setOpponentState: React.Dispatch<React.SetStateAction<GameState>>,
  setCurrMoveInfo: React.Dispatch<React.SetStateAction<MoveInfo | undefined>>,
  navigation: NativeStackNavigationProp<RootStackParamList, 'Multiplayer'>
): void {
  const { roomOptions, event, moveInfo, error } = message;

  if (roomOptions) {
    setIsClientConnected(true);
    setRoomCode(roomOptions.roomCode?.toString() || '');
    setGameSettings(GAME_SETTINGS[roomOptions.gameMode || 'CLASSIC']);
  } else if (event) {
    switch (event) {
      case 'GAME_START':
        setHasGameStarted(true);
        setCounter(60);
        showMessage({ message: 'Game starts!', type: 'info', icon: 'info' });
        break;

      case 'ROUND_START':
        setIsWaiting(false);
        setRoundState((prevState) => ({ ...prevState, isRoundOver: false }));
        showMessage({ message: 'Round starts!', type: 'info', icon: 'info' });
        break;

      case 'GAME_OVER':
        showMessage({
          message: 'Opponent left.\nFinal score:',
          description: `YOU ${playerState.score} x ${opponentState.score} OPP`,
          type: 'info',
          icon: 'info',
          duration: 5000
        });

        navigation.navigate('Home');
        break;

      default:
        break;
    }
  } else if (moveInfo) {
    const { move: currMove, player: currPlayer, hitInfo: currHitInfo } = moveInfo;
    const shipIndex: number | undefined = currHitInfo?.shipIndex;

    if (currPlayer === player && shipIndex !== undefined) {
      const newOpponentState: GameState = { ...opponentState };
      const ships: number[][][] = newOpponentState.ships;

      for (let i: number = 0; i < ships[shipIndex].length; i++) {
        if (ships[shipIndex][i].length === 0) {
          ships[shipIndex][i] = currMove;
          break;
        }
      }

      setOpponentState(newOpponentState);
    }

    setCurrMoveInfo(moveInfo);
  } else if (error) {
    showMessage({
      message: 'Error',
      description: error,
      type: 'danger',
      icon: 'danger',
      duration: 5000
    });

    navigation.navigate('Home');
  }
}