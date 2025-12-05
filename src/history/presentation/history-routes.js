const historyList = () => import('./views/history-list.vue');

/**
 * Routes related to inventory history.
 * Each route is associated with a specific view component and metadata.
 */
const historyRoutes = [
  { 
    path: 'laboratory/:labId/inventory/history', 
    name: 'inventory-history', 
    component: historyList, 
    meta: { title: 'Historial de Inventario' } 
  }
];

export default historyRoutes;