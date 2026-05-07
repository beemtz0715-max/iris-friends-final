import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import CatTasksView from "../views/CatTasksView.vue";
import CatVetView from "../views/CatVetView.vue";

const routes = [
  { path: "/login", component: LoginView },

  // Removed register route (not needed for MVP)
  // { path: "/register", component: RegisterView },

  { path: "/", component: DashboardView, meta: { auth: true } },
  { path: "/cats/:id/tasks", component: CatTasksView, meta: { auth: true } },
  { path: "/cats/:id/vet", component: CatVetView, meta: { auth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// ⭐ Route Guard
router.beforeEach((to) => {
  const auth = useAuthStore();

  // If route requires auth and no token → go to login
  if (to.meta.auth && !auth.token) {
    return "/login";
  }

  // If already logged in → prevent going back to login
  if (to.path === "/login" && auth.token) {
    return "/";
  }
});

export default router;
