<script setup lang="ts">
import { computed } from 'vue'
import type { GameOutcome } from '@/game/types'

interface Props {
  open: boolean
  outcome: GameOutcome | null
  baseReward: number
  rare: boolean
  rareBonus: number
  total: number
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'restart'): void }>()

const title = computed(() => {
  if (props.outcome === 'win') return 'ПОБЕДА'
  if (props.outcome === 'loss') return 'ПОРАЖЕНИЕ'
  if (props.outcome === 'draw') return 'НИЧЬЯ'
  return ''
})

const subtitle = computed(() => {
  if (props.outcome === 'win') return 'Отличная партия!'
  if (props.outcome === 'loss') return 'Ещё попытку?'
  return 'Достойно сыграно'
})

const icon = computed(() => {
  if (props.outcome === 'win') return '🏆'
  if (props.outcome === 'loss') return '💔'
  return '🤝'
})

const accent = computed(() => {
  if (props.outcome === 'win') return 'win'
  if (props.outcome === 'loss') return 'loss'
  return 'draw'
})
</script>

<template>
  <Transition name="fade">
    <div v-if="open" class="overlay" @click.self="emit('restart')">
      <div class="modal" :class="accent">
        <div class="halo" />
        <div class="icon">{{ icon }}</div>
        <h2>{{ title }}</h2>
        <p class="sub">{{ subtitle }}</p>

        <div class="reward-row">
          <span class="label">Награда</span>
          <span class="amount">💎 {{ baseReward }}</span>
        </div>

        <Transition name="pop">
          <div v-if="rare" class="rare">
            <div class="rare-shine" />
            <div class="rare-title">✦ РЕДКИЙ ДРОП! ✦</div>
            <div class="rare-sub">Rare Crystal Pack +{{ rareBonus }} 💎</div>
          </div>
        </Transition>

        <div class="total">
          Итого: <strong>+{{ total }}</strong> 💎
        </div>

        <button class="btn" @click="emit('restart')">
          <span>Играть снова</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(3, 5, 18, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}
.modal {
  position: relative;
  width: min(92vw, 400px);
  padding: 32px 28px 28px;
  border-radius: 22px;
  background: linear-gradient(180deg, #1c2148 0%, #0b0e28 100%);
  border: 1px solid rgba(107, 115, 193, 0.5);
  color: #e8ecff;
  text-align: center;
  overflow: hidden;
  animation: slide-up 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.halo {
  position: absolute;
  inset: -60% 0 auto 0;
  height: 60%;
  background: radial-gradient(
    ellipse at center,
    rgba(88, 101, 242, 0.6) 0%,
    transparent 70%
  );
  pointer-events: none;
}
.modal.win {
  border-color: rgba(0, 229, 255, 0.7);
  box-shadow:
    0 0 0 1px rgba(0, 229, 255, 0.3),
    0 30px 80px rgba(0, 229, 255, 0.2),
    0 0 80px rgba(0, 229, 255, 0.3);
}
.modal.win .halo {
  background: radial-gradient(ellipse at center, rgba(0, 229, 255, 0.55), transparent 70%);
}
.modal.loss {
  border-color: rgba(255, 61, 176, 0.7);
  box-shadow:
    0 0 0 1px rgba(255, 61, 176, 0.3),
    0 30px 80px rgba(255, 61, 176, 0.2);
}
.modal.loss .halo {
  background: radial-gradient(ellipse at center, rgba(255, 61, 176, 0.5), transparent 70%);
}
.modal.draw {
  border-color: rgba(255, 224, 102, 0.6);
  box-shadow:
    0 0 0 1px rgba(255, 224, 102, 0.25),
    0 30px 80px rgba(255, 224, 102, 0.15);
}
.modal.draw .halo {
  background: radial-gradient(ellipse at center, rgba(255, 224, 102, 0.4), transparent 70%);
}

.icon {
  position: relative;
  font-size: 56px;
  line-height: 1;
  margin-bottom: 8px;
  filter: drop-shadow(0 6px 18px rgba(0, 0, 0, 0.5));
  animation: bounce 0.6s ease;
}
h2 {
  position: relative;
  margin: 0 0 4px;
  font-size: 30px;
  letter-spacing: 3px;
  font-weight: 900;
}
.modal.win h2 {
  color: #66f6ff;
  text-shadow: 0 0 20px rgba(0, 229, 255, 0.8);
}
.modal.loss h2 {
  color: #ff8fd1;
  text-shadow: 0 0 18px rgba(255, 61, 176, 0.7);
}
.modal.draw h2 {
  color: #ffe066;
  text-shadow: 0 0 18px rgba(255, 224, 102, 0.6);
}
.sub {
  position: relative;
  margin: 0 0 20px;
  color: #9aa2d1;
  font-size: 13px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.reward-row {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 18px;
  background: rgba(10, 14, 40, 0.7);
  border: 1px solid rgba(107, 115, 193, 0.25);
  border-radius: 12px;
  margin-bottom: 12px;
}
.label {
  color: #9aa2d1;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
}
.amount {
  font-size: 20px;
  font-weight: 700;
  color: #ffe066;
  text-shadow: 0 0 10px rgba(255, 224, 102, 0.5);
}

.rare {
  position: relative;
  margin: 14px 0;
  padding: 16px;
  border-radius: 14px;
  background: linear-gradient(135deg, #ffe066, #ff9d3d 60%, #ff5fa2);
  color: #2a1b00;
  box-shadow: 0 10px 32px rgba(255, 157, 61, 0.55);
  overflow: hidden;
  animation: pulse 1.6s ease-in-out infinite;
}
.rare-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent 30%, rgba(255, 255, 255, 0.6) 50%, transparent 70%);
  transform: translateX(-100%);
  animation: shine 2.4s ease-in-out infinite;
}
.rare-title {
  position: relative;
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 2px;
}
.rare-sub {
  position: relative;
  margin-top: 6px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.total {
  position: relative;
  margin: 16px 0 22px;
  font-size: 15px;
  color: #b8c0ff;
}
.total strong {
  color: #ffe066;
  font-size: 22px;
  margin-left: 6px;
  text-shadow: 0 0 10px rgba(255, 224, 102, 0.5);
}

.btn {
  position: relative;
  width: 100%;
  padding: 14px 18px;
  border-radius: 12px;
  border: 1px solid rgba(0, 229, 255, 0.4);
  background: linear-gradient(135deg, #00e5ff 0%, #5865f2 100%);
  color: #031021;
  font-size: 15px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
  box-shadow: 0 8px 24px rgba(0, 229, 255, 0.35), 0 0 40px rgba(88, 101, 242, 0.3);
}
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 229, 255, 0.5), 0 0 60px rgba(88, 101, 242, 0.45);
}
.btn:active {
  transform: translateY(0);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.pop-enter-active {
  transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pop-enter-from {
  opacity: 0;
  transform: scale(0.6) rotate(-3deg);
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.92);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@keyframes bounce {
  0% {
    transform: scale(0.3) rotate(-10deg);
    opacity: 0;
  }
  60% {
    transform: scale(1.2) rotate(5deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0);
  }
}
@keyframes pulse {
  0%, 100% {
    box-shadow: 0 10px 32px rgba(255, 157, 61, 0.45);
  }
  50% {
    box-shadow: 0 10px 44px rgba(255, 224, 102, 0.85);
  }
}
@keyframes shine {
  0% {
    transform: translateX(-100%);
  }
  60%, 100% {
    transform: translateX(100%);
  }
}
</style>
