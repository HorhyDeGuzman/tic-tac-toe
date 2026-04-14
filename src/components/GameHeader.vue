<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'
import { pluralRu, RU } from '@/utils/plural'

const store = useGameStore()
const { crystals, wins, draws, losses, currentStreak, bestStreak, totalGames, winRate } =
  storeToRefs(store)

const winsLabel = computed(() => pluralRu(wins.value, RU.wins))
const drawsLabel = computed(() => pluralRu(draws.value, RU.draws))
const lossesLabel = computed(() => pluralRu(losses.value, RU.losses))
const gamesLabel = computed(() => pluralRu(totalGames.value, RU.games))
const crystalsLabel = computed(() => pluralRu(crystals.value, RU.crystals))
</script>

<template>
  <header class="header">
    <div class="title">
      <span class="logo">✦</span>
      <div class="title-text">
        <h1>Крестики-Нолики</h1>
        <span class="subtitle">Neon Arena</span>
      </div>
    </div>

    <div class="crystals-card">
      <span class="ico">💎</span>
      <div class="crystal-col">
        <span class="label">{{ crystalsLabel }}</span>
        <span class="value">{{ crystals.toLocaleString('ru-RU') }}</span>
      </div>
    </div>

    <div class="stats">
      <div class="stat win">
        <span class="value">{{ wins }}</span>
        <span class="label">{{ winsLabel }}</span>
      </div>
      <div class="stat draw">
        <span class="value">{{ draws }}</span>
        <span class="label">{{ drawsLabel }}</span>
      </div>
      <div class="stat loss">
        <span class="value">{{ losses }}</span>
        <span class="label">{{ lossesLabel }}</span>
      </div>
      <div class="stat rate">
        <span class="value">{{ winRate }}%</span>
        <span class="label">Винрейт</span>
      </div>
      <div class="stat streak">
        <span class="value">{{ currentStreak }} / {{ bestStreak }}</span>
        <span class="label">Серия 🔥</span>
      </div>
      <div class="stat total">
        <span class="value">{{ totalGames }}</span>
        <span class="label">{{ gamesLabel }}</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 16px 20px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px;
  align-items: center;
  background: linear-gradient(180deg, rgba(28, 33, 72, 0.85), rgba(15, 18, 48, 0.85));
  border: 1px solid rgba(88, 101, 242, 0.35);
  border-radius: 16px;
  box-shadow:
    0 0 0 1px rgba(88, 101, 242, 0.15),
    0 10px 30px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(88, 101, 242, 0.15);
  backdrop-filter: blur(8px);
}
.title {
  display: flex;
  align-items: center;
  gap: 12px;
}
.logo {
  font-size: 26px;
  color: #ffe066;
  text-shadow: 0 0 12px rgba(255, 224, 102, 0.7);
}
.title-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}
h1 {
  margin: 0;
  font-size: 20px;
  color: #e8ecff;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.subtitle {
  font-size: 11px;
  color: #8f9bff;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.crystals-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255, 224, 102, 0.16), rgba(255, 157, 61, 0.08));
  border: 1px solid rgba(255, 224, 102, 0.5);
  box-shadow: 0 0 24px rgba(255, 224, 102, 0.2);
  justify-self: end;
}
.crystals-card .ico {
  font-size: 22px;
  filter: drop-shadow(0 0 8px rgba(255, 224, 102, 0.7));
}
.crystal-col {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}
.crystals-card .label {
  font-size: 10px;
  color: #ffd966;
  text-transform: uppercase;
  letter-spacing: 1.2px;
}
.crystals-card .value {
  font-size: 20px;
  font-weight: 800;
  color: #fff6c9;
  text-shadow: 0 0 10px rgba(255, 224, 102, 0.5);
}

.stats {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}
.stat {
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(10, 14, 40, 0.7);
  border: 1px solid rgba(107, 115, 193, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.stat .label {
  font-size: 10px;
  color: #9aa2d1;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  text-align: center;
}
.stat .value {
  font-size: 18px;
  font-weight: 800;
  color: #e8ecff;
  line-height: 1;
}
.stat.win {
  border-color: rgba(0, 229, 255, 0.45);
  box-shadow: inset 0 0 12px rgba(0, 229, 255, 0.1);
}
.stat.win .value {
  color: #66f6ff;
  text-shadow: 0 0 8px rgba(0, 229, 255, 0.6);
}
.stat.loss {
  border-color: rgba(255, 61, 176, 0.4);
}
.stat.loss .value {
  color: #ff8fd1;
}
.stat.draw {
  border-color: rgba(255, 224, 102, 0.35);
}
.stat.draw .value {
  color: #ffe066;
}
.stat.rate .value,
.stat.streak .value {
  color: #b8c0ff;
}

@media (max-width: 640px) {
  .header {
    grid-template-columns: 1fr auto;
  }
  .stats {
    grid-template-columns: repeat(3, 1fr);
  }
  h1 {
    font-size: 16px;
  }
  .crystals-card .value {
    font-size: 16px;
  }
  .stat .value {
    font-size: 16px;
  }
}
</style>
