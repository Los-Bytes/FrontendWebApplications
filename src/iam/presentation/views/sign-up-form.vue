<script setup>
import useIamStore from "../../application/iam.store.js";
import {reactive} from "vue";
import {SignUpCommand} from "../../domain/sign-up.command.js";
import {useRouter} from "vue-router";

const router = useRouter();
const store = useIamStore();
const {signUp} = store;
const form = reactive({
  username: '',
  password: ''
})
/**
 * Performs the sign-up action by creating a SignUpCommand
 * with the provided username and password and then calling
 * the signUp method from the store.
 */
function performSignUp() {
  let signUpCommand = new SignUpCommand(form);
  signUp(signUpCommand, router);
}
</script>

<template>
  <div class="flex justify-content-center align-items-center min-h-screen surface-ground">
    <div class="surface-card p-4 shadow-2 border-round w-full lg:w-4">
      <div class="text-center mb-5">
        <h2 class="text-900 text-3xl font-medium mb-3">{{ $t('auth.signUp') }}</h2>
        <span class="text-600 font-medium line-height-3">{{ $t('auth.haveAccount') }}</span>
        <router-link to="/sign-in" class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">{{ $t('auth.signInAction') }}</router-link>
      </div>

      <form @submit.prevent="performSignUp">
        <div class="p-fluid">
          <div class="mb-4">
            <label for="username" class="block text-900 font-medium mb-2">{{ $t('auth.username') }}</label>
            <pv-input-text id="username" v-model="form.username" :class="{'p-invalid': !form.username && form.submitted}" required />
          </div>

          <div class="mb-4">
            <label for="password" class="block text-900 font-medium mb-2">{{ $t('auth.password') }}</label>
            <pv-input-text id="password" v-model="form.password" type="password" :class="{'p-invalid': !form.password && form.submitted}" required />
          </div>

          <pv-button type="submit" :label="$t('auth.signUp')" icon="pi pi-user-plus" class="w-full"></pv-button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles kept minimal as we use PrimeFlex utilities */
</style>