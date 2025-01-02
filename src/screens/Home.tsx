import { useState } from 'react';
import { ScrollView } from 'react-native';
import { Text, Button, Icon } from '@rneui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GameSettingsModal } from '../components/modals';
import styles from '../css/styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function Home({ navigation }: Props): JSX.Element {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isClassicMode, setIsClassicMode] = useState<boolean>(true);

  const handleRedirectToSingleplayer = (): void => {
    setIsModalVisible(false);

    navigation.navigate('Singleplayer', {
      gameMode: isClassicMode ? 'CLASSIC' : 'MOBILE'
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.containerScrollView}>
      <Text h4 centered noPaddingTop>
        Welcome to Battleship - Online!
      </Text>

      <Button onPress={() => setIsModalVisible(true)}>
        <Icon name='user' type='feather' /> Singleplayer
      </Button>

      <Button onPress={() => navigation.navigate('Lobby')}>
        <Icon name='users' type='feather' /> Multiplayer
      </Button>

      <Button onPress={() => navigation.navigate('How to Play')}>
        <Icon name='question-circle-o' type='font-awesome' /> How to play
      </Button>

      <GameSettingsModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        modalTitle='Game Settings'
        handleOkButton={handleRedirectToSingleplayer}
        isClassicMode={isClassicMode}
        setIsClassicMode={setIsClassicMode}
      />
    </ScrollView>
  );
}