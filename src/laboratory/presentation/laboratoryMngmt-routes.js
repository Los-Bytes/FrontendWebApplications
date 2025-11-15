const laboratoryForm = () => import('./views/laboratory-form.vue');
const laboratoryList = () => import('./views/laboratory-list.vue');

const laboratoryMngmtRoutes = [
    {path:  'laboratories', name: 'laboratoryMngmt-laboratories',   component: laboratoryList, meta: {title:'Laboratories'}},
    {path:  'laboratories/new', name: 'laboratoryMngmt-laboratory-new',    component: laboratoryForm, meta: {title:'New Laboratory'}},
    {path:  'laboratories/:id/edit',    name: 'laboratoryMngmt-laboratory-edit',   component: laboratoryForm, meta: {title:'Edit Laboratory'}},
];

export default laboratoryMngmtRoutes;