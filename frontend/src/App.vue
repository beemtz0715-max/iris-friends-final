<template>
  <div>
    <header style="background:var(--pink); padding:1rem; color:white; display:flex; justify-content:space-between;">
      <div style="font-weight:700;">Iris & Friends · Pet Care Tracker</div>
      <button v-if="auth.token" class="button" style="background:white; color:var(--pink);" @click="auth.logout()">
        Logout
      </button>
    </header>

    <main style="padding:1.5rem; max-width:900px; margin:auto;">
      <router-view />
    </main>

    <footer style="text-align:center; padding:1rem; color:#777;">
      Iris · Jasper · Raja · Cali
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from "./stores/auth";
const auth = useAuthStore();
</script>
