declare global {
  type RootStackParamList = {
    Home: undefined;
    Singleplayer: { gameMode: GameMode };
    Lobby: undefined;
    Multiplayer: { action: 'CREATE_ROOM' | 'JOIN_ROOM', roomOptions: RoomOptions };
    "How to Play": undefined;
  };
}

export { };