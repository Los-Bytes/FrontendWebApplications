<script setup>
import { useI18n } from "vue-i18n";
import FooterContent from "./footer-content.vue";
import LanguageSwitcher from "./language-switcher.vue";

import useAuthStore from "../../../iam/application/iam.store.js";
import { useRouter } from "vue-router";

const { t } = useI18n();
const authStore = useAuthStore();
const router = useRouter();

const items = [
  { label: "option.home", to: "/home" },
  { label: "option.about", to: "/about" },
  { label: "option.users", to: "/user-profile/users" },
  { label: "option.subscriptions", to: "/subscription/subscriptions" },
  { label: "option.laboratories", to: "/laboratory/laboratories" },
];
</script>

<template>
  <div class="layout-wrapper">
    <!-- Header -->
    <header class="app-header">
      <div class="container header-content">
        <div class="brand">
          <!-- Assuming logo is dark or colorful enough for white bg, otherwise might need text -->
          <img src="/logo-lab.png" alt="LabIoT" class="logo" />
          <span class="brand-name">LabIoT</span>
        </div>

        <nav class="nav-menu">
          <router-link 
            v-for="item in items" 
            :key="item.label" 
            :to="item.to" 
            class="nav-link"
          >
            {{ t(item.label) }}
          </router-link>
        </nav>

        <div class="header-actions">
            <template v-if="!authStore.isSignedIn">
                <pv-button label="Sign In" text size="small" @click="router.push('/sign-in')" />
                <pv-button label="Sign Up" size="small" @click="router.push('/sign-up')" />
            </template>
            <template v-else>
                 <span class="mr-2 font-medium text-color-secondary hidden md:inline">{{ authStore.currentUsername }}</span>
                 <pv-button icon="pi pi-sign-out" text rounded severity="secondary" @click="authStore.signOut(router)" title="Logout" />
            </template>
            <language-switcher />
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="app-main container">
      <pv-confirm-dialog />
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <div class="container footer-inner">
        <footer-content />
      </div>
    </footer>
  </div>
</template>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Header Styles */
.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--surface-border);
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  height: 70px;
  display: flex;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--text-color);
  text-decoration: none;
}

.logo {
  height: 32px;
  width: auto;
}

.brand-name {
    color: var(--primary-color);
    letter-spacing: -0.5px;
}

/* Navigation */
.nav-menu {
  display: flex;
  gap: 0.5rem;
  margin: 0 2rem;
}

.nav-link {
  color: var(--text-color-secondary);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.nav-link:hover {
  color: var(--primary-color);
  background-color: var(--surface-ground);
}

.router-link-active {
  color: var(--primary-color);
  background-color: rgba(59, 130, 246, 0.1); /* Primary color low opacity */
  font-weight: 600;
}

/* Header Actions */
.header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
}

/* Main Content */
.app-main {
  flex: 1; /* Pushes footer down */
  padding-top: 2rem;
  padding-bottom: 2rem;
  width: 100%;
}

/* Footer */
.app-footer {
  background-color: var(--surface-section);
  border-top: 1px solid var(--surface-border);
  padding: 1.5rem 0;
  margin-top: auto;
}

.footer-inner {
  display: flex;
  justify-content: center;
  color: var(--text-color-secondary);
  font-size: 0.875rem;
}

/* Responses */
@media (max-width: 768px) {
    .nav-menu {
        display: none; /* In a real app, we'd add a mobile hamburger menu here */
    }
}
</style>
