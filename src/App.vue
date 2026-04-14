<script setup lang="ts">
import GameView from './views/GameView.vue'
</script>

<template>
  <GameView />
</template>

<style>
* {
  box-sizing: border-box;
}
html,
body,
#app {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  background: #0a0d20;
  color: #e8ecff;
}
</style>
