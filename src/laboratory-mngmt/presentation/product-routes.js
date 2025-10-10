const  productForm = () => import('./views/product-form.vue');
const  productList = () => import('./views/product-list.vue');

const productProfileRoutes = [
    {path:'products',           name: 'product-products',      component: productList, meta: {title:'Products'}},
    {path: 'products/new',       name: 'product-product-new',    component: productForm, meta: {title:'New Product'}},
    {path: 'products/:id/edit', name: 'product-product-edit',   component: productForm, meta: {title:'Edit Product'}},

];

export default productProfileRoutes;