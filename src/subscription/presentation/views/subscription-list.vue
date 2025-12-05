<script setup>
import { ref, onMounted } from 'vue'
import { SubscriptionService } from '../../application/subscription.service.js'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import useAuthStore from '../../../iam/application/iam.store.js'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const service = new SubscriptionService()
const loading = ref(false)
const error = ref(null)
const items = ref([])

function fetchAll() {
  loading.value = true
  service.listAll()
      .then(list => { items.value = list })
      .catch(e => { error.value = e?.message || String(e) })
      .finally(() => { loading.value = false })
}

function removeItem(id) {
  if (!confirm(t('subscriptions.dialogs.deleteConfirm'))) return
  service.delete(id)
      .then(() => fetchAll())
      .catch(e => alert(e?.message || e))
}

onMounted(() => {
  if (!authStore.isSignedIn) {
    alert(t('auth.loginFirst'));
    router.push({ name: 'iam-sign-in' });
    return;
  }
  fetchAll()
})
</script>

<template>
  <div class="p-4">
    <div class="flex justify-content-between align-items-center mb-4">
      <h2 class="text-2xl font-bold m-0">{{ $t('subscriptions.title') }}</h2>
      <pv-button :label="$t('subscriptions.newSubscription')" icon="pi pi-plus" @click="router.push({ name: 'subscriptions.new' })" />
    </div>

    <div v-if="loading" class="text-center">
      <i class="pi pi-spin pi-spinner text-2xl"></i> {{ $t('subscriptions.loading') }}
    </div>
    
    <div v-else-if="error" class="error">
      <pv-message severity="error">{{ error }}</pv-message>
    </div>

    <pv-data-table 
      v-else 
      :value="items" 
      paginator 
      :rows="10" 
      striped-rows 
      class="p-datatable-sm shadow-2 border-round-md"
    >
      <pv-column field="id" :header="$t('subscriptions.headers.id')" sortable />
      <pv-column field="userId" :header="$t('subscriptions.headers.user')" sortable />
      <pv-column field="plan" :header="$t('subscriptions.headers.plan')" sortable>
        <template #body="slotProps">
          <pv-tag :value="slotProps.data.plan" :severity="slotProps.data.plan === 'PREMIUM' ? 'warning' : 'info'" />
        </template>
      </pv-column>
      <pv-column field="status" :header="$t('subscriptions.headers.status')">
        <template #body="slotProps">
          <pv-tag :value="slotProps.data.status" :severity="slotProps.data.status === 'ACTIVE' ? 'success' : 'danger'" />
        </template>
      </pv-column>
      <pv-column :header="$t('subscriptions.headers.startDate')">
        <template #body="slotProps">
          {{ new Date(slotProps.data.startDate).toLocaleDateString() }}
        </template>
      </pv-column>
      
      <pv-column :header="$t('common.actions')">
        <template #body="slotProps">
          <pv-button 
            icon="pi pi-pencil" 
            text 
            @click="router.push({ name: 'subscriptions.edit', params: { id: slotProps.data.id } })" 
          />
          <pv-button 
            icon="pi pi-trash" 
            text 
            severity="danger"
            @click="removeItem(slotProps.data.id)" 
          />
        </template>
      </pv-column>
    </pv-data-table>
  </div>
</template>

<style scoped>
/* PrimeFlex used */
</style>
