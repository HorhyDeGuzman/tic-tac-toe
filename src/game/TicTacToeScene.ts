import * as Phaser from 'phaser'
import {
  BOARD_PADDING,
  BOARD_SIZE,
  CELL_COUNT,
  CELL_SIZE,
  COLORS,
  GAME_HEIGHT,
  GAME_WIDTH,
  WINNING_LINES,
} from './constants'
import {
  GameEvents,
  RegistryKeys,
  type Board,
  type Cell,
  type Difficulty,
  type GameResult,
  type Player,
  type WinLine,
} from './types'

const PARTICLE_KEY = 'ttt-particle'
const MARK_X_KEY = 'ttt-mark-x'
const MARK_O_KEY = 'ttt-mark-o'
const MARK_TEX_SIZE = 220

export class TicTacToeScene extends Phaser.Scene {
  private board: Board = Array<Cell>(CELL_COUNT).fill(null)
  private cellContainers: Phaser.GameObjects.Container[] = []
  private cellMarks: (Phaser.GameObjects.Container | null)[] = []
  private winGraphics: Phaser.GameObjects.GameObject[] = []
  private emitters: Phaser.GameObjects.Particles.ParticleEmitter[] = []
  private isLocked = true

  constructor() {
    super('TicTacToeScene')
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLORS.background)

    this.ensureTextures()
    this.drawBackdrop()
    this.drawGrid()
    this.buildCells()

