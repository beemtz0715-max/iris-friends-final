<template>
  <div class="login-page">

    <!-- BIG LOGO -->
    <img src="/src/assets/logo.png" class="big-login-logo" />

    <!-- Title -->
    <h1 class="welcome-title">Welcome to Iris & Friends</h1>

    <div class="card">
      <h2>Login</h2>

      <p v-if="auth.error" class="error">{{ auth.error }}</p>

      <!-- ONE‑CLICK DEMO LOGIN BUTTON -->
      <button class="button" @click="demoLogin">
        Login as Demo User
      </button>

      <p style="margin-top:1rem; color:#777;">
        demo@example.com / password123
      </p>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();

async function demoLogin() {
  const ok = await auth.login("demo@example.com", "password123");
  if (ok) router.push("/");
  else alert("Demo login failed");
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffb6e6, #ff8acb, #ff6bcb);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
}

.big-login-logo {
  width: 260px;
  height: auto;
  display: block;
  margin-bottom: 10px;
}

.welcome-title {
  color: white;
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.card {
  background: white;
  width: 90%;
  max-width: 350px;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  text-align: center;
}

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

.error {
  color: red;
  margin-bottom: 10px;
}
</style>
