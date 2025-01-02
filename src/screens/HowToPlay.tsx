import { ScrollView, View } from 'react-native';
import { Text, Icon } from '@rneui/themed';
import { GAME_COLORS, GAME_ICON_MAP } from '../config/gameConfig';
import styles from '../css/styles';

export function HowToPlay(): JSX.Element {
  type ShipProps = { texts: [string, string], color: string };

  const Ship = ({ texts, color }: ShipProps): JSX.Element => (
    <View style={[styles.flexRowContainer, { paddingTop: 5 }]}>
      <Text selectable noPaddingTop style={{ paddingHorizontal: 10 }}>
        {texts[0]}
      </Text>

      <View style={[styles.battleGridField, { backgroundColor: color }]}>
        <Icon
          type={GAME_ICON_MAP[color].type}
          name={GAME_ICON_MAP[color].name}
          color={GAME_ICON_MAP[color].color}
          size={GAME_ICON_MAP[color].size}
        />
      </View>

      <Text selectable noPaddingTop style={{ paddingHorizontal: 10 }}>
        {texts[1]}
      </Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.containerScrollView}>
      <Text selectable noPaddingTop>
        This is a battleship-inspired game
        where the goal is to sink all of the opponent's fleets.
      </Text>

      <Text selectable>There are two different game modes.</Text>

      <Text selectable>In Classic Mode (10x10 grid), each player has:</Text>

      <Ship texts={['• 1x fleet with 2x', '']} color={GAME_COLORS.ally[0]} />
      <Ship texts={['• 2x fleet with 3x', '']} color={GAME_COLORS.ally[1]} />
      <Ship texts={['• 1x fleet with 4x', '']} color={GAME_COLORS.ally[2]} />
      <Ship texts={['• 1x fleet with 5x', '']} color={GAME_COLORS.ally[3]} />

      <Text selectable>In Mobile Mode (6x6 grid), each player has:</Text>

      <Ship texts={['• 2x fleet with 2x', '']} color={GAME_COLORS.ally[0]} />
      <Ship texts={['• 1x fleet with 3x', '']} color={GAME_COLORS.ally[1]} />

      <Text selectable>
        Before the round starts, players can tap the "Reposition Fleets" button
        as many times as they want to randomize the positions of their fleets.
        Once satisfied, players should tap the "Start Round" button to begin.
      </Text>

      <Text selectable>
        During their turn, players select a coordinate
        on their opponent's grid to try to hit a fleet.
      </Text>

      <Text selectable>
        If one of the following icons appears,
        it means the respective fleet was hit but not sunk yet:
      </Text>

      <Ship texts={['•', '']} color={GAME_COLORS.hit[0]} />
      <Ship texts={['•', '']} color={GAME_COLORS.hit[1]} />
      <Ship texts={['•', '(Classic Mode only)']} color={GAME_COLORS.hit[2]} />
      <Ship texts={['•', '(Classic Mode only)']} color={GAME_COLORS.hit[3]} />

      <Text selectable>
        When an entire fleet is sunk, all ships in that fleet
        will be represented by the corresponding icon in the list below:
      </Text>

      <Ship texts={['•', '']} color={GAME_COLORS.sunk[0]} />
      <Ship texts={['•', '']} color={GAME_COLORS.sunk[1]} />
      <Ship texts={['•', '(Classic Mode only)']} color={GAME_COLORS.sunk[2]} />
      <Ship texts={['•', '(Classic Mode only)']} color={GAME_COLORS.sunk[3]} />

      <Text selectable>
        The player who completely sinks
        all of the opponent's fleets first wins the round.
      </Text>
    </ScrollView>
  );
}