    this.game.events.on(GameEvents.Restart, this.resetBoard, this)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off(GameEvents.Restart, this.resetBoard, this)
    })

    this.resetBoard()
  }

  private emitTurn(turn: 'player' | 'ai' | 'idle') {
    this.game.events.emit(GameEvents.TurnChange, turn)
  }

  private ensureTextures(): void {
    if (!this.textures.exists(PARTICLE_KEY)) {
      const g = this.make.graphics({ x: 0, y: 0 }, false)
      g.fillStyle(0xffffff, 1)
      g.fillCircle(6, 6, 6)
      g.generateTexture(PARTICLE_KEY, 12, 12)
      g.destroy()
    }
    if (!this.textures.exists(MARK_X_KEY)) {
      this.createMarkTexture(MARK_X_KEY, 'X', COLORS.playerX)
    }
    if (!this.textures.exists(MARK_O_KEY)) {
      this.createMarkTexture(MARK_O_KEY, 'O', COLORS.playerO)
    }
  }

  private createMarkTexture(key: string, player: Player, colorHex: number): void {
    const size = MARK_TEX_SIZE
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    const color = '#' + colorHex.toString(16).padStart(6, '0')

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = color
    ctx.lineWidth = Math.round(size * 0.1)

    const pad = Math.round(size * 0.18)
    if (player === 'X') {
      ctx.beginPath()
      ctx.moveTo(pad, pad)
      ctx.lineTo(size - pad, size - pad)
      ctx.moveTo(size - pad, pad)
      ctx.lineTo(pad, size - pad)
      ctx.stroke()
    } else {
      const r = size / 2 - pad
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2)
      ctx.stroke()
    }

    this.textures.addCanvas(key, canvas)
  }

  private drawBackdrop(): void {
    const vignette = this.add.graphics()
    vignette.fillStyle(0x5865f2, 0.06)
    vignette.fillCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH * 0.55)
  }

  private drawGrid(): void {
    const left = BOARD_PADDING
    const top = BOARD_PADDING
    const right = GAME_WIDTH - BOARD_PADDING
    const bottom = GAME_HEIGHT - BOARD_PADDING

    const frame = this.add.graphics()
    const frameLayers: Array<[number, number, number]> = [
      [16, COLORS.gridGlow, 0.08],
      [10, COLORS.gridGlow, 0.16],
      [6, COLORS.gridGlow, 0.32],
      [2, 0xaab4ff, 0.9],
    ]
    for (const [w, color, alpha] of frameLayers) {
      frame.lineStyle(w, color, alpha)
      frame.strokeRoundedRect(left - 12, top - 12, right - left + 24, bottom - top + 24, 20)
    }

    const lines = this.add.graphics()
    const lineLayers: Array<[number, number, number]> = [
      [12, COLORS.gridGlow, 0.1],
      [6, COLORS.gridGlow, 0.25],
      [3, 0xb8c0ff, 0.95],
    ]
    for (let i = 1; i < BOARD_SIZE; i++) {
      const x = left + CELL_SIZE * i
      const y = top + CELL_SIZE * i
      for (const [w, color, alpha] of lineLayers) {
        lines.lineStyle(w, color, alpha)
        lines.lineBetween(x, top + 14, x, bottom - 14)
        lines.lineBetween(left + 14, y, right - 14, y)
      }
    }
  }

  private buildCells(): void {
    this.cellContainers = []
    this.cellMarks = Array(CELL_COUNT).fill(null)

    const hoverSize = CELL_SIZE - 18
    const hoverRadius = 14

    for (let i = 0; i < CELL_COUNT; i++) {
      const col = i % BOARD_SIZE
      const row = Math.floor(i / BOARD_SIZE)
      const cx = BOARD_PADDING + col * CELL_SIZE + CELL_SIZE / 2
      const cy = BOARD_PADDING + row * CELL_SIZE + CELL_SIZE / 2

      const container = this.add.container(cx, cy)

      // Rounded hover background
      const hoverBg = this.add.graphics()
      hoverBg.fillStyle(0xffffff, 0.06)
      hoverBg.fillRoundedRect(-hoverSize / 2, -hoverSize / 2, hoverSize, hoverSize, hoverRadius)
      hoverBg.lineStyle(2, 0x00e5ff, 0.6)
      hoverBg.strokeRoundedRect(
        -hoverSize / 2,
        -hoverSize / 2,
        hoverSize,
        hoverSize,
        hoverRadius,
      )
      hoverBg.setAlpha(0)

      const hit = this.add
        .rectangle(0, 0, CELL_SIZE - 4, CELL_SIZE - 4, 0xffffff, 0)
        .setInteractive({ useHandCursor: true })

      const showHover = () => {
        if (this.isLocked || this.board[i]) return
        this.tweens.killTweensOf(hoverBg)
        this.tweens.add({
          targets: hoverBg,
          alpha: 1,
          duration: 160,
          ease: 'Sine.Out',
        })
      }
      const hideHover = () => {
        this.tweens.killTweensOf(hoverBg)
        this.tweens.add({
          targets: hoverBg,
          alpha: 0,
          duration: 140,
          ease: 'Sine.In',
        })
      }

      hit.on('pointerover', showHover)
      hit.on('pointerout', hideHover)
      hit.on('pointerdown', () => {
        hideHover()
        this.handlePlayerClick(i)
      })

      container.add([hoverBg, hit])
      this.cellContainers.push(container)
    }
  }

  private handlePlayerClick(index: number): void {
    if (this.isLocked || this.board[index]) return

    this.placeMark(index, 'X')

    const result = this.evaluateBoard()
    if (result) {
      this.finishGame(result)
      return
    }

    this.isLocked = true
    this.emitTurn('ai')

    this.time.delayedCall(450, () => this.aiMove())
  }

  private aiMove(): void {
    const choice = this.chooseAIMove(this.board)
    if (choice < 0) return
    this.placeMark(choice, 'O')

    const result = this.evaluateBoard()
    if (result) {
      this.finishGame(result)
      return
    }

    this.isLocked = false
    this.emitTurn('player')
  }

  private getDifficulty(): Difficulty {
    const d = this.registry.get(RegistryKeys.Difficulty) as Difficulty | undefined
    return d ?? 'medium'
  }

  private chooseAIMove(board: Board): number {
    const empty: number[] = []
    for (let i = 0; i < CELL_COUNT; i++) if (!board[i]) empty.push(i)
    if (empty.length === 0) return -1

    const difficulty = this.getDifficulty()

    const pickRandom = (arr: readonly number[]): number =>
      arr[Math.floor(Math.random() * arr.length)] as number

    if (difficulty === 'easy') {
      return pickRandom(empty)
    }

    if (difficulty === 'medium') {
      // Rule-based: win if possible, block if needed, else random with preference for center/corners
      const winMove = this.findWinningMove(board, 'O')
      if (winMove >= 0) return winMove
      const blockMove = this.findWinningMove(board, 'X')
      if (blockMove >= 0) return blockMove
      if (!board[4]) return 4
      const corners = [0, 2, 6, 8].filter((i) => !board[i])
      if (corners.length > 0 && Math.random() < 0.6) {
        return pickRandom(corners)
      }
      return pickRandom(empty)
    }

    // hard — perfect minimax
    if (empty.length === CELL_COUNT) {
      return pickRandom([0, 2, 4, 6, 8])
    }

    let bestScore = -Infinity
    const bestMoves: number[] = []
    for (const i of empty) {
      board[i] = 'O'
      const score = this.minimax(board, 0, false, -Infinity, Infinity)
      board[i] = null
      if (score > bestScore) {
        bestScore = score
        bestMoves.length = 0
        bestMoves.push(i)
      } else if (score === bestScore) {
        bestMoves.push(i)
      }
    }
    return pickRandom(bestMoves)
  }

  private findWinningMove(board: Board, player: Player): number {
    for (const line of WINNING_LINES) {
      const [a, b, c] = line
      const cells = [board[a], board[b], board[c]]
      const playerCount = cells.filter((v) => v === player).length
      const emptyCount = cells.filter((v) => v === null).length
      if (playerCount === 2 && emptyCount === 1) {
        if (!board[a]) return a
        if (!board[b]) return b
        if (!board[c]) return c
      }
    }
    return -1
  }

  private minimax(
    board: Board,
    depth: number,
    isMaximizing: boolean,
    alpha: number,
    beta: number,
  ): number {
    const winner = this.checkWinner(board)
    if (winner === 'O') return 10 - depth
    if (winner === 'X') return depth - 10
    if (board.every((c) => c !== null)) return 0

    if (isMaximizing) {
      let best = -Infinity
      for (let i = 0; i < CELL_COUNT; i++) {
        if (board[i]) continue
        board[i] = 'O'
        const score = this.minimax(board, depth + 1, false, alpha, beta)
        board[i] = null
        best = Math.max(best, score)
        alpha = Math.max(alpha, score)
        if (beta <= alpha) break
      }
      return best
    } else {
      let best = Infinity
      for (let i = 0; i < CELL_COUNT; i++) {
        if (board[i]) continue
        board[i] = 'X'
        const score = this.minimax(board, depth + 1, true, alpha, beta)
        board[i] = null
        best = Math.min(best, score)
        beta = Math.min(beta, score)
        if (beta <= alpha) break
      }
      return best
    }
  }

  private checkWinner(board: Board): Player | null {
    for (const line of WINNING_LINES) {
      const [a, b, c] = line
      const va = board[a]
      if (va && va === board[b] && va === board[c]) {
        return va
      }
    }
    return null
  }

  private placeMark(index: number, player: Player): void {
    this.board[index] = player
    const parent = this.cellContainers[index]
    if (!parent) return
    const mark = this.createMark(player)
    parent.add(mark)
    this.cellMarks[index] = mark

    mark.setScale(0)
    mark.setAlpha(0)
    mark.setAngle(player === 'X' ? -25 : 0)
    this.tweens.add({
      targets: mark,
      scale: 1,
      alpha: 1,
      angle: 0,
      duration: 340,
      ease: 'Back.Out',
    })

    const { x, y } = this.cellCenter(index)
    const color = player === 'X' ? COLORS.playerX : COLORS.playerO
    this.spawnPuff(x, y, color)
  }

  private createMark(player: Player): Phaser.GameObjects.Container {
    const c = this.add.container(0, 0)
    const key = player === 'X' ? MARK_X_KEY : MARK_O_KEY
    const img = this.add.image(0, 0, key)
    const display = CELL_SIZE * 0.68
    img.setDisplaySize(display, display)
    c.add(img)
    return c
  }

  private spawnPuff(x: number, y: number, color: number): void {
    const emitter = this.add.particles(x, y, PARTICLE_KEY, {
      speed: { min: 40, max: 140 },
      lifespan: 420,
      scale: { start: 0.9, end: 0 },
      alpha: { start: 0.9, end: 0 },
      tint: color,
      quantity: 14,
      blendMode: Phaser.BlendModes.ADD,
      emitting: false,
    })
    emitter.explode(14)
    this.time.delayedCall(600, () => emitter.destroy())
  }

  private evaluateBoard(): GameResult | null {
    for (const line of WINNING_LINES) {
      const [a, b, c] = line
      const va = this.board[a]
      if (va && va === this.board[b] && va === this.board[c]) {
        return {
          outcome: va === 'X' ? 'win' : 'loss',
          line,
          reward: 0,
          rareDrop: false,
        }
      }
    }

    if (this.board.every((cell) => cell !== null)) {
      return { outcome: 'draw', line: null, reward: 0, rareDrop: false }
    }

    return null
  }

  private finishGame(result: GameResult): void {
    this.isLocked = true
    this.emitTurn('idle')

    if (result.line) {
      this.drawWinLine(result.line, result.outcome === 'win')
      if (result.outcome === 'win') this.celebrateWin(result.line)
      else this.shakeCamera()
    }

    this.time.delayedCall(900, () => {
      this.game.events.emit(GameEvents.GameOver, result)
    })
  }

  private drawWinLine(line: WinLine, playerWon: boolean): void {
    const [a, , c] = line
    const pa = this.cellCenter(a)
    const pc = this.cellCenter(c)

    const color = playerWon ? COLORS.winLine : COLORS.playerO
    const thickness = 10
    const capR = thickness / 2

    const g = this.add.graphics()
    this.winGraphics.push(g)

    const progress = { t: 0 }
    this.tweens.add({
      targets: progress,
      t: 1,
      duration: 500,
      ease: 'Sine.Out',
      onUpdate: () => {
        const x = Phaser.Math.Linear(pa.x, pc.x, progress.t)
        const y = Phaser.Math.Linear(pa.y, pc.y, progress.t)
        g.clear()
        g.lineStyle(thickness, color, 1)
        g.lineBetween(pa.x, pa.y, x, y)
        g.fillStyle(color, 1)
        g.fillCircle(pa.x, pa.y, capR)
        g.fillCircle(x, y, capR)
      },
    })
  }

  private celebrateWin(line: WinLine): void {
    const colors = [COLORS.winLine, COLORS.playerX, COLORS.playerXGlow, COLORS.winGlow]

    for (let i = 0; i < line.length; i++) {
      const cellIndex = line[i] as number
      const { x, y } = this.cellCenter(cellIndex)
      this.time.delayedCall(i * 120, () => {
        const emitter = this.add.particles(x, y, PARTICLE_KEY, {
          speed: { min: 80, max: 260 },
          lifespan: { min: 700, max: 1200 },
          scale: { start: 1.4, end: 0 },
          alpha: { start: 1, end: 0 },
          tint: colors,
          quantity: 28,
          angle: { min: 0, max: 360 },
          gravityY: 180,
          blendMode: Phaser.BlendModes.ADD,
          emitting: false,
        })
        emitter.explode(28)
        this.emitters.push(emitter)
        this.time.delayedCall(1500, () => emitter.destroy())
      })
    }

    const shower = this.add.particles(0, 0, PARTICLE_KEY, {
      x: { min: BOARD_PADDING, max: GAME_WIDTH - BOARD_PADDING },
      y: BOARD_PADDING - 10,
      speedY: { min: 80, max: 220 },
      speedX: { min: -40, max: 40 },
      lifespan: { min: 1200, max: 1800 },
      scale: { start: 0.8, end: 0 },
      alpha: { start: 1, end: 0 },
      tint: colors,
      frequency: 40,
      blendMode: Phaser.BlendModes.ADD,
    })
    this.emitters.push(shower)
    this.time.delayedCall(1200, () => shower.stop())
    this.time.delayedCall(2600, () => shower.destroy())

    this.cameras.main.flash(250, 255, 240, 180, false)
  }

  private shakeCamera(): void {
    this.cameras.main.shake(220, 0.006)
  }

  private cellCenter(index: number): { x: number; y: number } {
    const col = index % BOARD_SIZE
    const row = Math.floor(index / BOARD_SIZE)
    return {
      x: BOARD_PADDING + col * CELL_SIZE + CELL_SIZE / 2,
      y: BOARD_PADDING + row * CELL_SIZE + CELL_SIZE / 2,
    }
  }

  private resetBoard(): void {
    this.board = Array<Cell>(CELL_COUNT).fill(null)
    for (const mark of this.cellMarks) mark?.destroy()
    this.cellMarks = Array(CELL_COUNT).fill(null)
    for (const gfx of this.winGraphics) gfx.destroy()
    this.winGraphics = []
    for (const e of this.emitters) e.destroy()
    this.emitters = []
    this.isLocked = false
    this.emitTurn('player')
  }
}
