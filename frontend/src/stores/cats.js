import { defineStore } from "pinia";

export const useCatsStore = defineStore("cats", {
  state: () => ({
    cats: [],
    user: null,
  }),

  actions: {
    login(user) {
      this.user = user;
    },

    logout() {
      this.user = null;
      this.cats = [];
    },

    addCat(cat) {
      const id = Date.now();
      this.cats.push({
        id,
        name: cat.name,
        notes: cat.notes,
        color: cat.color,
        initial: cat.name.charAt(0).toUpperCase(),
      });
    },
  },
});
