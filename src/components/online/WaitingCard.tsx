import { ScrollView, Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Button, Card, Text, Icon } from '@rneui/themed';
import { showMessage } from 'react-native-flash-message';
import styles from '../../css/styles';

interface WaitingCardProps {
  roomCode: string;
}

export function WaitingCard({ roomCode }: WaitingCardProps): JSX.Element {
  const text: string = `The room code for Battleship - Online is ${roomCode}`;

  //#region Handlers
  const handleCopy = async (): Promise<void> => {
    try {
      await Clipboard.setStringAsync(text);
      showMessage({ message: 'Copied', type: 'info', icon: 'info' });
    } catch (error) {
      alert((error instanceof Error) ? error.message : 'An unknown error occurred');
    }
  };

  const handleShare = async (): Promise<void> => {
    try {
      await Share.share({ message: text });
    } catch (error) {
      alert((error instanceof Error) ? error.message : 'An unknown error occurred');
    }
  };
  //#endregion

  return (
    <ScrollView contentContainerStyle={styles.containerScrollView}>
      <Card>
        <Card.Title>Waiting for an opponent...</Card.Title>

        <Card.Divider />

        <Text selectable centered noPaddingTop>
          The room code is <Text bold>{roomCode}</Text>. Please note your session
          will expire in 3 minutes if an opponent doesn't join the game.
        </Text>

        <Button type='outline' size='sm' info onPress={handleCopy}>
          <Icon name='copy' type='font-awesome' small info /> Copy room code
        </Button>

        <Button type='outline' size='sm' info onPress={handleShare}>
          <Icon name='share-alt' type='font-awesome' small info /> Share room code
        </Button>
      </Card>
    </ScrollView>
  );
}