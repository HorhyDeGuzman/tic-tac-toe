<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import type { Difficulty } from '@/game/types'

const store = useGameStore()
const { difficulty } = storeToRefs(store)

const emit = defineEmits<{ (e: 'change', d: Difficulty): void }>()

interface Option {
  value: Difficulty
  label: string
  hint: string
  icon: string
}

const options: Option[] = [
  { value: 'easy', label: 'Лёгкая', hint: 'Случайные ходы', icon: '🌱' },
  { value: 'medium', label: 'Средняя', hint: 'Блокирует и атакует', icon: '⚔️' },
  { value: 'hard', label: 'Сложная', hint: 'Идеальный ИИ', icon: '🔥' },
]

function select(d: Difficulty) {
  if (d === difficulty.value) return
  store.setDifficulty(d)
  emit('change', d)
}
</script>

<template>
  <div class="selector">
    <span class="title">Сложность</span>
    <div class="options">
      <button
        v-for="opt in options"
        :key="opt.value"
        class="opt"
        :class="[opt.value, { active: difficulty === opt.value }]"
        @click="select(opt.value)"
      >
        <span class="ico">{{ opt.icon }}</span>
        <span class="label">{{ opt.label }}</span>
        <span class="hint">{{ opt.hint }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.selector {
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.title {
  font-size: 11px;
  color: #9aa2d1;
  text-transform: uppercase;
  letter-spacing: 2px;
  padding-left: 6px;
}
.options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.opt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 8px;
  border-radius: 12px;
  background: rgba(10, 14, 40, 0.65);
  border: 1px solid rgba(107, 115, 193, 0.25);
  color: #e8ecff;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
  font-family: inherit;
}
.opt:hover {
  transform: translateY(-1px);
  border-color: rgba(107, 115, 193, 0.55);
}
.opt .ico {
  font-size: 20px;
  line-height: 1;
}
.opt .label {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.opt .hint {
  font-size: 10px;
  color: #7a82b5;
  letter-spacing: 0.5px;
}

.opt.easy.active {
  border-color: rgba(72, 222, 128, 0.7);
  background: rgba(72, 222, 128, 0.12);
  box-shadow: 0 0 22px rgba(72, 222, 128, 0.35);
}
.opt.easy.active .label {
  color: #7efc9e;
}
.opt.medium.active {
  border-color: rgba(255, 224, 102, 0.7);
  background: rgba(255, 224, 102, 0.12);
  box-shadow: 0 0 22px rgba(255, 224, 102, 0.35);
}
.opt.medium.active .label {
  color: #ffe066;
}
.opt.hard.active {
  border-color: rgba(255, 61, 176, 0.75);
  background: rgba(255, 61, 176, 0.14);
  box-shadow: 0 0 22px rgba(255, 61, 176, 0.4);
}
.opt.hard.active .label {
  color: #ff8fd1;
}

@media (max-width: 480px) {
  .opt .hint {
    display: none;
  }
}
</style>
