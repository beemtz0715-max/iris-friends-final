<template>
  <div class="card">
    <h2>Register</h2>
    <p v-if="auth.error" style="color:red">{{ auth.error }}</p>

    <input class="input" v-model="name" placeholder="Name" />
    <input class="input" v-model="email" placeholder="Email" />
    <input class="input" v-model="password" type="password" placeholder="Password" />

    <button class="button" @click="register">Register</button>

    <p style="margin-top:1rem;">
      Already have an account?
      <router-link to="/login">Login</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");

async function register() {
  await auth.register({
    name: name.value,
    email: email.value,
    password: password.value
  });

  if (auth.token) router.push("/");
}
</script>
