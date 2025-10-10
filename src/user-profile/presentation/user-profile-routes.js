

const  userForm = () => import('./views/user-form.vue');
const  userList = () => import('./views/user-list.vue');

const userProfileRoutes = [
    {path:'users',           name: 'user-profile-users',      component: userList, meta: {title:'Users'}},
    {path: 'users/new',       name: 'user-profile-user-new',    component: userForm, meta: {title:'New User'}},
    {path: 'users/:id/edit', name: 'user-profile-user-edit',   component: userForm, meta: {title:'Edit User'}}

];

export default userProfileRoutes;