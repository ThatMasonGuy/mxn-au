// src/router.js
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue";
import About from "@/pages/About.vue";
import Contact from "@/pages/Contact.vue";

const routes = [
  {
    path: "/",
    alias: ["/", "/index", ""],
    name: "Home",
    component: Home,
    meta: { requiresAuth: true, title: "Home", requiresOverlay: true },
  },
  {
    path: "/about",
    alias: "/about-us",
    name: "About",
    component: About,
    meta: { requiresAuth: true, title: "About", requiresOverlay: true },
  },
  {
    path: "/contact",
    alias: "/contact-us",
    name: "Contact",
    component: Contact,
    meta: { requiresAuth: true, title: "Contact", requiresOverlay: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
