import Home from "./shared/presentation/views/home.vue";
import {createRouter, createWebHistory} from "vue-router";
import userProfileRoutes from "./user-profile/presentation/user-profile-routes.js";
import subscriptionRoutes from "./subscription/presentation/subscription.routes.js";
import laboratoryRoutes from "./laboratory/presentation/laboratoryMngmt-routes.js";
import inventoryRoutes from "./inventory/presentation/inventory-routes.js";
import historyRoutes from './history/presentation/history-routes.js';
import iamRoutes from "./iam/presentation/iam-routes.js";
import { authenticationGuard } from "./iam/infrastructure/authentication.guard.js";

const about = () => import('./shared/presentation/views/about.vue');
const pageNotFound = () => import('./shared/presentation/views/page-not-found.vue');


const routes = [
    {path: '/home', name: 'home', component: Home, meta: { title: 'Home' } },
    {path: '/about', name: 'about', component: about, meta: { title: 'About' } },
    {path: '/user-profile', name: 'user-profile', children: userProfileRoutes},
    {path: '/subscription', name: 'subscription', children: subscriptionRoutes},
    {path: '/laboratory', name: 'laboratory', children: laboratoryRoutes},
    {path: '/inventory', name: 'inventory', children: inventoryRoutes},
    {path: '/history', name: 'history', children: historyRoutes},
    {path: '/iam', name: 'iam', children: iamRoutes},
    {path: '/', redirect: '/iam/sign-in' },
    {path: '/:pathMatch(.*)*', name: 'not-found', component: pageNotFound, meta: { title: 'Page not found' } }
];

const router=createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
});

router.beforeEach(authenticationGuard);

router.beforeEach((to, from, next) => {
   let baseTitle='LabIot Platform';
   document.title=`${to.meta["title"]} | ${baseTitle}`;
   next();
});

export default router;