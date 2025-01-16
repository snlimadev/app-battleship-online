import React, { useState, useCallback } from 'react';
import { ScrollView, Linking, Pressable } from 'react-native';
import { Text, Button, Icon } from '@rneui/themed';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GameSettingsModal } from '../components/modals';
import styles from '../css/styles';

const BANNER_ID: string = 'ca-app-pub-4878437225305198/4519173432';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function Home({ navigation }: Props): JSX.Element {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isClassicMode, setIsClassicMode] = useState<boolean>(true);
  const [shouldShowBanner, setShouldShowBanner] = useState<boolean>(false);

  const handleRedirectToSingleplayer = (): void => {
    setIsModalVisible(false);

    navigation.navigate('Singleplayer', {
      gameMode: isClassicMode ? 'CLASSIC' : 'MOBILE'
    });
  };

  const handleOpenURL = (appId: string): void => {
    Linking.openURL(`https://play.google.com/store/apps/details?id=${appId}`);
  };

  useFocusEffect(
    useCallback(() => {
      setShouldShowBanner(true);
      setIsClassicMode(true);

      return () => {
        setShouldShowBanner(false);
      };
    }, [])
  );

  return (
    <>
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

        <Text centered>
          <Text noPaddingTop>If you like it, please </Text>

          <Pressable onPress={() => handleOpenURL('com.snlimadev.battleship')}>
            <Text primary bold underline noPaddingTop>rate the app</Text>
          </Pressable>

          <Text noPaddingTop> to help us keep improving it for you.</Text>
        </Text>
      </ScrollView>

      {(shouldShowBanner) && (
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
        modalTitle='Game Settings'
        handleOkButton={handleRedirectToSingleplayer}
        isClassicMode={isClassicMode}
        setIsClassicMode={setIsClassicMode}
      />
    </>
  );
}