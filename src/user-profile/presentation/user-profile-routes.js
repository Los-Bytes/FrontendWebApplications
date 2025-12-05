import { adminGuard } from "../infrastructure/admin.guard";

const  userForm = () => import('./views/user-form.vue');
const  userList = () => import('./views/user-list.vue');
/**
 * User Profile routes configuration.
 * Defines routes for user management views with admin access control.
 * @type {Array<Object>}
 */
const userProfileRoutes = [
    {path:'users', name: 'user-profile-users', component: userList, meta: {title:'Users', requiresAdmin: true}, beforeEnter: adminGuard},
    {path:'users/new', name: 'user-profile-user-new', component: userForm, meta: {title:'New User', requiresAdmin: true}, beforeEnter: adminGuard},
    {path:'users/:id/edit', name: 'user-profile-user-edit', component: userForm, meta: {title:'Edit User', requieresAdmin: true}, beforeEnter: adminGuard}
];

export default userProfileRoutes;