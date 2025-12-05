import Home from "./shared/presentation/views/home.vue";
import { createRouter, createWebHistory } from "vue-router";
import userProfileRoutes from "./user-profile/presentation/user-profile-routes.js";
import subscriptionRoutes from "./subscription/presentation/subscription.routes.js";
import laboratoryRoutes from "./laboratory/presentation/laboratoryMngmt-routes.js";
import inventoryRoutes from "./inventory/presentation/inventory-routes.js";
import historyRoutes from './history/presentation/history-routes.js';

const about = () => import('./shared/presentation/views/about.vue');
const pageNotFound = () => import('./shared/presentation/views/page-not-found.vue');


import SignIn from "./iam/presentation/views/sign-in-form.vue";
import SignUp from "./iam/presentation/views/sign-up-form.vue";

const routes = [
    { path: '/home', name: 'home', component: Home, meta: { title: 'Home' } },
    { path: '/about', name: 'about', component: about, meta: { title: 'About' } },
    { path: '/sign-in', name: 'iam-sign-in', component: SignIn, meta: { title: 'Sign In' } },
    { path: '/sign-up', name: 'iam-sign-up', component: SignUp, meta: { title: 'Sign Up' } },
    { path: '/user-profile', name: 'user-profile', children: userProfileRoutes, meta: { requiresAuth: true } },
    { path: '/subscription', name: 'subscription', children: subscriptionRoutes, meta: { requiresAuth: true } },
    { path: '/laboratory', name: 'laboratory', children: laboratoryRoutes, meta: { requiresAuth: true } },
    { path: '/inventory', name: 'inventory', children: inventoryRoutes, meta: { requiresAuth: true } },
    { path: '/history', name: 'history', children: historyRoutes, meta: { requiresAuth: true } },
    { path: '/', redirect: '/home' },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: pageNotFound, meta: { title: 'Page not found' } }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
});

router.beforeEach((to, from, next) => {
    let baseTitle = 'LabIot Platform';
    document.title = `${to.meta["title"]} | ${baseTitle}`;

    const publicPages = ['/sign-in', '/sign-up', '/home', '/about', '/not-found'];
    const authRequired = !publicPages.includes(to.path) && to.name !== 'not-found';
    const loggedIn = localStorage.getItem('token');

    if (authRequired && !loggedIn) {
        return next('/sign-in');
    }

    next();
});

export default router;