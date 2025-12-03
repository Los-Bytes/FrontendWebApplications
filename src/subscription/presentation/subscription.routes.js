const subscriptionPlans = () => import('./views/subscription-plans.vue');
const mySubscription = () => import('./views/my-subscription.vue');

const subscriptionRoutes = [
  { 
    path: 'plans', 
    name: 'subscription-plans', 
    component: subscriptionPlans, 
    meta: { title: 'Planes de Suscripción' } 
  },
  { 
    path: 'my-subscription', 
    name: 'my-subscription', 
    component: mySubscription, 
    meta: { title: 'Mi Suscripción' } 
  }
];

export default subscriptionRoutes;