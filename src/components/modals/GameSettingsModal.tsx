import { useState } from 'react';
import { View, ScrollView, Modal } from 'react-native';
import { Card, Input, Button, CheckBox, Text } from '@rneui/themed';
import styles from '../../css/styles';

interface GameSettingsModalProps {
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  modalTitle: GameSettingsModalTitle;
  handleOkButton: () => void;
  isClassicMode?: boolean;
  setIsClassicMode?: React.Dispatch<React.SetStateAction<boolean>>;
  isPublicRoom?: boolean;
  setIsPublicRoom?: React.Dispatch<React.SetStateAction<boolean>>;
  roomCode?: string;
  setRoomCode?: React.Dispatch<React.SetStateAction<string>>;
}

export function GameSettingsModal(
  {
    isModalVisible,
    setIsModalVisible,
    modalTitle,
    handleOkButton,
    isClassicMode,
    setIsClassicMode,
    isPublicRoom,
    setIsPublicRoom,
    roomCode,
    setRoomCode
  }: GameSettingsModalProps
): JSX.Element {
  const [isFocusedInput, setIsFocusedInput] = useState<boolean>(false);
  const [isDisabledOkButton, setIsDisabledOkButton] = useState<boolean>(true);

  const handleCloseModal = (): void => {
    setIsFocusedInput(false);
    setIsModalVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={handleCloseModal}
    >
      <ScrollView
        contentContainerStyle={styles.modalOverlay}
        keyboardShouldPersistTaps='handled'
      >
        <Card>
          <Card.Title modal>{modalTitle}</Card.Title>

          <Card.Divider />

          {(modalTitle !== 'Join Room') ? (
            <View>
              <Text bold noPaddingTop>
                Check for Classic Mode (10x10), uncheck for Mobile Mode (6x6)
              </Text>

              <CheckBox
                checked={isClassicMode !== undefined && isClassicMode}
                onPress={() => {
                  if (setIsClassicMode) setIsClassicMode((isClassic) => !isClassic);
                }}
                title='Classic Mode'
              />

              {(modalTitle === 'Create Room') && (
                <View>
                  <Text bold>
                    Check to make the room visible in the lobby, uncheck to hide it
                  </Text>

                  <CheckBox
                    checked={isPublicRoom !== undefined && isPublicRoom}
                    onPress={() => {
                      if (setIsPublicRoom) setIsPublicRoom((isPublic) => !isPublic);
                    }}
                    title='Public Room'
                  />
                </View>
              )}
            </View>
          ) : (
            <Input
              placeholder='Enter the room code'
              value={roomCode}
              onChangeText={(text: string) => {
                if (setRoomCode) setRoomCode(text);
                setIsDisabledOkButton(!text);
              }}
              renderErrorMessage={false}
              keyboardType='number-pad'
              maxLength={8}
              onFocus={() => setIsFocusedInput(true)}
              onBlur={() => setIsFocusedInput(false)}
              focused={isFocusedInput}
            />
          )}

          <Card.Divider footer={modalTitle === 'Join Room'} />

          <View style={styles.flexRowContainer}>
            <Button
              title='Cancel'
              color='secondary'
              onPress={handleCloseModal}
              halfWidth
              noPaddingTop
            />

            <Button
              title='OK'
              disabled={(modalTitle === 'Join Room') ? isDisabledOkButton : false}
              onPress={handleOkButton}
              halfWidth
              noPaddingTop
            />
          </View>
        </Card>
      </ScrollView>
    </Modal>
  );
}