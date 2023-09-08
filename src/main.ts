import { createApp, ref, getCurrentScope, computed, watchEffect } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import dayjs from 'dayjs'
import IsoWeek from 'dayjs/plugin/isoWeek'

import App from './App.vue'
import router from './router'
import { beforeEach } from './router/beforeEach'

import './assets/main.css'
import './iconfont/iconfont.css'

dayjs.extend(IsoWeek)

const app = createApp(App)
const pinia = createPinia()

pinia.use(
  createPersistedState({
    // storage: sessionStorage,
    key: (id) => `__persisted__${id}`,
    debug: true
  })
)

router.beforeEach(beforeEach)

app.use(pinia)
app.use(router)

app.mount('#app')
