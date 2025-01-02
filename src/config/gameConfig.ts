export const GAME_SETTINGS: GameSettingsMap = {
  CLASSIC: {
    shipSizes: [2, 3, 3, 4, 5],
    gameColorMap: [0, 1, 1, 2, 3],
    rows: 10,
    columns: 10
  },
  MOBILE: {
    shipSizes: [2, 2, 3],
    gameColorMap: [0, 0, 1],
    rows: 6,
    columns: 6
  }
};

export const GAME_COLORS: GameColors = {
  empty: 'rgb(0,150,255)',
  miss: 'rgb(173,216,230)',
  ally: ['rgb(144,238,144)', 'rgb(144,237,144)', 'rgb(144,236,144)', 'rgb(144,235,144)'],
  hit: ['rgb(227,66,52)', 'rgb(226,66,52)', 'rgb(225,66,52)', 'rgb(224,66,52)'],
  sunk: ['rgb(250,128,114)', 'rgb(249,128,114)', 'rgb(248,128,114)', 'rgb(247,128,114)'],
  icon: 'rgb(0,0,0)',
  iconSunk: 'rgb(169,169,169)'
};

export const GAME_ICON_MAP: GameIconMap = {
  [GAME_COLORS.empty]: { type: 'material-community', name: 'waves', color: GAME_COLORS.icon, size: 31.5 },
  [GAME_COLORS.miss]: { type: 'material-community', name: 'waves', color: GAME_COLORS.iconSunk, size: 31.5 },
  [GAME_COLORS.ally[0]]: { type: 'material-community', name: 'submarine', color: GAME_COLORS.icon, size: 31.5 },
  [GAME_COLORS.ally[1]]: { type: 'material-community', name: 'sail-boat', color: GAME_COLORS.icon, size: 31.5 },
  [GAME_COLORS.ally[2]]: { type: 'font-awesome-5', name: 'ship', color: GAME_COLORS.icon, size: 22.5 },
  [GAME_COLORS.ally[3]]: { type: 'font-awesome', name: 'ship', color: GAME_COLORS.icon, size: 27 },
  [GAME_COLORS.hit[0]]: { type: 'material-community', name: 'submarine', color: GAME_COLORS.icon, size: 31.5 },
  [GAME_COLORS.hit[1]]: { type: 'material-community', name: 'sail-boat', color: GAME_COLORS.icon, size: 31.5 },
  [GAME_COLORS.hit[2]]: { type: 'font-awesome-5', name: 'ship', color: GAME_COLORS.icon, size: 22.5 },
  [GAME_COLORS.hit[3]]: { type: 'font-awesome', name: 'ship', color: GAME_COLORS.icon, size: 27 },
  [GAME_COLORS.sunk[0]]: { type: 'material-community', name: 'submarine', color: GAME_COLORS.iconSunk, size: 31.5 },
  [GAME_COLORS.sunk[1]]: { type: 'material-community', name: 'sail-boat', color: GAME_COLORS.iconSunk, size: 31.5 },
  [GAME_COLORS.sunk[2]]: { type: 'font-awesome-5', name: 'ship', color: GAME_COLORS.iconSunk, size: 22.5 },
  [GAME_COLORS.sunk[3]]: { type: 'font-awesome', name: 'ship', color: GAME_COLORS.iconSunk, size: 27 }
};