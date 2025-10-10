<script setup>

import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import {useConfirm} from "primevue";
import useProductProfileStore from "../../application/product.store.js";
import {onMounted} from "vue";


const {t}=useI18n();
const router = useRouter();
const confirm = useConfirm();
const store = useProductProfileStore();
const {products, productsLoaded, errors, fetchProducts, deleteProduct}=store;

onMounted(()=>{
  if (!productsLoaded) fetchProducts();
  console.log(products);
});

const navigateToNew = () => {
  router.push({name:'product-product-new'});
}

const navigateEdit = (id) => {
  console.log(id);
  router.push({name:'product-product-edit', params: {id} });
};

const confirmDelete = (product) => {
  confirm.require({
    message: 'Are you sure you want to delete this user?',
    header: 'Are you sure you want to delete this user?',
    icon: 'pi pi-exclamation-triangle',
    accept: () => { deleteProduct(product); },
  });
};

</script>

<template>
  <div class="p-4 products-page">
    <h1>Users</h1>

    <div class="actions-row mb-3">
      <pv-button label="New Product" icon="pi pi-plus" @click="navigateToNew" />
    </div>

    <pv-data-table
        :value="products"
        :loading="!productsLoaded"
        striped-rows
        table-style="min-width: 50rem"
        paginator
        :rows="8"
        :rows-per-page-options="[5,8,10,20]"
        class="products-table"
    >
      <pv-column field="id" header="ID" sortable />
      <pv-column field="name" header="Product Name" sortable />
      <pv-column field="description" header="Description" />
      <pv-column field="category" header="Category" />
      <pv-column field="mesurementUnit" header="Mesurement Unit" />
      <pv-column field="unitPrice" header="Unit Price" />
      <pv-column field="expirationDate" header="Expiration Date" />
      <pv-column header="Actions" style="width: 140px;">
        <template #body="slotProps">
          <pv-button
              icon="pi pi-pencil"
              text
              rounded
              @click="navigateEdit(slotProps.data.id)"
              title="Edit"
          />
          <pv-button
              icon="pi pi-trash"
              text
              rounded
              severity="danger"
              @click="confirmDelete(slotProps.data)"
              title="Delete"
          />
        </template>
      </pv-column>
    </pv-data-table>

    <div v-if="errors && errors.length" class="errors mt-3">
      <strong>Errors occurred:</strong>
      <ul>
        <li v-for="(e, idx) in errors" :key="idx">{{ e.message || e }}</li>
      </ul>
    </div>

    <pv-confirm-dialog />
  </div>

</template>

<style scoped>


</style>
