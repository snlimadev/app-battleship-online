declare global {
  interface IncomingMessageParams {
    event?: 'GAME_START' | 'GAME_OVER' | 'ROUND_START' | 'ROUND_OVER',
    roomOptions?: RoomOptions,
    lobbyInfo?: LobbyInfo,
    moveInfo?: MoveInfo,
    winner?: SocketUser,
    error?: string
  }

  interface OutgoingMessageParams {
    action?: 'CREATE_ROOM' | 'JOIN_ROOM' | 'DELETE_ROOM' | 'ENTER_LOBBY'
      | 'EXIT_LOBBY' | 'START_ROUND' | 'MAKE_MOVE',
    roomOptions?: RoomOptions,
    ships?: Ship[],
    move?: [number, number]
  }

  interface RoomOptions {
    isPublic?: 'Y' | 'N',
    roomCode?: number,
    gameMode?: GameMode
  }

  interface LobbyInfo {
    rooms: number[],
    playersOnlineCount: number,
    activeRoomsCount: number
  }

  interface Ship {
    startPosition?: [number, number],
    isVertical?: boolean
  }

  interface MoveInfo {
    move: [number, number],
    player: SocketUser,
    isHit: boolean,
    hitInfo?: {
      shipIndex: number,
      isSunk: boolean
    }
  }

  type SocketUser = 'PLAYER_1' | 'PLAYER_2';
}

export { };