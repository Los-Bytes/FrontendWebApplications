const subscriptionPlans = () => import('./views/subscription-plans.vue');
const mySubscription = () => import('./views/my-subscription.vue');

/**
 * Routes for Subscription module.
 * Includes routes for viewing subscription plans and managing the user's subscription.
 * Each route is associated with a specific component and metadata for titles.
 * The titles are provided in Both Languages.
 */
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