// src/router.js
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue";
import About from "@/pages/About.vue";
import Contact from "@/pages/Contact.vue";
import Websites from "@/pages/Websites.vue";
import Login from "@/pages/Login.vue";
import Landing from "@/pages/Landing.vue";
import SignUp from "@/pages/SignUp.vue";
import Protected from "@/pages/Protected.vue";
import Portfolio from "@/pages/Portfolio.vue";
import Page404 from "@/pages/system/Page404.vue";

const routes = [
  {
    path: "/",
    alias: ["/", "/index", ""],
    name: "Home",
    component: Home,
    meta: { requiresAuth: false, title: "Home", requiresOverlay: true, requiresAuthOverlay: false },
  },
  {
    path: "/home",
    alias: "/Home",
    name: "Photography",
    component: Home,
    meta: { requiresAuth: false, title: "Photography", requiresOverlay: true, requiresAuthOverlay: true },
  },
  {
    path: "/about",
    alias: "/about-us",
    name: "About",
    component: About,
    meta: { requiresAuth: false, title: "About", requiresOverlay: true, requiresAuthOverlay: false },
  },
  {
    path: "/contact",
    alias: "/contact-us",
    name: "Contact",
    component: Contact,
    meta: { requiresAuth: false, title: "Contact", requiresOverlay: true, requiresAuthOverlay: false },
  },
  {
    path: "/websites",
    alias: "/websites",
    name: "Websites",
    component: Websites,
    meta: { requiresAuth: false, title: "Websites", requiresOverlay: true, requiresAuthOverlay: false },
  },
  {
    path: "/login",
    alias: "/signin",
    name: "Login",
    component: Login,
    meta: { requiresAuth: false, title: "Login", requiresOverlay: false, requiresAuthOverlay: false },
  },
  {
    path: "/signup",
    alias: ["/create-account", "/sign-up"],
    name: "Sign Up",
    component: SignUp,
    meta: { requiresAuth: false, title: "Sign Up", requiresOverlay: false, requiresAuthOverlay: false },
  },
  {
    path: "/protected",
    alias: "/protected",
    name: "Protected",
    component: Protected,
    meta: { requiresAuth: true, title: "Protected", requiresOverlay: true, requiresAuthOverlay: true },
  },
  {
    path: "/portfolio",
    alias: "/portfolio",
    name: "Portfolio",
    component: Portfolio,
    meta: { requiresAuth: false, title: "Portfolio", requiresOverlay: true, requiresAuthOverlay: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: Page404,
    meta: { requiresAuth: false, title: "404", requiresOverlay: false, requiresAuthOverlay: false },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;