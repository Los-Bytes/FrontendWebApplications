const laboratoryForm = () => import('./views/laboratory-form.vue');
const laboratoryList = () => import('./views/laboratory-list.vue');

/**
 * Routes for Laboratory Management module.
 * Includes routes for listing laboratories, creating a new laboratory, and editing an existing laboratory.
 * Each route is associated with a specific component and metadata for titles.
 */
const laboratoryMngmtRoutes = [
    {path:  'laboratories', name: 'laboratoryMngmt-laboratories',   component: laboratoryList, meta: {title:'Laboratories'}},
    {path:  'laboratories/new', name: 'laboratoryMngmt-laboratory-new',    component: laboratoryForm, meta: {title:'New Laboratory'}},
    {path:  'laboratories/:id/edit',    name: 'laboratoryMngmt-laboratory-edit',   component: laboratoryForm, meta: {title:'Edit Laboratory'}},
];

export default laboratoryMngmtRoutes;