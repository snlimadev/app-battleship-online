import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text, Button, Icon } from '@rneui/themed';
import { BattleGrid } from './BattleGrid';
import { ScoreCard } from './ScoreCard';
import styles from '../../css/styles';

interface GameProps {
  playerState: GameState,
  opponentState: GameState,
  roundState: RoundState,
  opponentText: React.ComponentProps<typeof ScoreCard>['opponentText'];
  isDisabledGrid: React.ComponentProps<typeof BattleGrid>['isDisabled'];
  isDisabledButtons: boolean;
  handlePlayerMove: React.ComponentProps<typeof BattleGrid>['handleMove'];
  handleStartRound: () => void;
  handleResetPlayerGrid: () => void;
  isWaiting?: boolean;
  counter?: number;
}

export function Game(
  {
    playerState,
    opponentState,
    roundState,
    opponentText,
    isDisabledGrid,
    isDisabledButtons,
    handlePlayerMove,
    handleStartRound,
    handleResetPlayerGrid,
    isWaiting,
    counter
  }: GameProps
): JSX.Element {
  const { gridColors: playerGridColors, score: playerScore } = playerState;
  const { gridColors: opponentGridColors, score: opponentScore } = opponentState;
  const { isRoundOver, isPlayerTurn, winner } = roundState;

  return (
    <>
      <View style={[styles.subcontainer, { justifyContent: 'space-between' }]}>
        <ScoreCard
          playerScore={playerScore}
          opponentText={opponentText}
          opponentScore={opponentScore}
        />

        <View style={styles.flexColumnContainer}>
          {(winner && isRoundOver) && (
            <Text bold large success={winner === 'PLAYER'} danger={winner === 'OPPONENT'}>
              {(winner === 'PLAYER') ? 'You win!' : 'You lose!'}
            </Text>
          )}

          <Text
            bold={!isWaiting}
            large
            success={isPlayerTurn && !isRoundOver}
            warning={isRoundOver && !isWaiting}
            danger={!isPlayerTurn && !isRoundOver}
          >
            {(isRoundOver && !isWaiting)
              ? 'Get ready for the next round!'
              : (isWaiting)
                ? 'Waiting for the opponent to be ready...'
                : (isPlayerTurn)
                  ? 'Your turn'
                  : (opponentText === 'COM')
                    ? "Computer's turn"
                    : "Opponent's turn"}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.subcontainer}>
        <ScrollView contentContainerStyle={styles.battleGridScrollView} horizontal>
          <BattleGrid
            gridColors={
              (!isPlayerTurn || isRoundOver)
                ? playerGridColors
                : opponentGridColors
            }
            isDisabled={(isPlayerTurn) ? isDisabledGrid : true}
            handleMove={(isPlayerTurn) ? handlePlayerMove : undefined}
          />
        </ScrollView>
      </ScrollView>

      <View style={{ paddingVertical: 5 }}>
        {(counter !== undefined) ? (
          <Text bold centered xxlarge noPaddingTop danger={counter <= 10}>
            {(counter > 0) ? counter : ' '}
          </Text>
        ) : (
          <></>
        )}
      </View>

      {(isRoundOver && !isWaiting) && (
        <View style={{ paddingBottom: 5 }}>
          <Button onPress={handleStartRound} disabled={isDisabledButtons} noPaddingTop>
            <Icon
              name='play-circle-outline'
              type='ionicons'
              disabled={isDisabledButtons}
            /> Start round
          </Button>

          <Button onPress={handleResetPlayerGrid} disabled={isDisabledButtons}>
            <Icon
              name='refresh'
              type='ionicons'
              disabled={isDisabledButtons}
            /> Reposition fleets
          </Button>
        </View>
      )}
    </>
  );
}