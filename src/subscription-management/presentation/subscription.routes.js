
const SubscriptionList = () => import('./views/subscription-list.vue')
const SubscriptionForm = () => import('./views/subscription-form.vue')

export const subscriptionRoutes = [
    {
        path: 'subscriptions',
        name: 'subscriptions.list',
        component: SubscriptionList,
        meta: { title: 'Subscriptions' }
    },
    {
        path: 'subscriptions/new',
        name: 'subscriptions.new',
        component: SubscriptionForm,
        props: { mode: 'create' },
        meta: { title: 'New Subscription' }
    },
    {
        path: 'subscriptions/:id/edit',
        name: 'subscriptions.edit',
        component: SubscriptionForm,
        props: route => ({ mode: 'edit', id: Number(route.params.id) }),
        meta: { title: 'Edit Subscription' }
    }
]

export default subscriptionRoutes
