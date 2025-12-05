const inventoryForm = () => import('./views/inventory-form.vue');
const inventoryList = () => import('./views/inventory-list.vue');

/**
 * Routes related to inventory management.
 * Each route is associated with a specific view component and metadata.
 */
const inventoryRoutes = [
  { 
    path: 'laboratory/:labId/inventory', 
    name: 'inventory-list', 
    component: inventoryList, 
    meta: { title: 'Inventario' } 
  },
  { 
    path: 'laboratory/:labId/inventory/new', 
    name: 'inventory-new', 
    component: inventoryForm, 
    meta: { title: 'Nuevo Ítem' } 
  },
  { 
    path: 'laboratory/:labId/inventory/:id/edit', 
    name: 'inventory-edit', 
    component: inventoryForm, 
    meta: { title: 'Editar Ítem' } 
  }
];

export default inventoryRoutes;