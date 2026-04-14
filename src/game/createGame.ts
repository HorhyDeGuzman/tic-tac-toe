import * as Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH, COLORS } from './constants'
import { TicTacToeScene } from './TicTacToeScene'

export function createGame(parent: HTMLElement): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: `#${COLORS.background.toString(16).padStart(6, '0')}`,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [TicTacToeScene],
  }
  return new Phaser.Game(config)
}
