import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon, useTheme } from '@rneui/themed';
import { DEFAULT_COLORS } from '../config/appConfig';

import {
  Home,
  Singleplayer,
  Lobby,
  Multiplayer,
  HowToPlay
} from '../screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppRoutes(): JSX.Element {
  const { theme, updateTheme } = useTheme();

  const handleToggleDarkMode = () => {
    updateTheme((theme) => ({
      mode: (theme.mode === 'light') ? 'dark' : 'light',
      icon: (theme.icon === 'moon') ? 'sunny' : 'moon'
    }));
  };

  return (
    <NavigationContainer theme={theme}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: DEFAULT_COLORS['primary'] },
            headerTitleAlign: 'center',
            headerTitleStyle: { color: theme.colors.topBarText },
            headerTintColor: theme.colors.topBarText,
            headerRight: () => (
              <Icon
                topBar
                name={theme.icon}
                type='ionicon'
                onPress={handleToggleDarkMode}
              />
            )
          }}
        >
          <Stack.Screen name='Home' component={Home} />

          <Stack.Screen name='Singleplayer' component={Singleplayer} />

          <Stack.Screen name='Lobby' component={Lobby} />

          <Stack.Screen
            name='Multiplayer'
            component={Multiplayer}
            options={(props) => ({
              headerLeft: () => (
                <Icon
                  topBar
                  name='home'
                  type='ionicon'
                  onPress={() => props.navigation.navigate('Home')}
                />
              )
            })}
          />

          <Stack.Screen name='How to Play' component={HowToPlay} />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}