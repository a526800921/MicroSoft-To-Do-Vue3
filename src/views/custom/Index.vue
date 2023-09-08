<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import Page from '@/components/Page/Index.vue'
import { useMenuStore } from '@/stores/menu'

const route = useRoute()
const menuStore = useMenuStore()

const menu = computed(() => menuStore.getCustomMenu(route.params.id as string))
</script>

<template>
  <div class="custom">
    <Page v-if="menu" :menu="menu" isCustomMenu showMoreDelete />
  </div>
</template>

<style scoped>
.custom {
}
</style>
