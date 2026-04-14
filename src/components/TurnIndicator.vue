<script setup lang="ts">
import { computed } from 'vue'
import type { Turn } from '@/game/types'

const props = defineProps<{ turn: Turn }>()

const label = computed(() => {
  if (props.turn === 'player') return 'Твой ход'
  if (props.turn === 'ai') return 'Ход ИИ...'
  return '—'
})

const mark = computed(() => (props.turn === 'ai' ? 'O' : 'X'))
</script>

<template>
  <div class="turn" :class="turn">
    <span class="dot" />
    <span class="mark">{{ mark }}</span>
    <span class="label">{{ label }}</span>
  </div>
</template>

<style scoped>
.turn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(10, 14, 40, 0.7);
  border: 1px solid rgba(107, 115, 193, 0.35);
  color: #e8ecff;
  font-size: 13px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.turn.player {
  border-color: rgba(0, 229, 255, 0.6);
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.25);
}
.turn.ai {
  border-color: rgba(255, 61, 176, 0.6);
  box-shadow: 0 0 20px rgba(255, 61, 176, 0.3);
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #9aa2d1;
}
.turn.player .dot {
  background: #66f6ff;
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.8);
  animation: pulse 1.2s ease-in-out infinite;
}
.turn.ai .dot {
  background: #ff8fd1;
  box-shadow: 0 0 10px rgba(255, 61, 176, 0.8);
  animation: pulse 0.9s ease-in-out infinite;
}
.mark {
  font-weight: 800;
  font-size: 15px;
}
.turn.player .mark {
  color: #66f6ff;
  text-shadow: 0 0 8px rgba(0, 229, 255, 0.6);
}
.turn.ai .mark {
  color: #ff8fd1;
  text-shadow: 0 0 8px rgba(255, 61, 176, 0.6);
}
.label {
  font-weight: 600;
  color: #b8c0ff;
}
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.35);
    opacity: 0.7;
  }
}
</style>
