<script setup>
import { ref, onMounted } from 'vue'
import { SubscriptionService } from '../../application/subscription.service.js'

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
  if (!confirm('¿Eliminar suscripción?')) return
  service.delete(id)
      .then(() => fetchAll())
      .catch(e => alert(e?.message || e))
}

onMounted(fetchAll)
</script>

<template>
  <section>
    <header class="header">
      <h2>Suscripciones</h2>
      <router-link class="btn" :to="{ name: 'subscriptions.new' }">Nueva</router-link>
    </header>

    <div v-if="loading">Cargando...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <table v-else class="table">
      <thead>
      <tr>
        <th>ID</th>
        <th>User</th>
        <th>Plan</th>
        <th>Status</th>
        <th>Inicio</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="s in items" :key="s.id">
        <td>{{ s.id }}</td>
        <td>{{ s.userId }}</td>
        <td>{{ s.plan }}</td>
        <td>{{ s.status }}</td>
        <td>{{ new Date(s.startDate).toLocaleString() }}</td>
        <td class="actions">
          <router-link :to="{ name: 'subscriptions.edit', params: { id: s.id } }">Editar</router-link>
          <button @click="removeItem(s.id)">Eliminar</button>
        </td>
      </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
.header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px }
.table { width:100%; border-collapse:collapse }
.table th, .table td { border:1px solid #eee; padding:8px }
.actions { display:flex; gap:8px }
.error { color:#b00020 }
.btn { background:#2a6cff; color:#fff; padding:6px 10px; border-radius:6px; text-decoration:none }
</style>
