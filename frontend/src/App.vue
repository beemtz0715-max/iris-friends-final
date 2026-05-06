<template>
  <div>
    <header
      style="
        background: var(--pink);
        padding: 1rem;
        color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
      "
    >
      <div style="display:flex; align-items:center;">
        <img
          src="/src/assets/logo.png"
          alt="Iris & Friends Logo"
          style="
            height:48px;
            width:auto;
            margin-right:0.75rem;
            border-radius:12px;
            box-shadow:0 2px 6px rgba(0,0,0,0.15);
          "
        />

        <div style="font-weight:700; font-size:1.2rem;">
          🐾 Iris & Friends 🐾
        </div>
      </div>

      <button
        v-if="auth.token"
        class="button"
        style="background:white; color:var(--pink);"
        @click="auth.logout()"
      >
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
