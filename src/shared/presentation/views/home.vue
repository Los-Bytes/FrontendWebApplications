<script setup>
import {useI18n} from "vue-i18n";

const { t } = useI18n();

</script>

<template>
  <div class="home-container">
    <h1>{{ t('home.title') }}</h1>
    <p>{{ t('home.content') }}</p>
  </div>
</template>


<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: calc(100vh - var(--toolbar-height) * 2);
  padding: 1.5rem;
  box-sizing: border-box;
}


h1 {
  font-size: 2.2rem;
  color: var(--text-on-dark);
  margin-bottom: 1rem;
}

p {
  max-width: 700px;
  color: var(--text-on-dark);
  font-size: 1.1rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  h1 { font-size: 1.8rem; }
  p { font-size: 1rem; padding: 0 1rem; }
}

@media (max-width: 480px) {
  h1 { font-size: 1.5rem; }
  p { font-size: 0.95rem; }
}
</style>
