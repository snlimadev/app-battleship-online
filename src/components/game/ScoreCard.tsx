import { View } from 'react-native';
import { Card, Text } from '@rneui/themed';
import styles from '../../css/styles';

interface ScoreCardProps {
  playerScore: number;
  opponentText: 'COM' | 'OPP';
  opponentScore: number;
}

export function ScoreCard(
  {
    playerScore,
    opponentText,
    opponentScore
  }: ScoreCardProps
): JSX.Element {
  return (
    <Card>
      <Card.Title>SCORE</Card.Title>

      <Card.Divider />

      <View style={styles.flexColumnContainer}>
        <View style={styles.flexRowContainer}>
          <Text bold large success noPaddingTop>YOU</Text>
          <Text bold xxlarge noPaddingTop> {playerScore} </Text>

          <Text bold large noPaddingTop>x</Text>

          <Text bold xxlarge noPaddingTop> {opponentScore} </Text>
          <Text bold large danger noPaddingTop>{opponentText}</Text>
        </View>
      </View>
    </Card>
  );
}