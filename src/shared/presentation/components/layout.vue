<script setup>
import { useI18n } from "vue-i18n";
import FooterContent from "./footer-content.vue";
import LanguageSwitcher from "./language-switcher.vue";
import AuthenticationSection from "../../../iam/presentation/components/authentication-section.vue";

const { t } = useI18n();

const items = [
  { label: "option.home", to: "/home" },
  { label: "option.about", to: "/about" },
  { label: "option.users", to: "/user-profile/users" },
  { label: "option.mySubscription", to: "/subscription/my-subscription" },
  { label: "option.laboratories", to: "/laboratory/laboratories" },
];
</script>

<template>
  <div class="header">
    <pv-toolbar class="pv-toolbar toolbar">
      <template #start>
        <div class="toolbar-brand">
          <img src="/logo-lab.png" alt="LabIoT" class="toolbar-logo" />
        </div>
      </template>

      <template #end>
        <div class="nav-links">
          <pv-button v-for="item in items" :key="item.label" text class="nav-button">
            <router-link :to="item.to" class="nav-link">
              {{ t(item.label) }}
            </router-link>
          </pv-button>
        </div>
        <authentication-section />
        <language-switcher />
      </template>
    </pv-toolbar>
  </div>

  <div class="main-content">
    <pv-confirm-dialog />
    <router-view />
  </div>

  <div class="footer" role="contentinfo">
    <div class="footer-inner container">
      <footer-content />
    </div>
  </div>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1100;
  background: var(--gray-dark); /* plomo */
  color: var(--text-on-dark);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(4px);
}


.pv-toolbar,
.toolbar {
  background: var(--gray-dark) !important;
  color: var(--text-on-dark) !important;
}

.toolbar-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  user-select: none;
  padding-left: 6px;
}
.toolbar-logo {
  height: 36px;
  width: auto;
  object-fit: contain;
  display: block;
}

.nav-links {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-right: 1rem;
}

.nav-button {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}

.nav-link {
  color: var(--text-on-dark);
  font-weight: 600;
  text-decoration: none;
  font-size: 1rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  transition: background 0.2s ease, color 0.2s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}
.router-link-active,
.router-link-exact-active {
  background: var(--secondary-green);
  color: #fff !important;
}


.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: var(--gray-dark) !important;
  z-index: 1050;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.2);
  padding: 0.8rem 0;
}


@media (max-width: 768px) {
  .nav-links {
    gap: 0.5rem;
  }
  .nav-link {
    font-size: 0.95rem;
    padding: 0.4rem 0.6rem;
  }
}
@media (max-width: 520px) {
  .toolbar-logo {
    height: 28px;
  }
  .footer {
    padding: 0.6rem 0;
    font-size: 0.95rem;
  }
  .main-content {
    padding-top: calc(var(--toolbar-height) + 0.6rem);
    padding-bottom: calc(var(--toolbar-height) + 0.6rem);
  }
}
</style>
