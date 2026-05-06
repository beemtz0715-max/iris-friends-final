import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import DashboardView from "../views/DashboardView.vue";
import CatTasksView from "../views/CatTasksView.vue";
import CatVetView from "../views/CatVetView.vue";

const routes = [
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },
  { path: "/", component: DashboardView, meta: { auth: true } },
  { path: "/cats/:id/tasks", component: CatTasksView, meta: { auth: true } },
  { path: "/cats/:id/vet", component: CatVetView, meta: { auth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.auth && !auth.token) return "/login";
});

export default router;
