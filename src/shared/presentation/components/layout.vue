<script setup>
import { useI18n } from "vue-i18n";
import { computed } from "vue";
import FooterContent from "./footer-content.vue";
import LanguageSwitcher from "./language-switcher.vue";
import AuthenticationSection from "../../../iam/presentation/components/authentication-section.vue";
import useIamStore from "../../../iam/application/iam.service.js";

const { t } = useI18n();
const iamStore = useIamStore();

/**
 * Computed property to check if the current user is an admin.
 * @returns {boolean} True if the user is an admin, false otherwise.
 */
const isAdmin = computed(() => {
  return iamStore.currentUser?.role === 'admin';
});

/**
 * Computed property to check if the user is authenticated.
 * @returns {boolean} True if the user is signed in, false otherwise.
 */
const isAuthenticated = computed(() => {
  return iamStore.isSignedIn;
});

/**
 * Menu items configuration based on user authentication and role.
 * @type {Array<{label: string, to: string}>}
 */
const publicItems = [
  { label: "option.home", to: "/home" },
  { label: "option.about", to: "/about" }
];
/**
 * Menu items for authenticated users.
 * @type {Array<{label: string, to: string}>}
 */
const authenticatedItems = [
  { label: "option.mySubscription", to: "/subscription/my-subscription" },
  { label: "option.laboratories", to: "/laboratory/laboratories" },
];

/**
 * Menu items for admin users.
 * @type {Array<{label: string, to: string}>}
 */
const adminItems = [
  { label: "option.users", to: "/user-profile/users" }
];

/**
 * Computed property to get the menu items based on user authentication and role.
 * @returns {Array<{label: string, to: string}>} The menu items to be displayed.
 */
const items = computed(() => {
  let menuItems = [...publicItems];
  
  if (isAuthenticated.value) {
    if (isAdmin.value) {
      menuItems = [...menuItems, ...adminItems];
    }
    menuItems = [...menuItems, ...authenticatedItems];
  }
  
  return menuItems;
});

</script>

<template>
  <div class="layout-wrapper">
    <!-- Header -->
    <header class="app-header">
      <div class="container header-content">
        <div class="brand">
          <!-- Assuming logo is dark or colorful enough for white bg, otherwise might need text -->
          <img src="/logo-lab.png" alt="LabIoT" class="logo" />
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
            <authentication-section />
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
  background-color: rgba(59, 130, 246, 0.1);
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
  flex: 1;
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
        display: none;
    }
}
</style>