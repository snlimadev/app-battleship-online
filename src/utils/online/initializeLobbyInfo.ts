/**
 * Initializes the object that stores the lobby information.
 * 
 * @returns {LobbyInfo} The initialized lobby information object.
 */
export function initializeLobbyInfo(): LobbyInfo {
  const newLobbyInfo: LobbyInfo = {
    rooms: [],
    playersOnlineCount: 0,
    activeRoomsCount: 0
  };

  return newLobbyInfo;
}