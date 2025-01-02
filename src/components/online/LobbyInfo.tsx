import React from 'react';
import { View, FlatList } from 'react-native';
import { Button, Text, Icon, useTheme } from '@rneui/themed';
import styles from '../../css/styles';

interface LobbyInfoProps {
  lobbyInfo: LobbyInfo;
  handleJoinRoom: (room: number) => void;
}

export function LobbyInfo(
  {
    lobbyInfo,
    handleJoinRoom
  }: LobbyInfoProps
): JSX.Element {
  const { theme } = useTheme();
  const { rooms, playersOnlineCount, activeRoomsCount } = lobbyInfo;

  const renderItem = ({ item }: { item: number }): JSX.Element => (
    <View key={item} style={{ paddingBottom: 10 }}>
      <Button type='outline' size='sm' onPress={() => handleJoinRoom(item)} noPaddingTop>
        <Icon name='arrow-right-circle' type='feather' small primary /> {item.toString()}
      </Button>
    </View>
  );

  return (
    <>
      <Text centered style={{ paddingBottom: 10 }}>
        <Text bold>{playersOnlineCount}</Text> players online,
        <Text bold> {activeRoomsCount}</Text> active rooms
      </Text>

      <FlatList
        ListHeaderComponent={<Text bold centered>Public Rooms</Text>}
        ListHeaderComponentStyle={[styles.listHeader, { borderBottomColor: theme.colors.grey5 }]}
        data={rooms}
        renderItem={renderItem}
        keyExtractor={(item) => item.toString()}
        style={[styles.listContainer, { borderColor: theme.colors.grey5 }]}
        ListEmptyComponent={
          <View style={{ paddingBottom: 14 }}>
            <Text centered noPaddingTop>No public rooms available.</Text>
          </View>
        }
      />
    </>
  );
}