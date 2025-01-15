import React, { useState, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WS_URL } from '../config/appConfig';
import { GameSettingsModal, LoadingModal } from '../components/modals';
import { LobbyInfo } from '../components/online';
import { initializeLobbyInfo } from '../utils/online';
import { setupLobbyWsEvents } from '../services/online';
import styles from '../css/styles';

const BANNER_ID: string = 'ca-app-pub-4878437225305198/5042218932';

type Props = NativeStackScreenProps<RootStackParamList, 'Lobby'>;
type MultiplayerAction = RootStackParamList['Multiplayer']['action'];

export function Lobby({ navigation }: Props): JSX.Element {
  const [isClientConnected, setIsClientConnected] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<GameSettingsModalTitle>('Create Room');
  const [isPublicRoom, setIsPublicRoom] = useState<boolean>(true);
  const [roomCodeInput, setRoomCodeInput] = useState<string>('');
  const [isClassicMode, setIsClassicMode] = useState<boolean>(true);
  const [lobbyInfo, setLobbyInfo] = useState<LobbyInfo>(initializeLobbyInfo());
  const ws: WebSocket = useMemo(() => new WebSocket(WS_URL), []);

  //#region Handlers
  const handleOpenModal = (title: GameSettingsModalTitle): void => {
    setModalTitle(title);
    setIsModalVisible(true);
  };

  const handleRedirectToMultiplayer = (
    action: MultiplayerAction,
    roomOptions: RoomOptions
  ): void => {
    setIsModalVisible(false);
    if (ws) ws.close();

    navigation.navigate('Multiplayer', {
      action: action,
      roomOptions: roomOptions
    });
  };

  const handleCreateRoom = (): void => {
    handleRedirectToMultiplayer('CREATE_ROOM', {
      isPublic: (isPublicRoom) ? 'Y' : 'N',
      gameMode: (isClassicMode) ? 'CLASSIC' : 'MOBILE'
    });
  };

  const handleJoinRoom = (selectedRoom: number): void => {
    handleRedirectToMultiplayer('JOIN_ROOM', {
      roomCode: selectedRoom || parseInt(roomCodeInput)
    });
  };
  //#endregion

  //#region useEffect hooks
  useEffect(() => {
    setupLobbyWsEvents(ws, setIsClientConnected, setLobbyInfo, navigation);

    return () => {
      if (ws) ws.close();
    };
  }, []);
  //#endregion

  return (
    <>
      <View style={styles.containerView}>
        <View style={styles.flexEndContainer}>
          <Button onPress={() => handleOpenModal('Create Room')} noPaddingTop>
            <Icon name='plus-circle' type='feather' /> CREATE A ROOM
          </Button>

          <Button onPress={() => handleOpenModal('Join Room')}>
            <Icon name='arrow-right-circle' type='feather' /> JOIN A ROOM
          </Button>
        </View>

        <LobbyInfo
          lobbyInfo={lobbyInfo}
          handleJoinRoom={handleJoinRoom}
        />
      </View>

      {(isClientConnected) && (
        <BannerAd
          unitId={(__DEV__) ? TestIds.BANNER : BANNER_ID}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true
          }}
        />
      )}

      <GameSettingsModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        modalTitle={modalTitle}
        handleOkButton={() => {
          (modalTitle === 'Create Room')
            ? handleCreateRoom()
            : handleJoinRoom(parseInt(roomCodeInput))
        }}
        isClassicMode={isClassicMode}
        setIsClassicMode={setIsClassicMode}
        isPublicRoom={isPublicRoom}
        setIsPublicRoom={setIsPublicRoom}
        roomCode={roomCodeInput}
        setRoomCode={setRoomCodeInput}
      />

      <LoadingModal isVisible={!isClientConnected} text='CONNECTING...' />
    </>
  );
}