<script setup>
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { ref, computed, onMounted } from "vue";
import useUserProfileStore from "../../application/user-profile.service.js";
import { User } from "../../domain/model/user.entity.js";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useUserProfileStore();
const { addUser, updateUser, getUserById, fetchUsers, users } = store;

/**
 * Computed property to determine if the form is in edit mode
 * based on the presence of an 'id' parameter in the route.
 * If 'id' exists, the form is in edit mode; otherwise, it's for creating a new user.
 * Returns a boolean value.
 * @returns {boolean} True if editing an existing user, false if creating a new user.
 */
const isEdit = computed(() => !!route.params.id);

/**
 * Reactive form object to hold user data.
 * Includes fields for username, full name, email, phone, role,
 * organization, document registration type, and image URL.
 * Initialized with default values.
 */
const form = ref({
  username: '',
  fullName: '',
  email: '',
  phone: '',
  role: 'technician',
  organization: '',
  documentRegistration: 'DNI',
  imgToImage: 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg'
});

/**
 * Computed property for role options in the user form.
 * Each option includes a label (localized) and a corresponding value.
 * Returns an array of role option objects.
 * @returns {Array<{label: string, value: string}>} Array of role options for the select input.
 */
const roleOptions = computed(() => [
  { label: t('user-profile.technician'), value: 'technician' },
  { label: t('user-profile.researcher'), value: 'researcher' },
  { label: t('user-profile.procurement'), value: 'procurement_supervisor' },
  { label: t('user-profile.inspector'), value: 'inspector' }
]);

/**
 * Computed property for document type options in the user form.
 * Returns an array of document type strings, including localized options.
 * @returns {Array<string>} Array of document type options for the select input.
 */
const documentOptions = computed(() => ['DNI', t('user-profile.passport'), t('user-profile.foreign-card')]);

/**
 * Lifecycle hook to perform actions on component mount:
 * - Fetch users if not already loaded.
 * - If in edit mode, retrieve the user by ID from route params
 *  and populate the form with existing user data.
 *  If the user is not found, redirect to the users list page.
 * Handles both creating new users and editing existing ones.
 * @returns {Promise<void>}
 */
onMounted(async () => {
  if (!users.value || users.value.length === 0) {
    await fetchUsers();
  }

  if (isEdit.value) {
    const user = getUserById(parseInt(route.params.id));
    if (user) {
      form.value = {
        username: user.username,
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
/**
 * Function to save the user form data.
 * Creates a new user or updates an existing one based on the form data.
 * After saving, redirects to the users list page.
 * Handles errors during the save process.
 * @returns {Promise<void>}
 */
const saveUser = async () => {
  const newUser = new User({
    id: isEdit.value ? parseInt(route.params.id) : null,
    username: form.value.username,
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
      {{ isEdit ? t('user-profile.edit-user') : t('user-profile.new-user') }}
    </h1>

    <form @submit.prevent="saveUser" class="grid gap-4 max-w-xl">
      <div class="field">
        <label for="username">{{ t('user-profile.username') }}</label>
        <pv-input-text 
          id="username" 
          v-model="form.username" 
          required 
          class="w-full"
          autocomplete="username"
        />
      </div>

      <div class="field">
        <label for="fullname">{{ t('user-profile.fullname') }}</label>
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
        <label for="phone">{{ t('user-profile.phone') }}</label>
        <pv-input-text 
          id="phone" 
          v-model="form.phone" 
          class="w-full"
          autocomplete="tel"
        />
      </div>

      <div class="field">
        <label id="role-label">{{ t('user-profile.role') }}</label>
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
        <label for="organization">{{ t('user-profile.organization') }}</label>
        <pv-input-text 
          id="organization" 
          v-model="form.organization" 
          class="w-full"
          autocomplete="organization"
        />
      </div>

      <div class="field">
        <label id="document-label">{{ t('user-profile.document') }}</label>
        <pv-select 
          v-model="form.documentRegistration" 
          :options="documentOptions"
          class="w-full"
          aria-labelledby="document-label"
        />
      </div>

      <div class="field">
        <label for="image">{{ t('user-profile.image') }}</label>
        <pv-input-text 
          id="image" 
          v-model="form.imgToImage" 
          class="w-full"
          autocomplete="url"
        />
      </div>

      <div class="flex gap-2">
        <pv-button type="submit" :label="t('user-profile.save')" icon="pi pi-save" />
        <pv-button 
          :label="t('user-profile.cancel')" 
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