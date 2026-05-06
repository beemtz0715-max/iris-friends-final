import { defineStore } from "pinia";
import { api } from "../api";

export const useCatsStore = defineStore("cats", {
  state: () => ({
    cats: [],
    tasks: {},
    vet: {},
    loading: false,
    error: null
  }),

  actions: {
    async loadCats() {
      this.loading = true;
      try {
        this.cats = await api("/api/cats");
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },

    async loadTasks(catId) {
      try {
        this.tasks[catId] = await api(`/api/cats/${catId}/tasks/today`);
      } catch (e) {
        this.error = e.message;
      }
    },

    async toggleTask(catId, task) {
      const path = `/api/cats/${catId}/tasks/${task.id}/complete`;
      try {
        if (task.completed) {
          await api(path, { method: "DELETE" });
        } else {
          await api(path, { method: "POST" });
        }
        await this.loadTasks(catId);
      } catch (e) {
        this.error = e.message;
      }
    },

    async loadVet(catId) {
      try {
        this.vet[catId] = await api(`/api/cats/${catId}/vet`);
      } catch (e) {
        this.error = e.message;
      }
    },

    async addVet(catId, record) {
      await api(`/api/cats/${catId}/vet`, {
        method: "POST",
        body: JSON.stringify(record)
      });
      await this.loadVet(catId);
    }
  }
});
