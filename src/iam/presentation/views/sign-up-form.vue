
<script setup>
import useIamStore from "../../application/iam.service.js";
import { reactive, ref } from "vue";
import { SignUpCommand } from "../../domain/sign-up.command.js";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const store = useIamStore();
const { signUp } = store;
const isLoading = ref(false);

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  fullName: '',
  email: '',
  phone: '',
  role: 'technician',
  organization: ''
});

const roleOptions = [
  { label: 'Technician', value: 'technician' },
  { label: 'Researcher', value: 'researcher' },
  { label: 'Procurement Supervisor', value: 'procurement_supervisor' },
  { label: 'Inspector', value: 'inspector' }
];

/**
 * Performs the sign-up action by creating a SignUpCommand
 * with the provided information and then calling the signUp method.
 */
async function performSignUp() {
  // Validations
  if (!form.username || !form.password || !form.fullName || !form.email) {
    alert('Please fill in all required fields');
    return;
  }

  if (form.password !== form.confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  if (form.password.length < 6) {
    alert('Password must be at least 6 characters long');
    return;
  }

  isLoading.value = true;

  try {
    const signUpCommand = new SignUpCommand({
      username: form.username,
      password: form.password,
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      role: form.role,
      organization: form.organization
    });
    
    await signUp(signUpCommand, router);
  } catch (error) {
    console.error('Sign-up error:', error);
  } finally {
    isLoading.value = false;
  }
}

function navigateToSignIn() {
  router.push({ name: 'iam-sign-in' });
}
</script>

<template>
  <div class="sign-up-container">
    <div class="sign-up-card">
      <div class="card-header">
        <img src="/logo-lab.png" alt="LabIoT Logo" class="logo" />
        <h2 class="title">{{ t('signup.title') }}</h2>
        <p class="subtitle">{{ t('signup.subtitle') }}</p>
      </div>

      <form @submit.prevent="performSignUp" class="sign-up-form">
        <div class="form-row">
          <div class="form-field">
            <label for="username" class="field-label">{{ t('signup.username') }}</label>
            <pv-input-text 
              id="username" 
              v-model="form.username" 
              :class="{'p-invalid': !form.username}"
              placeholder="Choose a username"
              class="w-full"
              :disabled="isLoading"
            />
            <small v-if="!form.username" class="p-error">{{ t('signup.user-error') }}</small>
          </div>

          <div class="form-field">
            <label for="fullName" class="field-label">{{ t('signup.fullname') }}</label>
            <pv-input-text 
              id="fullName" 
              v-model="form.fullName" 
              :class="{'p-invalid': !form.fullName}"
              placeholder="Your full name"
              class="w-full"
              :disabled="isLoading"
            />
            <small v-if="!form.fullName" class="p-error">{{ t('signup.full-error') }}</small>
          </div>
        </div>

        <div class="form-field">
          <label for="email" class="field-label">{{ t('signup.email') }}</label>
          <pv-input-text 
            id="email" 
            v-model="form.email" 
            type="email"
            :class="{'p-invalid': !form.email}"
            placeholder="your.email@example.com"
            class="w-full"
            :disabled="isLoading"
          />
          <small v-if="!form.email" class="p-error">{{ t('signup.email-error') }}</small>
        </div>

        <div class="form-row">
          <div class="form-field">
            <label for="phone" class="field-label">{{ t('signup.phone') }}</label>
            <pv-input-text 
              id="phone" 
              v-model="form.phone" 
              placeholder="+51 999 999 999"
              class="w-full"
              :disabled="isLoading"
            />
          </div>

          <div class="form-field">
            <label for="role" class="field-label">{{ t('signup.role') }}</label>
            <pv-select 
              id="role"
              v-model="form.role" 
              :options="roleOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full"
              :disabled="isLoading"
            />
          </div>
        </div>

        <div class="form-field">
          <label for="organization" class="field-label">{{ t('signup.organization') }}</label>
          <pv-input-text 
            id="organization" 
            v-model="form.organization" 
            placeholder="Your organization name"
            class="w-full"
            :disabled="isLoading"
          />
        </div>

        <div class="form-row">
          <div class="form-field">
            <label for="password" class="field-label">{{ t('signup.password') }}</label>
            <pv-input-text 
              id="password" 
              v-model="form.password" 
              type="password"
              :class="{'p-invalid': !form.password}"
              placeholder="Min. 6 characters"
              class="w-full"
              :disabled="isLoading"
            />
            <small v-if="!form.password" class="p-error">{{ t('signup.pass-error') }}</small>
          </div>

          <div class="form-field">
            <label for="confirmPassword" class="field-label">{{ t('signup.confirm-password') }}</label>
            <pv-input-text 
              id="confirmPassword" 
              v-model="form.confirmPassword" 
              type="password"
              :class="{'p-invalid': form.password && form.password !== form.confirmPassword}"
              placeholder="Re-enter password"
              class="w-full"
              :disabled="isLoading"
            />
            <small v-if="form.password && form.password !== form.confirmPassword" class="p-error">
              {{ t('signup.not-match') }}
            </small>
          </div>
        </div>

        <pv-button 
          type="submit" 
          label="Create Account" 
          icon="pi pi-user-plus"
          class="w-full sign-up-button"
          :loading="isLoading"
        />

        <div class="divider">
          <span>{{ t('signup.divider') }}</span>
        </div>

        <pv-button 
          type="button"
          label="Sign In" 
          icon="pi pi-sign-in"
          severity="secondary"
          outlined
          class="w-full"
          @click="navigateToSignIn"
          :disabled="isLoading"
        />
      </form>

      <div class="card-footer">
        <small class="text-gray-600">
          {{ t('signup.copyright') }}
        </small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sign-up-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 140px);
  padding: 2rem 1rem;
}

.sign-up-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  padding: 3rem;
  max-width: 650px;
  width: 100%;
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 80px;
  height: auto;
  margin-bottom: 1rem;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #004AAD;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 1rem;
}

.sign-up-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.sign-up-button {
  margin-top: 0.5rem;
  padding: 0.75rem;
  font-size: 1.05rem;
  font-weight: 600;
}

.divider {
  text-align: center;
  margin: 0.5rem 0;
  color: #999;
  font-size: 0.9rem;
}

.card-footer {
  margin-top: 2rem;
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

@media (max-width: 768px) {
  .sign-up-card {
    padding: 2rem 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .title {
    font-size: 1.5rem;
  }
}
</style>