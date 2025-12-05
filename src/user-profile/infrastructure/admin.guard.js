import useIamStore from "../../iam/application/iam.service.js";

/**
 * Vue Router navigation guard for admin-only routes.
 * Redirects non-admin users to home page.
 * @param {Object} to - The target route object.
 * @param {Object} from - The current route object.
 * @param {Function} next - The function to call to proceed with navigation.
 */
export const adminGuard = (to, from, next) => {
    const iamStore = useIamStore();
    
    if (!iamStore.isSignedIn) {
        console.log('🔒 User not authenticated, redirecting to sign-in');
        return next({ name: 'iam-sign-in' });
    }
    
    const isAdmin = iamStore.currentUser?.role === 'admin';
    
    if (!isAdmin) {
        console.log('🚫 User is not admin, access denied');
        alert('Access denied. This section is only for administrators.');
        return next({ name: 'home' });
    }
    
    console.log('✅ Admin access granted');
    next();
}