<script setup>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const router = useRouter();

// Mock data for the dashboard to make it look alive and professional
const stats = [
    { title: 'Total Users', value: '1,250', icon: 'pi pi-users', color: 'text-blue-500', bg: 'bg-blue-100' },
    { title: 'Active Subs', value: '840', icon: 'pi pi-check-circle', color: 'text-green-500', bg: 'bg-green-100' },
    { title: 'Revenue', value: '$12k', icon: 'pi pi-dollar', color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Pending', value: '12', icon: 'pi pi-clock', color: 'text-orange-500', bg: 'bg-orange-100' }
];

const navigateTo = (path) => {
    router.push(path);
};
</script>

<template>
  <div class="dashboard-home">
    <!-- Hero / Welcome Section -->
    <div class="welcome-section mb-6">
      <h1 class="text-3xl font-bold text-gray-900">{{ t('home.title') }}</h1>
      <p class="text-gray-600 mt-2">{{ t('home.content') }}</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid-stats">
        <div v-for="stat in stats" :key="stat.title" class="stat-card card">
            <div class="stat-content">
                <div>
                    <span class="block text-500 font-medium mb-2 uppercase text-xs tracking-wider">{{ stat.title }}</span>
                    <div class="text-900 font-medium text-2xl">{{ stat.value }}</div>
                </div>
                <div class="stat-icon" :class="[stat.bg, stat.color]">
                    <i :class="stat.icon" style="font-size: 1.25rem"></i>
                </div>
            </div>
            <div class="stat-footer">
                <span class="text-green-500 font-medium">+5% </span>
                <span class="text-500">since last week</span>
            </div>
        </div>
    </div>

    <!-- Quick Actions / Modules -->
    <div class="section-title mt-8 mb-4">
        <h2>Quick Actions</h2>
    </div>

    <div class="grid-actions">
        <div class="action-card card" @click="navigateTo('/user-profile/users')">
            <div class="action-icon bg-blue-50 text-blue-600">
                <i class="pi pi-user-edit"></i>
            </div>
            <h3>Manage Users</h3>
            <p>View and edit user profiles.</p>
        </div>

        <div class="action-card card" @click="navigateTo('/subscription/subscriptions')">
            <div class="action-icon bg-purple-50 text-purple-600">
                <i class="pi pi-credit-card"></i>
            </div>
            <h3>Subscriptions</h3>
            <p>Monitor plan statuses.</p>
        </div>

        <div class="action-card card" @click="navigateTo('/laboratory/laboratories')">
             <div class="action-icon bg-teal-50 text-teal-600">
                <i class="pi pi-building"></i>
            </div>
            <h3>Laboratories</h3>
            <p>Manage lab facilities.</p>
        </div>
    </div>
  </div>
</template>

<style scoped>
.welcome-section h1 {
    color: var(--text-color);
}

.welcome-section p {
    color: var(--text-color-secondary);
}

/* Stats Logic */
.grid-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
}

.stat-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1.5rem;
    margin-bottom: 0; /* Reset global card margin */
    transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.stat-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
}

.stat-icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.stat-footer {
    font-size: 0.875rem;
}

/* Actions Grid */
.grid-actions {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.action-card {
    margin-bottom: 0;
    cursor: pointer;
    transition: var(--transition-short);
    border: 1px solid var(--surface-border);
}

.action-card:hover {
    border-color: var(--primary-color);
    background-color: #fafbfc;
}

.action-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
}

.action-icon i {
    font-size: 1.5rem;
}

.action-card h3 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
}

.action-card p {
    color: var(--text-color-secondary);
    font-size: 0.9rem;
    margin: 0;
}

/* Utility Colours (Mini Tailwind-like palette for scoped use) */
.text-500 { color: var(--text-color-secondary); }
.text-900 { color: var(--text-color); }

.text-blue-500 { color: #3b82f6; }
.bg-blue-100 { background-color: #dbeafe; }
.bg-blue-50 { background-color: #eff6ff; }
.text-blue-600 { color: #2563eb; }

.text-green-500 { color: #10b981; }
.text-green-600 { color: #059669; }
.bg-green-100 { background-color: #d1fae5; }
.bg-green-50 { background-color: #ecfdf5; }

.text-orange-500 { color: #f97316; }
.bg-orange-100 { background-color: #ffedd5; }

.text-purple-600 { color: #7c3aed; }
.bg-purple-50 { background-color: #f5f3ff; }

.text-teal-600 { color: #0d9488; }
.bg-teal-50 { background-color: #f0fdfa; }

.font-medium { font-weight: 500; }
.block { display: block; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-6 { margin-bottom: 3rem; }
</style>
