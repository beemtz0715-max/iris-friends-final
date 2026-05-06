<template>
  <div class="login-page">

    <!-- BIG LOGO -->
    <img src="/src/assets/logo.png" class="big-login-logo" />

    <!-- Title -->
    <h1 class="welcome-title">Welcome to Iris & Friends</h1>

    <div class="card">
      <h2>Login</h2>

      <p v-if="auth.error" class="error">{{ auth.error }}</p>

      <input class="input" v-model="email" placeholder="Email" />
      <input class="input" v-model="password" type="password" placeholder="Password" />

      <button class="button" @click="login">Login</button>

      <p class="register-text">
        No account?
        <router-link to="/register">Register</router-link>
      </p>
    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");

async function login() {
  await auth.login(email.value, password.value);
  if (auth.token) router.push("/");
}
</script>

<style scoped>
/* Pink gradient background */
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffb6e6, #ff8acb, #ff6bcb);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
}

/* Big centered logo */
.big-login-logo {
  width: 260px;
  height: auto;
  display: block;
  margin-bottom: 10px;
}

/* Cute welcome title */
.welcome-title {
  color: white;
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* Login card */
.card {
  background: white;
  width: 90%;
  max-width: 350px;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  text-align: center;
}

/* Inputs */
.input {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  border-radius: 10px;
  border: 1px solid #ddd;
  font-size: 15px;
}

/* Pink login button */
.button {
  width: 100%;
  margin-top: 15px;
  padding: 12px;
  background: #ff6bcb;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
}

/* Error text */
.error {
  color: red;
  margin-bottom: 10px;
}

/* Register link */
.register-text {
  margin-top: 1rem;
  font-size: 14px;
}
</style>
