import { defineStore } from "pinia";
import { ref, computed } from "vue";

const useAuthStore = defineStore("authStore", () => {
  const currentUser = ref(null);
  const isAuthenticated = computed(() => currentUser.value !== null);

  function login(user) {
    currentUser.value = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  function logout() {
    currentUser.value = null;
    localStorage.removeItem('currentUser');
  }

  function loadUserFromStorage() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      currentUser.value = JSON.parse(savedUser);
    }
  }

  return {
    currentUser,
    isAuthenticated,
    login,
    logout,
    loadUserFromStorage
  };
});

export default useAuthStore;