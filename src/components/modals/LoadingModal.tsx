import { Modal } from 'react-native';
import { Card, Button, Text } from '@rneui/themed';
import styles from '../../css/styles';

interface LoadingModalProps {
  isVisible: boolean;
  text?: string;
}

export function LoadingModal(
  {
    isVisible,
    text
  }: LoadingModalProps
): JSX.Element {
  return (
    <Modal visible={isVisible} onRequestClose={() => null}>
      <Card containerStyle={styles.loadingCard}>
        <Text bold centered noPaddingTop>{text}</Text>
        <Button type='clear' loading disabled noPaddingTop />
      </Card>
    </Modal>
  );
}