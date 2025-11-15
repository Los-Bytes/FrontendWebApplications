import { createApp } from 'vue'
import './style.css'
import App from './app.vue'
import PrimeVue from 'primevue/config';
import Material from '@primeuix/themes/material';
import i18n from "./i18n.js";
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import {
    Button,
    Column, ConfirmationService,
    ConfirmDialog,
    DataTable, DialogService,
    Drawer,
<<<<<<< HEAD
    InputNumber,
    InputText,
    Select,
    SelectButton,
    Textarea,
    Toast, ToastService,
    Toolbar, Tag,
    Dialog
=======
    InputText,
    Select,
    SelectButton,
    Toast, ToastService,
    Toolbar
>>>>>>> 4cec12b904a58bf8a1743d6fb119e7a55d431a38
} from "primevue";
import router from "./router.js";
import pinia from "./pinia.js";

// noinspection JSCheckFunctionSignatures
createApp(App)
    .use(i18n)
    .use(PrimeVue, {theme: {preset:Material}, ripple:true})
    .use(ConfirmationService)
    .use(DialogService)
    .use(ToastService)
    .component('pv-select-button', SelectButton)
    .component('pv-toast', Toast)
    .component('pv-confirm-dialog', ConfirmDialog)
    .component('pv-button', Button)
    .component('pv-drawer', Drawer)
    .component('pv-toolbar', Toolbar)
    .component('pv-input-text', InputText)
    .component('pv-input-number', InputNumber)
    .component('pv-textarea', Textarea)
    .component('pv-select', Select)
    .component('pv-data-table', DataTable)
    .component('pv-column', Column)
    .component('pv-tag', Tag)
    .component('pv-dialog', Dialog)
    .use(router)
    .use(pinia)
    .mount('#app')

import useAuthStore from '../src/iam/application/auth.store.js';
const authStore = useAuthStore();
authStore.loadUserFromStorage();
