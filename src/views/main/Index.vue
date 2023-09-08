<script setup lang="ts">
import { RouterView } from 'vue-router'
import Menu from './Menu.vue'
</script>

<template>
  <div class="main">
    <Menu />

    <RouterView v-slot="{ Component, route }">
      <Transition name="page" mode="out-in">
        <component class="content" :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </div>
</template>

<style scoped>
.main {
  display: flex;
}

.content {
  flex: 1;
  min-height: 100vh;
}
</style>
