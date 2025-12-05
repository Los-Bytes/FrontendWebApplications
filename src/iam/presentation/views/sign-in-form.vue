<script setup>
import useIamStore from "../../application/iam.service.js";
import { reactive, ref } from "vue";
import { SignInCommand } from "../../domain/sign-in.command.js";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const store = useIamStore();
const { signIn } = store;
const isLoading = ref(false);

const form = reactive({
  username: '',
  password: ''
});

/**
 * Performs the sign-in action by creating a SignInCommand
 * with the provided username and password, and then calling
 * the signIn method from the store.
 */
async function performSignIn() {
  if (!form.username || !form.password) {
    alert('Please fill in all fields');
    return;
  }

  isLoading.value = true;
  
  try {
    console.log('📝 Form data:', form);
    const signInCommand = new SignInCommand(form);
    console.log('📦 SignInCommand:', signInCommand);
    await signIn(signInCommand, router);
  } catch (error) {
    console.error('Sign-in error:', error);
  } finally {
    isLoading.value = false;
  }
}
/**
 * Navigates to the sign-up page.
 */
function navigateToSignUp() {
  router.push({ name: 'iam-sign-up' });
}
</script>

<template>
  <div class="sign-in-container">
    <div class="sign-in-card">
      <div class="card-header">
        <img src="/logo-lab.png" alt="LabIoT Logo" class="logo" />
        <h2 class="title">{{ t('loggin.title') }}</h2>
        <p class="subtitle">{{ t('loggin.subtitle') }}</p>
      </div>

      <form @submit.prevent="performSignIn" class="sign-in-form">
        <div class="form-field">
          <label for="username" class="field-label">{{ t('loggin.username') }}</label>
          <pv-input-text 
            id="username" 
            v-model="form.username" 
            :class="{'p-invalid': !form.username}"
            :placeholder="t('loggin.enter-name')"
            class="w-full"
            :disabled="isLoading"
          />
          <small v-if="!form.username" class="p-error">{{ t('loggin.user-error') }}</small>
        </div>

        <div class="form-field">
          <label for="password" class="field-label">{{ t('loggin.password') }}</label>
          <pv-input-text 
            id="password" 
            v-model="form.password" 
            :class="{'p-invalid': !form.password}" 
            type="password"
            :placeholder="t('loggin.enter-pass')"
            class="w-full"
            :disabled="isLoading"
          />
          <small v-if="!form.password" class="p-error">{{ t('loggin.pass-error') }}</small>
        </div>

        <pv-button 
          type="submit" 
          :label="t('loggin.sign-in')"
          icon="pi pi-sign-in"
          class="w-full sign-in-button"
          :loading="isLoading"
        />

        <div class="divider">
          <span>{{ t('loggin.divider') }}</span>
        </div>

        <pv-button 
          type="button"
          :label="t('loggin.create-account')"
          icon="pi pi-user-plus"
          severity="secondary"
          outlined
          class="w-full"
          @click="navigateToSignUp"
          :disabled="isLoading"
        />
      </form>

      <div class="card-footer">
        <small class="text-gray-600">
          {{ t('loggin.copyright') }}
        </small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sign-in-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 140px);
  padding: 2rem 1rem;
}

.sign-in-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  padding: 3rem;
  max-width: 450px;
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

.sign-in-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

.sign-in-button {
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
  .sign-in-card {
    padding: 2rem 1.5rem;
  }

  .title {
    font-size: 1.5rem;
  }
}
</style>