const inventoryForm = () => import('./views/inventory-form.vue');
const inventoryList = () => import('./views/inventory-list.vue');
const inventoryHistory = () => import('./views/inventory-history.vue');

const inventoryRoutes = [
  { path: 'inventory', name: 'inventory-list', component: inventoryList, meta: { title: 'Inventario' } },
  { path: 'inventory/new', name: 'inventory-new', component: inventoryForm, meta: { title: 'Nuevo Ítem' } },
  { path: 'inventory/history', name: 'inventory-history', component: inventoryHistory, meta: { title: 'Historial' } }
];

export default inventoryRoutes;
