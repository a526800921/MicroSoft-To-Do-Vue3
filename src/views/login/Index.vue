<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginInfoStore } from '@/stores/user'

const router = useRouter()
const loginInfoStore = useLoginInfoStore()

const username = ref('')
const password = ref('')

const handleSubmit = () => {
  console.log(username.value, password.value)

  if (!username.value || !password.value) return alert('请输入用户名、密码')

  loginInfoStore.updateUserInfo(1, username.value)

  router.push('/')
}

const usernameInput = ref<HTMLInputElement | null>(null)

onMounted(() => {
  usernameInput.value?.focus()
})
</script>

<template>
  <div class="login" @keyup.enter="handleSubmit">
    <div class="box">
      <h4>登录</h4>
      <div class="item">
        <p>用户名：</p>
        <input ref="usernameInput" type="text" maxlength="18" v-model="username" />
      </div>
      <div class="item">
        <p>密&emsp;码：</p>
        <input type="password" maxlength="18" v-model="password" />
      </div>
      <button class="submit" @click="handleSubmit">进入</button>
    </div>
  </div>
</template>

<style scoped>
.login {
  position: relative;
  z-index: 0;
  min-height: 100vh;
  background-color: var(--color-bg);
}

.box {
  position: absolute;
  z-index: 1;
  width: 480px;
  height: 600px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

h4 {
  margin-top: -100px;
  font-size: 30px;
  margin-bottom: 50px;
}

.item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.submit {
  width: 80px;
  height: 40px;
  font-size: 16px;
  margin-right: -150px;
}
</style>
