const laboratoryForm = () => import('./views/laboratory-form.vue');
const laboratoryList = () => import('./views/laboratory-list.vue');
const labResponsibleForm = () => import('./views/labResponsible-form.vue');
const labResponsibleList = () => import('./views/labResponsible-list.vue');



const laboratoryMngmtRoutes = [
    {path:'laboratories',           name: 'laboratoryMngmt-laboratories',      component: laboratoryList, meta: {title:'Laboratories'}},
    {path: 'laboratories/new',       name: 'laboratoryMngmt-laboratory-new',    component: laboratoryForm, meta: {title:'New Laboratory'}},
    {path: 'laboratories/:id/edit', name: 'laboratoryMngmt-laboratory-edit',   component: laboratoryForm, meta: {title:'Edit Laboratory'}},
    {path:'labResponsibles',           name: 'laboratoryMngmt-labResponsibles',      component: labResponsibleList, meta: {title:'Lab Responsibles'}},
    {path: 'labResponsibles/new',       name: 'laboratoryMngmt-labResponsible-new',    component: labResponsibleForm, meta: {title:'New Lab Responsible'}},
    {path: 'labResponsibles/:id/edit', name: 'laboratoryMngmt-labResponsible-edit',   component: labResponsibleForm, meta: {title:'Edit Lab Responsible'}},
];

export default laboratoryMngmtRoutes;