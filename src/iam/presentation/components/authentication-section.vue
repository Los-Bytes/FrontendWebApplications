<script setup>
import useIamStore from "../../application/iam.service.js";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useIamStore();
const { signOut } = store;

/**
 * Navigate to the sign-in page.
 */
function performSignIn() {
  router.push({ name: 'iam-sign-in' });
}

/**
 * Navigate to the sign-up page.
 */
function performSignUp() {
  router.push({ name: 'iam-sign-up' });
}

/**
 * Sign out the current user and navigate to the sign-in page.
 */
function performSignOut() {
  if (confirm('Are you sure you want to sign out?')) {
    signOut(router);
  }
}
</script>

<template>
  <div class="authentication-section">
    <div v-if="store.isSignedIn" class="authenticated-user">
      <div class="user-info">
        <img 
          v-if="store.currentUser?.imgToImage" 
          :src="store.currentUser.imgToImage" 
          :alt="store.currentUser.username"
          class="user-avatar"
        />
        <span class="welcome-text">{{ store.currentUser?.fullName || store.currentUsername }}</span>
      </div>
      <pv-button 
        label="Sign Out" 
        icon="pi pi-sign-out"
        severity="secondary"
        text
        @click="performSignOut"
      />
    </div>
    
    <div v-else class="guest-actions">
      <pv-button 
        label="Sign In" 
        icon="pi pi-sign-in"
        text
        @click="performSignIn"
      />
      <pv-button 
        label="Sign Up" 
        icon="pi pi-user-plus"
        severity="secondary"
        text
        @click="performSignUp"
      />
    </div>
  </div>
</template>

<style scoped>
.authentication-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.authenticated-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid var(--secondary-green);
  object-fit: cover;
}

.welcome-text {
  color: var(--text-on-dark);
  font-weight: 600;
  font-size: 0.95rem;
}

.guest-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

@media (max-width: 768px) {
  .welcome-text {
    display: none;
  }
  
  .user-avatar {
    width: 32px;
    height: 32px;
  }
}
</style>