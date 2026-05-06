<template>
  <div class="card">
    <h2>Login</h2>
    <p v-if="auth.error" style="color:red">{{ auth.error }}</p>

    <input class="input" v-model="email" placeholder="Email" />
    <input class="input" v-model="password" type="password" placeholder="Password" />

    <button class="button" @click="login">Login</button>

    <p style="margin-top:1rem;">
      No account?
      <router-link to="/register">Register</router-link>
    </p>
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
