<script setup>
import {useI18n} from "vue-i18n";

const { t } = useI18n();

</script>

<template>
  <div class="about-container">
    <h1>{{ t('about.title')}}</h1>

    <div class="about-media">
      <img src="/logo-lab.png" alt="LabIoT Logo" class="about-logo" />
    </div>

    <p class="about-text">{{ t('about.content')}}</p>
  </div>
</template>

<style scoped>

.about-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  gap: 1rem;
  padding: 2rem 1rem;
  box-sizing: border-box;
  min-height: calc(100vh - var(--toolbar-height, 64px) - 2.5rem);
  color: var(--text-on-dark);
}


.about-media {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.about-logo {
  width: 200px;
  max-width: 60%;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 22px rgba(0,0,0,0.18);
  background: rgba(255,255,255,0.03);
}

.about-container h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-on-dark);
}

.about-text {
  max-width: 780px;
  color: var(--text-on-dark);
  font-size: 1.05rem;
  line-height: 1.6;
  margin: 0 auto;
  padding: 0 0.5rem;
}

.accent { color: var(--secondary-green); font-weight: 700; }

@media (max-width: 768px) {
  .about-logo { width: 160px; max-width: 55%; }
  .about-container h1 { font-size: 1.6rem; }
  .about-text { font-size: 1rem; }
}

@media (max-width: 420px) {
  .about-logo { width: 120px; max-width: 70%; }
  .about-container { padding: 1.2rem 0.75rem; gap: 0.75rem; }
  .about-text { font-size: 0.95rem; }
}
</style>
