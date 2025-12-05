<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>

<template>
  <footer class="footer-content" role="contentinfo" aria-label="Site footer">
    <div class="footer-row">
      <p class="footer-text">Copyright &copy; 2025. ASSIDUOU SOFTWARE</p>
    </div>

    <div class="footer-row">
      <p class="footer-text">
        {{ t('authoring-phrase.intro') }}
        <i class="pi pi-heart" aria-hidden="true"></i>
        {{ t('authoring-phrase.use') }}
        <a class="footer-link" href="https://primevue.org/" target="_blank" rel="noopener noreferrer">PrimeVue</a>
        {{ t('authoring-phrase.author', { brand: 'ASSIDUOU SOFTWARE' }) }}
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer-content {
  width: 100%;
  color: var(--text-color-secondary);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0;
  text-align: center;
}

.footer-row {
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-text {
  margin: 0;
  color: var(--text-color-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
}

.footer-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  margin: 0 0.25rem;
  transition: color 0.2s;
}

.footer-link:hover {
  text-decoration: underline;
  color: var(--primary-color-text);
}

.text-red-500 {
    color: var(--red-500, #ef4444);
    margin: 0 0.25rem;
}
</style>