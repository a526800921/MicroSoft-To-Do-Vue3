import type { NavigationGuardWithThis } from 'vue-router'

import { useLoginInfoStore } from '@/stores/user'

export const beforeEach: NavigationGuardWithThis<void> = (to, from, next) => {
  const loginInfoStore = useLoginInfoStore()

  if (!loginInfoStore.isLogin) {
    if (to.name !== 'login') {
      next({ name: 'login' })
      return
    }
  }

  next()
}
