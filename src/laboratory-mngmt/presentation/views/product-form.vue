<script setup>

import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import {useConfirm} from "primevue";
import useProductStore from "../../application/product.store.js";
import {computed, onMounted, ref} from "vue";
import {Product} from "../../domain/model/product.js";
import {User} from "../../../user-profile/domain/model/user.js";


const {t} =useI18n();
const route= useRoute();
const router = useRouter();
const store = useProductStore();
const {errors, products, addProduct, updateProduct, fetchProducts}=store;

const form= ref({name:'',description:'',category:'', mesurementUnit:'',unitPrice:'',expirationDate:'',batch:''});
const isEdit = computed(()=>!!route.params.id);

const categoryOptions = [
  { label: "Liquido", value: "liquido" },
  { label: "Solido", value: "solido" },
  { label: "Gaseoso", value: "gaseoso" },
  { label: "Plasma", value: "Plasma" },
  { label: "Polvo", value: "polvo" }
];

onMounted(()=>{
  if (!products.length) fetchProducts();
  if (isEdit.value){
    const product =getProductById(route.params.id);
    if(product){
      form.value.name=product.name;
      form.value.description=product.description;
      form.value.category=product.category;
      form.value.mesurementUnit=product.mesurementUnit;
      form.value.unitPrice=product.unitPrice;
      form.value.expirationDate=product.expirationDate;
      form.value.batch=product.batch;
    } else router.push({name:'product-products'});
  }
});

function getProductById(id){
  return store.getProductById(id);
}

const saveProduct = ()=>{
  const product = new Product({
    id: isEdit.value ? route.params.id : null,
    name: form.value.name,
    description: form.value.description,
    category: form.value.category,
    mesurementUnit: form.value.mesurementUnit,
    unitPrice: form.value.unitPrice,
    expirationDate: form.value.expirationDate,
    batch: form.value.batch
  });
  if(isEdit.value) updateProduct(product); else addProduct(product);
  navigateBack();
};

const navigateBack = () =>{
  router.push({name:'product-products'});
}

</script>

<template>

  <div class="p-4 product-form">
    <h1 class="form-title">
      {{ isEdit ? "Edit Product" : "New Product" }}
    </h1>

    <form @submit.prevent="saveProduct" class="form-grid">
      <div class="field">
        <label for="name">Name</label>
        <pv-input-text id="name" v-model="form.name" required class="w-full" />
      </div>

      <div class="field">
        <label for="description">Description</label>
        <pv-input-text id="description" v-model="form.description" required class="w-full" />
      </div>

      <div class="field">
        <label for="Category">Category</label>
        <pv-select
            id="category"
            v-model="form.category"
            :options="categoryOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Category"
            class="w-full"
        />
      </div>

      <div class="field">
        <label for="mesurementUnit">Mesurement Unit</label>
        <pv-input-text id="mesurementUnit" v-model="form.mesurementUnit" />
      </div>

      <div class="field">
        <label for="unitPrice">Unit Price</label>
        <pv-input-text id="unitPrice" v-model="form.unitPrice" class="w-full" />
      </div>

      <div class="field">
        <label for="expirationDate">Expiration Date</label>
        <pv-input-text id="expirationDate" v-model="form.expirationDate" class="w-full" />
      </div>

      <div class="field">
        <label for="batch">Batch</label>
        <pv-input-text id="batch" v-model="form.batch" class="w-full" />
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