const historyList = () => import('./views/history-list.vue');

const historyRoutes = [
  { 
    path: 'laboratory/:labId/inventory/history', 
    name: 'inventory-history', 
    component: historyList, 
    meta: { title: 'Historial de Inventario' } 
  }
];

export default historyRoutes;