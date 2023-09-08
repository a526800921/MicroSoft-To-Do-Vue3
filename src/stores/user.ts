import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import avatarPic from '@/assets/avatar.jpg'
import defaultAvatarPic from '@/assets/default.png'

export const useLoginInfoStore = defineStore(
  'loginInfo',
  () => {
    const userInfo = ref({
      id: 0,
      name: ''
    })

    const updateUserInfo = (id: number, name: string) => {
      userInfo.value.id = id
      userInfo.value.name = name
    }

    const isLogin = computed(() => !!userInfo.value.id)
    const avatar = computed(() => (isLogin ? avatarPic : defaultAvatarPic))

    return {
      userInfo,
      updateUserInfo,
      isLogin,
      avatar
    }
  },
  {
    persist: {
      paths: ['userInfo']
    }
  }
)
