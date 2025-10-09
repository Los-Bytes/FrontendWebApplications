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
    InputText,
    Select,
    SelectButton,
    Toast, ToastService,
    Toolbar
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
    .component('pv-select', Select)
    .component('pv-data-table', DataTable)
    .component('pv-column', Column)
    .use(router)
    .use(pinia)
    .mount('#app')
