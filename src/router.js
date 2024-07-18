import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/Login",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/Dashboard",
      name: "dashboard",
      component: () => import("./views/Dashboard.vue"),
    },
    {
      path: "/Profile",
      name: "profile",
      component: () => import("./views/Profile.vue"),
    },
    {
      path: "/Resumes",
      name: "resumes",
      component: () => import("./views/Resumes.vue"),
    },
    {
      path: "/GenerateResume",
      name: "generateResume",
      component: () => import("./views/GenerateResume.vue"),
    },
  ],
});

export default router;
