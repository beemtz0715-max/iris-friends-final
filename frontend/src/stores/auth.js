import { defineStore } from "pinia";
import { api } from "../api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
    error: null,
    loading: false
  }),

  actions: {
    // ❌ REGISTER NO LONGER USED
    // We keep it but it won't be called
    async register() {
      this.error = "Registration disabled. Use demo login.";
    },

    // ⭐ FIXED LOGIN — returns true/false
    async login(email, password) {
      this.loading = true;
      this.error = null;

      try {
        const data = await api("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password })
        });

        // If backend returned an error, api() throws
        this.token = data.token;
        this.user = data.user;

        localStorage.setItem("token", data.token);

        return true; // ⭐ important
      } catch (e) {
        this.error = e.message || "Login failed";
        return false; // ⭐ important
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
    }
  }
});
