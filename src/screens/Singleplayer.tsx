import { useState, useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GAME_SETTINGS } from '../config/gameConfig';
import { Game } from '../components/game';
import { initializeGameState, initializeRoundState, validateMove } from '../utils/game';
import { getComputerMove, setupRandomBattleGrid, updateGameState } from '../services/game';

type Props = NativeStackScreenProps<RootStackParamList, 'Singleplayer'>;

export function Singleplayer({ route }: Props): JSX.Element {
  const gameSettings: GameSettings = GAME_SETTINGS[route.params['gameMode']];
  const [playerState, setPlayerState] = useState<GameState>(initializeGameState(gameSettings));
  const [computerState, setComputerState] = useState<GameState>(initializeGameState(gameSettings));
  const [newRoundState, setNewRoundState] = useState<RoundState>(initializeRoundState(true));
  const [roundState, setRoundState] = useState<RoundState>(newRoundState);
  const [hasGameStarted, setHasGameStarted] = useState<boolean>(false);
  const [isDisabledGrid, setIsDisabledGrid] = useState<boolean>(true);
  const [isDisabledButtons, setIsDisabledButtons] = useState<boolean>(true);

  //#region Handlers
  const handlePlayerMove = (row: number, column: number): void => {
    setIsDisabledGrid(true);

    if (!roundState.isRoundOver && newRoundState.isPlayerTurn) {
      const playerMove: [number, number] = [row, column];
      const isValid: boolean = validateMove(gameSettings, playerState, playerMove);

      if (isValid) {
        updateGameState(
          gameSettings,
          playerMove,
          playerState,
          setPlayerState,
          computerState,
          setComputerState,
          setNewRoundState
        );
      } else {
        setIsDisabledGrid(false);
      }
    }
  };

  const handleComputerMove = (): void => {
    updateGameState(
      gameSettings,
      getComputerMove(gameSettings, computerState),
      computerState,
      setComputerState,
      playerState,
      setPlayerState,
      setNewRoundState
    );
  };

  const handleStartRound = (): void => {
    setIsDisabledButtons(true);

    if (roundState.isRoundOver) {
      if (!hasGameStarted) setHasGameStarted(true);
      setRoundState((prevState) => ({ ...prevState, isRoundOver: false }));
    }
  };

  const handleResetPlayerGrid = (): void => {
    setIsDisabledButtons(true);

    if (roundState.isRoundOver) {
      setupRandomBattleGrid(gameSettings, setPlayerState, true);
      setIsDisabledButtons(false);
    }
  };

  const handleResetGameState = (): void => {
    setComputerState(initializeGameState(gameSettings, computerState.score));
    setPlayerState(initializeGameState(gameSettings, playerState.score));
    setupRandomBattleGrid(gameSettings, setComputerState);
    handleResetPlayerGrid();
  };
  //#endregion

  //#region useEffect hooks
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
    let timeout: NodeJS.Timeout | undefined;

    if (!hasGameStarted) {
      setupRandomBattleGrid(gameSettings, setComputerState);
      handleResetPlayerGrid();
    } else {
      const { isRoundOver, isPlayerTurn } = roundState;

      if (isRoundOver) {
        handleResetGameState();
      } else {
        if (isPlayerTurn) {
          setIsDisabledGrid(false);
        } else {
          timeout = setTimeout(() => handleComputerMove(), 100);
        }
      }
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [roundState]);
  //#endregion

  return (
    <Game
      playerState={playerState}
      opponentState={computerState}
      roundState={roundState}
      opponentText='COM'
      isDisabledGrid={isDisabledGrid}
      isDisabledButtons={isDisabledButtons}
      handlePlayerMove={handlePlayerMove}
      handleStartRound={handleStartRound}
      handleResetPlayerGrid={handleResetPlayerGrid}
    />
  );
}