import { View, Pressable } from 'react-native';
import { Icon } from '@rneui/base';
import { GAME_ICON_MAP } from '../../config/gameConfig';
import styles from '../../css/styles';

interface BattleGridProps {
  gridColors: string[][];
  isDisabled: boolean;
  handleMove?: (row: number, column: number) => void;
}

export function BattleGrid(
  {
    gridColors,
    isDisabled,
    handleMove
  }: BattleGridProps
): JSX.Element {
  return (
    <View>
      {gridColors.map((_, row) => (
        <View key={row} style={styles.flexRowContainer}>
          {gridColors[row].map((color, column) => (
            <Pressable
              key={column}
              style={[styles.battleGridField, { backgroundColor: color }]}
              onPress={() => { if (handleMove) handleMove(row, column); }}
              disabled={isDisabled}
            >
              <Icon
                type={GAME_ICON_MAP[color].type}
                name={GAME_ICON_MAP[color].name}
                color={GAME_ICON_MAP[color].color}
                size={GAME_ICON_MAP[color].size}
              />
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}