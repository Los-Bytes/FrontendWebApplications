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
  background: transparent !important;
  color: var(--text-on-dark);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0;
  box-sizing: border-box;
  text-align: center;
}


.footer-row {
  width: 100%;
  max-width: var(--container-max-width);
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}


.footer-text {
  margin: 0;
  color: var(--text-on-dark);
  font-size: 0.95rem;
  line-height: 1.45;
}


.footer-link {
  color: var(--secondary-green);
  text-decoration: underline;
  font-weight: 600;
  margin: 0 .15rem;
}


.footer-content :deep(.pi-heart) {
  color: var(--secondary-green);
  margin: 0 .3rem;
}


.footer-content :deep(.bg-primary),
.footer-content :deep(.p-card),
.footer-content :deep(.p-panel),
.footer-content :deep(.surface) {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
}


@media (max-width: 520px) {
  .footer-text { font-size: 0.9rem; }
  .footer-row { padding: 0 .6rem; }
}
</style>
