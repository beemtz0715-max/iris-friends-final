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
    async register({ name, email, password }) {
      this.loading = true;
      this.error = null;
      try {
        const data = await api("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({ name, email, password })
        });
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem("token", data.token);
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },

    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const data = await api("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password })
        });
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem("token", data.token);
      } catch (e) {
        this.error = e.message;
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
