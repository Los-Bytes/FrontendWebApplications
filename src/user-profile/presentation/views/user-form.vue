<script setup>
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { ref, computed, onMounted } from "vue";
import useUserProfileStore from "../../application/user-profile.store.js";
import { User } from "../../domain/model/user.js";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useUserProfileStore();
const { addUser, updateUser, getUserById, fetchUsers, users } = store;

const isEdit = computed(() => !!route.params.id);

const form = ref({
  userName: '',
  fullName: '',
  email: '',
  phone: '',
  role: 'technician',
  organization: '',
  documentRegistration: 'DNI',
  imgToImage: 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg'
});

const roleOptions = [
  { label: 'Technician', value: 'technician' },
  { label: 'Researcher', value: 'researcher' },
  { label: 'Procurement Supervisor', value: 'procurement_supervisor' },
  { label: 'Inspector', value: 'inspector' }
];

const documentOptions = ['DNI', 'Passport', 'Foreign Card'];

onMounted(async () => {
  if (!users.value || users.value.length === 0) {
    await fetchUsers();
  }

  if (isEdit.value) {
    const user = getUserById(parseInt(route.params.id));
    if (user) {
      form.value = {
        userName: user.userName,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        organization: user.organization,
        documentRegistration: user.documentRegistration,
        imgToImage: user.imgToImage
      };
    } else {
      router.push({ name: 'user-profile-users' });
    }
  }
});

const saveUser = async () => {
  const newUser = new User({
    id: isEdit.value ? parseInt(route.params.id) : null,
    userName: form.value.userName,
    fullName: form.value.fullName,
    email: form.value.email,
    phone: form.value.phone,
    role: form.value.role,
    organization: form.value.organization,
    documentRegistration: form.value.documentRegistration,
    imgToImage: form.value.imgToImage
  });

  try {
    if (isEdit.value) {
      await updateUser(newUser);
    } else {
      await addUser(newUser);
    }
    
    router.push({ name: 'user-profile-users' });
  } catch (error) {
    console.error("Error saving user:", error);
  }
};
</script>

<template>
  <div class="p-4 form-container">
    <h1 class="text-2xl font-bold mb-4">
      {{ isEdit ? 'Edit User' : 'New User' }}
    </h1>

    <form @submit.prevent="saveUser" class="grid gap-4 max-w-xl">
      <div class="field">
        <label for="username">Username</label>
        <pv-input-text 
          id="username" 
          v-model="form.userName" 
          required 
          class="w-full"
          autocomplete="username"
        />
      </div>

      <div class="field">
        <label for="fullname">Full Name</label>
        <pv-input-text 
          id="fullname" 
          v-model="form.fullName" 
          required 
          class="w-full"
          autocomplete="name"
        />
      </div>

      <div class="field">
        <label for="email">Email</label>
        <pv-input-text 
          id="email" 
          v-model="form.email" 
          type="email" 
          required 
          class="w-full"
          autocomplete="email"
        />
      </div>

      <div class="field">
        <label for="phone">Phone</label>
        <pv-input-text 
          id="phone" 
          v-model="form.phone" 
          class="w-full"
          autocomplete="tel"
        />
      </div>

      <div class="field">
        <label id="role-label">Role</label>
        <pv-select 
          v-model="form.role" 
          :options="roleOptions"
          optionLabel="label"
          optionValue="value"
          class="w-full"
          aria-labelledby="role-label"
        />
      </div>

      <div class="field">
        <label for="organization">Organization</label>
        <pv-input-text 
          id="organization" 
          v-model="form.organization" 
          class="w-full"
          autocomplete="organization"
        />
      </div>

      <div class="field">
        <label id="document-label">Document Type</label>
        <pv-select 
          v-model="form.documentRegistration" 
          :options="documentOptions"
          class="w-full"
          aria-labelledby="document-label"
        />
      </div>

      <div class="field">
        <label for="image">Profile Image URL</label>
        <pv-input-text 
          id="image" 
          v-model="form.imgToImage" 
          class="w-full"
          autocomplete="url"
        />
      </div>

      <div class="flex gap-2">
        <pv-button type="submit" label="Save" icon="pi pi-save" />
        <pv-button 
          label="Cancel" 
          severity="secondary" 
          @click="router.push({ name: 'user-profile-users' })" 
        />
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  background: #51a2fd;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>