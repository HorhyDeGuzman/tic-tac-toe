<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import type * as Phaser from 'phaser'
import { storeToRefs } from 'pinia'
import { createGame } from '@/game/createGame'
import {
  GameEvents,
  RegistryKeys,
  type Difficulty,
  type GameOutcome,
  type GameResult,
  type Turn,
} from '@/game/types'
import { useGameStore } from '@/stores/game'
import GameHeader from '@/components/GameHeader.vue'
import ResultModal from '@/components/ResultModal.vue'
import DifficultySelector from '@/components/DifficultySelector.vue'
import TurnIndicator from '@/components/TurnIndicator.vue'

const host = ref<HTMLDivElement | null>(null)
const game = shallowRef<Phaser.Game | null>(null)
const store = useGameStore()
const { difficulty } = storeToRefs(store)

const turn = ref<Turn>('player')
const modalOpen = ref(false)
const outcome = ref<GameOutcome | null>(null)
const baseReward = ref(0)
const rare = ref(false)
const rareBonus = ref(0)
const total = ref(0)

function handleGameOver(result: GameResult) {
  const reward = store.registerOutcome(result.outcome)
  outcome.value = result.outcome
  baseReward.value = reward.base
  rare.value = reward.rare
  rareBonus.value = reward.rareBonus
  total.value = reward.total
  modalOpen.value = true
}

function handleTurn(next: Turn) {
  turn.value = next
}

function restart() {
  modalOpen.value = false
  game.value?.events.emit(GameEvents.Restart)
}

function onDifficultyChange(_d: Difficulty) {
  restart()
}

watch(difficulty, (d) => {
  game.value?.registry.set(RegistryKeys.Difficulty, d)
})

onMounted(() => {
  if (!host.value) return
  game.value = createGame(host.value)
  game.value.registry.set(RegistryKeys.Difficulty, difficulty.value)
  game.value.events.on(GameEvents.GameOver, handleGameOver)
  game.value.events.on(GameEvents.TurnChange, handleTurn)
})

onBeforeUnmount(() => {
  game.value?.events.off(GameEvents.GameOver, handleGameOver)
  game.value?.events.off(GameEvents.TurnChange, handleTurn)
  game.value?.destroy(true)
  game.value = null
})
</script>

<template>
  <div class="app-shell">
    <div class="glow-bg" />
    <GameHeader />

    <main class="stage">
      <DifficultySelector @change="onDifficultyChange" />

      <div class="game-card">
        <div ref="host" class="phaser-host" />
      </div>

      <TurnIndicator :turn="turn" />
    </main>

    <ResultModal
      :open="modalOpen"
      :outcome="outcome"
      :base-reward="baseReward"
      :rare="rare"
      :rare-bonus="rareBonus"
      :total="total"
      @restart="restart"
    />
  </div>
</template>

<style scoped>
.app-shell {
  position: relative;
  min-height: 100vh;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: center;
  color: #e8ecff;
  overflow: hidden;
}
.glow-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(ellipse 60% 50% at 20% 0%, rgba(88, 101, 242, 0.35), transparent 60%),
    radial-gradient(ellipse 50% 40% at 80% 100%, rgba(255, 61, 176, 0.25), transparent 60%),
    radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0, 229, 255, 0.08), transparent 60%),
    #05071a;
}
.stage {
  width: 100%;
  max-width: 760px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.game-card {
  width: 100%;
  max-width: 560px;
  padding: 14px;
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(28, 33, 72, 0.7), rgba(10, 13, 36, 0.7));
  border: 1px solid rgba(88, 101, 242, 0.35);
  box-shadow:
    0 0 0 1px rgba(88, 101, 242, 0.15),
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 0 80px rgba(88, 101, 242, 0.2);
  backdrop-filter: blur(6px);
}
.phaser-host {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 14px;
  overflow: hidden;
  background: #07091a;
}
:deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
@media (max-width: 520px) {
  .app-shell {
    padding: 12px 10px 30px;
    gap: 12px;
  }
  .game-card {
    padding: 10px;
    border-radius: 16px;
  }
}
</style>
