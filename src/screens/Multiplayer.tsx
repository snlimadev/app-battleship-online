import React, { useState, useEffect, useRef } from 'react';
import { BackHandler, AppState, AppStateStatus, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WS_URL } from '../config/appConfig';
import { GAME_SETTINGS } from '../config/gameConfig';
import { Game } from '../components/game';
import { LoadingModal } from '../components/modals';
import { WaitingCard } from '../components/online';
import { initializeGameState, initializeRoundState, validateMove } from '../utils/game';
import { sendJsonMessage } from '../utils/online';
import { getComputerMove, setupRandomBattleGrid, updateGameState } from '../services/game';
import { processMultiplayerMessageEvent, sendPlayerShips, setupMultiplayerWsEvents } from '../services/online';

const BANNER_ID: string = 'ca-app-pub-4878437225305198/8680951743';

type Props = NativeStackScreenProps<RootStackParamList, 'Multiplayer'>;

export function Multiplayer({ navigation, route }: Props): JSX.Element {
  const player: SocketUser = (route.params['action'] === 'CREATE_ROOM') ? 'PLAYER_1' : 'PLAYER_2';
  const defaultGameSettings: GameSettings = GAME_SETTINGS[route.params['roomOptions']['gameMode'] || 'CLASSIC'];
  const [gameSettings, setGameSettings] = useState<GameSettings>(defaultGameSettings);
  const [playerState, setPlayerState] = useState<GameState>(initializeGameState(gameSettings));
  const [opponentState, setOpponentState] = useState<GameState>(initializeGameState(gameSettings));
  const [newRoundState, setNewRoundState] = useState<RoundState>(initializeRoundState(player === 'PLAYER_1'));
  const [roundState, setRoundState] = useState<RoundState>(initializeRoundState(player === 'PLAYER_1'));
  const [hasGameStarted, setHasGameStarted] = useState<boolean>(false);
  const [isDisabledGrid, setIsDisabledGrid] = useState<boolean>(true);
  const [isDisabledButtons, setIsDisabledButtons] = useState<boolean>(true);
  const [isClientConnected, setIsClientConnected] = useState<boolean>(false);
  const [message, setMessage] = useState<IncomingMessageParams>({});
  const [roomCode, setRoomCode] = useState<string>('');
  const [currMoveInfo, setCurrMoveInfo] = useState<MoveInfo | undefined>(undefined);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(-1);
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const ws: React.MutableRefObject<WebSocket | null> = useRef<WebSocket | null>(null);

  //#region Handlers
  const handleConnect = (): void => {
    if (!ws.current) {
      setIsClientConnected(false);
      ws.current = new WebSocket(WS_URL);
      setupMultiplayerWsEvents(ws.current, handleCreateOrJoinRoom, setMessage, navigation);
    }
  };

  const handleDisconnect = (): void => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  };

  const handleCreateOrJoinRoom = (): void => {
    sendJsonMessage(ws.current, {
      action: route.params['action'],
      roomOptions: (route.params['action'] === 'CREATE_ROOM')
        ? { ...route.params['roomOptions'], roomCode: parseInt(roomCode) || -1 }
        : route.params['roomOptions']
    });
  };

  const handleBackPress = (): boolean => {
    navigation.navigate('Home');
    return true;
  };

  const handlePlayerMove = (row: number, column: number): void => {
    setIsDisabledGrid(true);

    if (!roundState.isRoundOver && newRoundState.isPlayerTurn && counter > 1) {
      const playerMove: [number, number] = [row, column];
      const isValid: boolean = validateMove(gameSettings, playerState, playerMove);

      if (isValid) {
        setCounter(-1);
        sendJsonMessage(ws.current, { action: 'MAKE_MOVE', move: playerMove });
      } else {
        setIsDisabledGrid(false);
      }
    }
  };

  const handleComputerMove = (): void => {
    setCounter(-1);

    sendJsonMessage(ws.current, {
      action: 'MAKE_MOVE',
      move: getComputerMove(gameSettings, playerState)
    });
  };

  const handleStartRound = (): void => {
    setIsDisabledButtons(true);

    if (roundState.isRoundOver && !isWaiting) {
      setCounter(-1);
      setIsWaiting(true);
      sendPlayerShips(ws.current, playerState);
    }
  };

  const handleResetPlayerGrid = (): void => {
    setIsDisabledButtons(true);

    if (roundState.isRoundOver && !isWaiting) {
      setupRandomBattleGrid(gameSettings, setPlayerState, true);
      setIsDisabledButtons(false);
    }
  };

  const handleResetGameState = (): void => {
    setOpponentState(initializeGameState(gameSettings, opponentState.score));
    setPlayerState(initializeGameState(gameSettings, playerState.score));
    handleResetPlayerGrid();
  };
  //#endregion

  //#region useEffect hooks
  useEffect(() => {
    return () => {
      handleDisconnect();
    };
  }, []);

  useEffect(() => {
    if (appState === 'active') {
      handleConnect();
    } else if (Platform.OS === 'android' && Platform.Version >= 35) {
      handleDisconnect();
      setPlayerState(initializeGameState(gameSettings));
      setOpponentState(initializeGameState(gameSettings));
      setupRandomBattleGrid(gameSettings, setPlayerState, true);
      setNewRoundState(initializeRoundState(player === 'PLAYER_1'));
      setRoundState(initializeRoundState(player === 'PLAYER_1'));
      setHasGameStarted(false);
      setIsDisabledGrid(true);
      setIsDisabledButtons(false);
      setMessage({});
      setCurrMoveInfo(undefined);
      setIsWaiting(false);
      setCounter(-1);
    }
  }, [appState]);

  useEffect(() => {
    processMultiplayerMessageEvent(
      message,
      player,
      playerState,
      opponentState,
      setIsClientConnected,
      setRoomCode,
      setGameSettings,
      setHasGameStarted,
      setCounter,
      setIsWaiting,
      setRoundState,
      setOpponentState,
      setCurrMoveInfo,
      navigation
    );
  }, [message]);

  useEffect(() => {
    if (currMoveInfo) {
      const { move: currMove, player: currPlayer } = currMoveInfo;

      updateGameState(
        gameSettings,
        currMove,
        (currPlayer === player) ? playerState : opponentState,
        (currPlayer === player) ? setPlayerState : setOpponentState,
        (currPlayer === player) ? opponentState : playerState,
        (currPlayer === player) ? setOpponentState : setPlayerState,
        setNewRoundState
      );
    }
  }, [currMoveInfo]);

  useEffect(() => {
    handleResetGameState();
  }, [gameSettings]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [navigation]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    let countdown: NodeJS.Timeout | undefined;

    if (counter > 0) {
      if (counter === 1) {
        setIsDisabledGrid(true);
        setIsDisabledButtons(true);
      }

      countdown = setTimeout(() => setCounter((counter) => counter - 1), 1000);
    } else if (counter === 0) {
      const { isRoundOver, isPlayerTurn } = roundState;

      if (isRoundOver) {
        handleStartRound();
      } else if (isPlayerTurn) {
        handleComputerMove();
      }
    }

    return () => {
      if (countdown) clearTimeout(countdown);
    };
  }, [counter]);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;

    if (hasGameStarted) {
      timeout = setTimeout(() => setRoundState(newRoundState), 500);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [newRoundState]);

  useEffect(() => {
    if (hasGameStarted) {
      const { isRoundOver, isPlayerTurn } = roundState;

      if (isRoundOver) {
        handleResetGameState();
        setCounter(60);
      } else if (isPlayerTurn) {
        setIsDisabledGrid(false);
        setCounter(30);
      }
    }
  }, [roundState]);
  //#endregion

  return (
    <>
      {(!hasGameStarted) ? (
        <>
          <WaitingCard roomCode={roomCode} />

          {(route.params['action'] === 'CREATE_ROOM' && isClientConnected) && (
            <BannerAd
              unitId={(__DEV__) ? TestIds.BANNER : BANNER_ID}
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true
              }}
            />
          )}
        </>
      ) : (
        <Game
          playerState={playerState}
          opponentState={opponentState}
          roundState={roundState}
          opponentText='OPP'
          isDisabledGrid={isDisabledGrid}
          isDisabledButtons={isDisabledButtons}
          handlePlayerMove={handlePlayerMove}
          handleStartRound={handleStartRound}
          handleResetPlayerGrid={handleResetPlayerGrid}
          isWaiting={isWaiting}
          counter={counter}
        />
      )}

      <LoadingModal isVisible={!isClientConnected} text='LOADING...' />
    </>
  );
}