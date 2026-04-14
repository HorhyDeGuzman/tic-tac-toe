import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { REWARDS } from '@/game/constants'
import type { Difficulty, GameOutcome } from '@/game/types'

const STORAGE_KEY = 'tictactoe:state:v1'

interface PersistedState {
  crystals: number
  wins: number
  draws: number
  losses: number
  currentStreak: number
  bestStreak: number
  difficulty: Difficulty
}

const EMPTY: PersistedState = {
  crystals: 0,
  wins: 0,
  draws: 0,
  losses: 0,
  currentStreak: 0,
  bestStreak: 0,
  difficulty: 'medium',
}

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...EMPTY }
    const parsed = JSON.parse(raw) as Partial<PersistedState>
    return {
      crystals: parsed.crystals ?? 0,
      wins: parsed.wins ?? 0,
      draws: parsed.draws ?? 0,
      losses: parsed.losses ?? 0,
      currentStreak: parsed.currentStreak ?? 0,
      bestStreak: parsed.bestStreak ?? 0,
      difficulty: parsed.difficulty ?? 'medium',
    }
  } catch {
    return { ...EMPTY }
  }
}

export interface RewardInfo {
  base: number
  rare: boolean
  rareBonus: number
  total: number
}

export const useGameStore = defineStore('game', () => {
  const initial = loadState()

  const crystals = ref(initial.crystals)
  const wins = ref(initial.wins)
  const draws = ref(initial.draws)
  const losses = ref(initial.losses)
  const currentStreak = ref(initial.currentStreak)
  const bestStreak = ref(initial.bestStreak)
  const difficulty = ref<Difficulty>(initial.difficulty)

  const totalGames = computed(() => wins.value + draws.value + losses.value)
  const winRate = computed(() =>
    totalGames.value === 0 ? 0 : Math.round((wins.value / totalGames.value) * 100),
  )

  watch(
    [crystals, wins, draws, losses, currentStreak, bestStreak, difficulty],
    ([c, w, d, l, cs, bs, diff]) => {
      const payload: PersistedState = {
        crystals: c,
        wins: w,
        draws: d,
        losses: l,
        currentStreak: cs,
        bestStreak: bs,
        difficulty: diff,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    },
    { deep: false },
  )

  function setDifficulty(d: Difficulty) {
    difficulty.value = d
  }

  function addCrystals(amount: number) {
    crystals.value += amount
  }

  function registerOutcome(outcome: GameOutcome): RewardInfo {
    let base = 0
    if (outcome === 'win') {
      base = REWARDS.win
      wins.value += 1
      currentStreak.value += 1
      if (currentStreak.value > bestStreak.value) bestStreak.value = currentStreak.value
    } else if (outcome === 'draw') {
      base = REWARDS.draw
      draws.value += 1
    } else {
      base = REWARDS.loss
      losses.value += 1
      currentStreak.value = 0
    }

    const rare = outcome === 'win' && Math.random() < REWARDS.rareChance
    const rareBonus = rare ? REWARDS.rarePack : 0
    const total = base + rareBonus

    addCrystals(total)

    return { base, rare, rareBonus, total }
  }

  function resetStats() {
    crystals.value = 0
    wins.value = 0
    draws.value = 0
    losses.value = 0
    currentStreak.value = 0
    bestStreak.value = 0
  }

  return {
    crystals,
    wins,
    draws,
    losses,
    currentStreak,
    bestStreak,
    difficulty,
    totalGames,
    winRate,
    setDifficulty,
    addCrystals,
    registerOutcome,
    resetStats,
  }
})
