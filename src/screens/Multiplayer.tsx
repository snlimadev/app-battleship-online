import React, { useState, useEffect, useMemo } from 'react';
import { BackHandler } from 'react-native';
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
  const [roundState, setRoundState] = useState<RoundState>(newRoundState);
  const [hasGameStarted, setHasGameStarted] = useState<boolean>(false);
  const [isDisabledGrid, setIsDisabledGrid] = useState<boolean>(true);
  const [isDisabledButtons, setIsDisabledButtons] = useState<boolean>(true);
  const [isClientConnected, setIsClientConnected] = useState<boolean>(false);
  const [message, setMessage] = useState<IncomingMessageParams>({});
  const [roomCode, setRoomCode] = useState<string>('');
  const [currMoveInfo, setCurrMoveInfo] = useState<MoveInfo | undefined>();
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(-1);
  const ws: WebSocket = useMemo(() => new WebSocket(WS_URL), []);

  //#region Handlers
  const handleCreateOrJoinRoom = (): void => {
    sendJsonMessage(ws, {
      action: route.params['action'],
      roomOptions: route.params['roomOptions']
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
        sendJsonMessage(ws, { action: 'MAKE_MOVE', move: playerMove });
      } else {
        setIsDisabledGrid(false);
      }
    }
  };

  const handleComputerMove = (): void => {
    setCounter(-1);

    sendJsonMessage(ws, {
      action: 'MAKE_MOVE',
      move: getComputerMove(gameSettings, playerState)
    });
  };

  const handleStartRound = (): void => {
    setIsDisabledButtons(true);

    if (roundState.isRoundOver && !isWaiting) {
      setCounter(-1);
      setIsWaiting(true);
      sendPlayerShips(ws, playerState);
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
    setupMultiplayerWsEvents(ws, handleCreateOrJoinRoom, setMessage, navigation);

    return () => {
      if (ws) ws.close();
    };
  }, []);

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