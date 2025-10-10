<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SubscriptionService } from '../../application/subscription.service.js'

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

const loading = ref(false)
const error = ref(null)
const title = ref('Nueva Suscripción')

function loadIfEdit() {
  if (props.mode !== 'edit' || !props.id) return
  loading.value = true
  title.value = 'Editar Suscripción'
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
    startDate: new Date(form.value.startDate),
    trialEndDate: form.value.trialEndDate ? new Date(form.value.trialEndDate) : null
  }

  const op = props.mode === 'edit'
      ? service.update(payload)
      : service.create(payload)

  op.then(() => router.push({ name: 'subscriptions.list' }))
      .catch(e => { error.value = e?.message || String(e) })
      .finally(() => { loading.value = false })
}

onMounted(loadIfEdit)
watch(() => route.params.id, () => loadIfEdit())
</script>

<template>
  <section>
    <h2>{{ title }}</h2>
    <div v-if="loading">Cargando...</div>
    <div v-else>
      <div v-if="error" class="error">{{ error }}</div>

      <form @submit.prevent="save" class="form">
        <label>
          User ID
          <input v-model.number="form.userId" type="number" min="1" required />
        </label>

        <label>
          Plan
          <select v-model="form.plan">
            <option value="STANDARD">STANDARD</option>
            <option value="PREMIUM">PREMIUM</option>
          </select>
        </label>

        <label>
          Estado
          <select v-model="form.status">
            <option value="ACTIVE">ACTIVE</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </label>

        <label>
          Inicio
          <input v-model="form.startDate" type="datetime-local" />
        </label>

        <label>
          Fin de prueba
          <input v-model="form.trialEndDate" type="datetime-local" />
        </label>

        <div class="actions">
          <button type="submit">Guardar</button>
          <router-link :to="{ name: 'subscriptions.list' }">Cancelar</router-link>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
.form { display:grid; gap:10px; max-width:420px }
.actions { display:flex; gap:8px; margin-top:8px }
.error { color:#b00020 }
</style>
