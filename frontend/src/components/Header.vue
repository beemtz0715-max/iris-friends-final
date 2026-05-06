<script setup>
import { useRouter } from "vue-router";
import { useCatsStore } from "../stores/cats";

const router = useRouter();
const cats = useCatsStore();

function logout() {
  cats.logout();
  router.push("/login");
}
</script>

<template>
  <header class="header">
    <img src="/src/assets/logo.png" class="big-logo" />

    <button class="logout-btn" @click="logout">
      Logout
    </button>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
}

.big-logo {
  width: 180px;
  height: auto;
}

.logout-btn {
  background: #ff6b6b;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}
</style>
