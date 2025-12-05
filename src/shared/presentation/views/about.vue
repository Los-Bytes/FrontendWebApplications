<script setup>
import {useI18n} from "vue-i18n";
import packageInfo from "../../../../package.json";

const { t } = useI18n();
const version = packageInfo.version;
</script>

<template>
  <div class="about-page">
    <!-- Hero Section -->
    <div class="hero-section surface-ground py-6 px-4 text-center">
      <div class="container-width mx-auto">
        <h1 class="text-900 font-bold text-5xl mb-3">About <span class="text-primary">LabIoT</span></h1>
        <p class="text-600 text-xl font-medium line-height-3 max-w-40rem mx-auto">
          Revolutionizing laboratory management through IoT integration, real-time analytics, and seamless automation.
        </p>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="container-width mx-auto py-6 px-4">
      <div class="grid align-items-center">
        <!-- Image/Logo Column -->
        <div class="col-12 md:col-5 text-center">
          <div class="surface-card p-4 shadow-2 border-round-xl inline-flex align-items-center justify-content-center" style="width: 100%; max-width: 300px; aspect-ratio: 1;">
            <img src="/logo-lab.png" alt="LabIoT Logo" class="w-full h-auto" style="max-height: 200px; object-fit: contain;" />
          </div>
        </div>

        <!-- Mission Text Column -->
        <div class="col-12 md:col-7 pl-4 md:pl-6">
          <h2 class="text-900 text-3xl font-bold mb-4 text-gray-600">Our Mission</h2>
          <p class="text-700 text-lg line-height-3 mb-4 text-gray-500">
            {{ t('about.content') }}
          </p>
          <div class="flex gap-3">
            <pv-button label="View Features" icon="pi pi-bolt" outlined />
            <pv-button label="Contact Support" icon="pi pi-envelope" severity="secondary" outlined />
          </div>
        </div>
      </div>

      <pv-divider class="my-8" />

      <!-- Features Section -->
      <div class="text-center mb-6 pt-4">
        <h2 class="text-900 text-3xl font-bold mb-2 text-gray-600">Why Choose LabIoT?</h2>
        <p class="text-600 mb-6 text-gray-500">Empowering researchers and administrators with next-gen tools.</p>
        
        <div class="grid">
          <div class="col-12 md:col-4 p-3">
            <div class="surface-card p-4 shadow-2 border-round h-full">
              <div class="text-primary text-4xl mb-3"><i class="pi pi-sync"></i></div>
              <h3 class="text-900 text-xl font-bold mb-2">Real-Time Sync</h3>
              <p class="text-600 line-height-3">Instant data synchronization across all your laboratory devices and sensors.</p>
            </div>
          </div>
          <div class="col-12 md:col-4 p-3">
             <div class="surface-card p-4 shadow-2 border-round h-full">
              <div class="text-primary text-4xl mb-3"><i class="pi pi-shield"></i></div>
              <h3 class="text-900 text-xl font-bold mb-2">Secure & Reliable</h3>
              <p class="text-600 line-height-3">Enterprise-grade security ensuring your sensitive research data is always protected.</p>
            </div>
          </div>
          <div class="col-12 md:col-4 p-3">
             <div class="surface-card p-4 shadow-2 border-round h-full">
              <div class="text-primary text-4xl mb-3"><i class="pi pi-chart-line"></i></div>
              <h3 class="text-900 text-xl font-bold mb-2">Advanced Analytics</h3>
              <p class="text-600 line-height-3">Visualize usage patterns and optimize resource allocation with built-in charts.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer/Version Info -->
      <div class="text-center mt-8 text-500 text-sm">
        <p>Built with ❤️ by the LabIoT Team</p>
        <p>Version {{ version }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container-width {
  max-width: 1200px;
}
</style>