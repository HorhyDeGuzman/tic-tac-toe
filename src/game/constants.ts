export const BOARD_SIZE = 3
export const CELL_COUNT = BOARD_SIZE * BOARD_SIZE

export const GAME_WIDTH = 540
export const GAME_HEIGHT = 540
export const BOARD_PADDING = 40
export const CELL_SIZE = (GAME_WIDTH - BOARD_PADDING * 2) / BOARD_SIZE

export const COLORS = {
  background: 0x07091a,
  grid: 0x2a3470,
  gridGlow: 0x5865f2,
  playerX: 0x00e5ff,
  playerXGlow: 0x66f6ff,
  playerO: 0xff3db0,
  playerOGlow: 0xff8fd1,
  winLine: 0xffe066,
  winGlow: 0xfff2a8,
  cellHover: 0x1a1f40,
  particle: 0xffffff,
} as const

export const REWARDS = {
  win: 100,
  draw: 40,
  loss: 15,
  rarePack: 50,
  rareChance: 0.3,
} as const

export const WINNING_LINES: ReadonlyArray<readonly [number, number, number]> = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]
