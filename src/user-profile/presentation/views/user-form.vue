<script setup>
import {useI18n} from "vue-i18n";
import {useRoute, useRouter} from "vue-router";
import useUserProfileStore from "../../application/user-profile.store.js";
import {computed, onMounted, ref} from "vue";
import {User} from "../../domain/model/user.js";

const {t} =useI18n();
const route= useRoute();
const router = useRouter();
const store = useUserProfileStore();
const {errors, users, addUser, updateUser, fetchUsers}=store;

const form= ref({userName:'',fullName:'',email:'', phone:'',role:'',organization:'',documentRegistration:'',imgToImage:''});
const isEdit = computed(()=>!!route.params.id);

const rolesOptions = [
  { label: "Lab Manager", value: "lab_manager" },
  { label: "Researcher", value: "researcher" },
  { label: "Technician", value: "technician" },
  { label: "Procurement Supervisor", value: "procurement_supervisor" },
  { label: "Inspector", value: "inspector" },
  { label: "Admin", value: "admin" }
];

onMounted(()=>{
  if (!users.length) fetchUsers();
  if (isEdit.value){
    const user =getUserById(route.params.id);
    if(user){
      form.value.userName=user.userName;
      form.value.fullName=user.fullName;
      form.value.email=user.email;
      form.value.phone=user.phone;
      form.value.role=user.role;
      form.value.organization=user.organization;
      form.value.documentRegistration=user.documentRegistration;
      form.value.imgToImage=user.imgToImage;
    } else router.push({name:'user-profile-users'});
  }
});

function getUserById(id){
  return store.getUserById(id);
}

const saveUser = ()=>{
  const user = new User({
    id: isEdit.value ? route.params.id : null,
    userName: form.value.userName,
    fullName: form.value.fullName,
    email: form.value.email,
    phone: form.value.phone,
    role: form.value.role,
    organization: form.value.organization,
    documentRegistration: form.value.documentRegistration,
    imgToImage: form.value.imgToImage,
  });
  if(isEdit.value) updateUser(user); else addUser(user);
  navigateBack();
};

const navigateBack = () =>{
  router.push({name:'user-profile-users'});
}

</script>

<template>

  <div class="p-4 user-form">
    <h1 class="form-title">
      {{ isEdit ? "Edit User" : "New User" }}
    </h1>

    <form @submit.prevent="saveUser" class="form-grid">
      <div class="field">
        <label for="username">Username</label>
        <pv-input-text id="username" v-model="form.userName" required class="w-full" />
      </div>

      <div class="field">
        <label for="fullName">Full Name</label>
        <pv-input-text id="fullName" v-model="form.fullName" required class="w-full" />
      </div>

      <div class="field">
        <label for="email">Email</label>
        <pv-input-text id="email" v-model="form.email" type="email" required class="w-full" />
      </div>

      <div class="field">
        <label for="phone">Phone</label>
        <pv-input-text id="phone" v-model="form.phone" class="w-full" />
      </div>

      <div class="field">
        <label for="role">Role</label>
        <pv-select
            id="role"
            v-model="form.role"
            :options="rolesOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select role"
            class="w-full"
        />
      </div>

      <div class="field">
        <label for="organization">Organization</label>
        <pv-input-text id="organization" v-model="form.organization" class="w-full" />
      </div>

      <div class="field">
        <label for="documentRegistration">Document Registration</label>
        <pv-input-text id="documentRegistration" v-model="form.documentRegistration" class="w-full" />
      </div>

      <!-- Avatar -->
      <div class="field file-field">
        <label for="avatar">Avatar</label>
        <input id="avatar" type="file" accept="image/*" @change="handleFileChange" />
        <div v-if="form.imgToImage" class="image-preview">
          <img :src="form.imgToImage" alt="avatar preview" />
          <pv-button label="Remove" class="remove-btn" severity="secondary" @click="clearImage" />
        </div>
      </div>

      <!-- Actions -->
      <div class="field actions">
        <pv-button type="submit" label="Save" icon="pi pi-save" />
        <pv-button label="Cancel" severity="secondary" class="ml-2" @click="navigateBack" />
      </div>
    </form>

    <div v-if="errors && errors.length" class="errors mt-3">
      <strong>Errors occurred:</strong>
      <ul>
        <li v-for="(e, idx) in errors" :key="idx">{{ e.message || e }}</li>
      </ul>
    </div>
  </div>

</template>

<style scoped>

</style>