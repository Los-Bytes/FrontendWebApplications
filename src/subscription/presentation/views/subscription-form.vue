<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { SubscriptionService } from '../../application/subscription.service.js'

const { t } = useI18n()
const props = defineProps({
  mode: { type: String, default: 'create' },
  id: { type: Number, default: null }
})

const route = useRoute()
const router = useRouter()
const service = new SubscriptionService()

const form = ref({
  userId: 1,
  plan: 'STANDARD',
  status: 'ACTIVE',
  startDate: new Date(),
  trialEndDate: null
})

// Options for dropdowns
const plans = ref(['STANDARD', 'PREMIUM'])
const statuses = ref(['ACTIVE', 'CANCELLED'])

const loading = ref(false)
const error = ref(null)

// Dynamic title based on mode
const title = ref(t('subscriptions.form.titleNew'))

function updateTitle() {
  title.value = props.mode === 'edit' 
    ? t('subscriptions.form.titleEdit') 
    : t('subscriptions.form.titleNew')
}

// Watch for language changes if needed, or re-compute. 
// For simplicity, just updating on load/mode change.

function loadIfEdit() {
  updateTitle()
  if (props.mode !== 'edit' || !props.id) return
  loading.value = true
  
  service.getById(props.id)
      .then(s => {
        if (!s) throw new Error('No encontrada')
        form.value = {
          id: s.id,
          userId: s.userId,
          plan: s.plan,
          status: s.status,
          startDate: new Date(s.startDate),
          trialEndDate: s.trialEndDate ? new Date(s.trialEndDate) : null
        }
      })
      .catch(e => { error.value = e?.message || String(e) })
      .finally(() => { loading.value = false })
}

function save() {
  loading.value = true
  const payload = {
    ...form.value,
    // Ensure Date objects are properly serializable/formatted if needed, 
    // but typically JSON.stringify handles Dates as ISO strings which is good.
  }

  const op = props.mode === 'edit'
      ? service.update(payload)
      : service.create(payload)

  op.then(() => router.push({ name: 'subscriptions.list' }))
      .catch(e => { error.value = e?.message || String(e) })
      .finally(() => { loading.value = false })
}

function cancel() {
  router.push({ name: 'subscriptions.list' })
}

onMounted(loadIfEdit)
watch(() => route.params.id, () => loadIfEdit())
</script>

<template>
  <div class="flex justify-content-center align-items-center min-h-screen surface-ground p-4">
    <pv-card class="w-full md:w-8 lg:w-6 shadow-2">
      <template #title>
        <div class="text-center text-primary font-bold">
          {{ title }}
        </div>
      </template>
      <template #content>
        <div v-if="loading" class="text-center">
          <i class="pi pi-spin pi-spinner text-4xl"></i>
          <p>{{ $t('subscriptions.form.loading') }}</p>
        </div>
        
        <div v-else>
          <div v-if="error" class="mb-4">
            <pv-message severity="error">{{ error }}</pv-message>
          </div>

          <form @submit.prevent="save" class="p-fluid grid formgrid">
            
            <!-- User ID -->
            <div class="field col-12 md:col-6">
              <label for="userId" class="font-bold">{{ $t('subscriptions.form.userId') }}</label>
              <pv-input-number id="userId" v-model="form.userId" :min="1" required showButtons buttonLayout="horizontal" inputClass="text-center" />
            </div>

            <!-- Plan -->
            <div class="field col-12 md:col-6">
              <label for="plan" class="font-bold">{{ $t('subscriptions.form.plan') }}</label>
              <pv-dropdown id="plan" v-model="form.plan" :options="plans" :placeholder="$t('subscriptions.form.selectPlan')" class="w-full" />
            </div>

            <!-- Status -->
            <div class="field col-12 md:col-6">
              <label for="status" class="font-bold">{{ $t('subscriptions.form.status') }}</label>
              <pv-dropdown id="status" v-model="form.status" :options="statuses" :placeholder="$t('subscriptions.form.selectStatus')" class="w-full" />
            </div>

            <!-- Start Date -->
            <div class="field col-12 md:col-6">
              <label for="startDate" class="font-bold">{{ $t('subscriptions.form.startDate') }}</label>
              <pv-calendar id="startDate" v-model="form.startDate" showIcon showTime dateFormat="dd/mm/yy" />
            </div>

            <!-- Trial End Date -->
            <div class="field col-12">
              <label for="trialEndDate" class="font-bold">{{ $t('subscriptions.form.trialEndDate') }}</label>
              <pv-calendar id="trialEndDate" v-model="form.trialEndDate" showIcon showTime dateFormat="dd/mm/yy" showButtonBar />
            </div>

            <!-- Buttons -->
            <div class="col-12 mt-4 flex justify-content-end gap-2">
              <pv-button :label="$t('subscriptions.form.cancel')" icon="pi pi-times" severity="secondary" @click="cancel" text />
              <pv-button :label="$t('subscriptions.form.save')" icon="pi pi-check" type="submit" />
            </div>

          </form>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>
/* PrimeFlex handles strict layout needs */
</style>
