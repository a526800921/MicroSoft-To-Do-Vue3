import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const searchValue = ref('')

  const changeSearchValue = (v: string) => {
    searchValue.value = v
  }

  return {
    searchValue,
    changeSearchValue
  }
})
