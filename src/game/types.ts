export type Player = 'X' | 'O'
export type Cell = Player | null
export type Board = Cell[]

export type GameOutcome = 'win' | 'loss' | 'draw'

export type WinLine = readonly [number, number, number]

export interface GameResult {
  outcome: GameOutcome
  line: WinLine | null
  reward: number
  rareDrop: boolean
}

export type Difficulty = 'easy' | 'medium' | 'hard'
export type Turn = 'player' | 'ai' | 'idle'

export const GameEvents = {
  GameOver: 'game:over',
  Restart: 'game:restart',
  TurnChange: 'game:turn',
} as const

export const RegistryKeys = {
  Difficulty: 'difficulty',
} as const
