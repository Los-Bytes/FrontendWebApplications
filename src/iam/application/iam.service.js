import { IamApi } from "../infrastructure/iam-api.js";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { SignInAssembler } from "../infrastructure/sign-in.assembler.js";
import { UserAssembler } from "../../user-profile/infrastructure/user.assembler.js";
import { SignUpAssembler } from "../infrastructure/sign-up.assembler.js";

const iamApi = new IamApi();

/**
 * Pinia store for managing Identity and Access Management (IAM) state.
 * Handles user authentication, registration, and user data fetching.
 * @returns {Object} The store object with state and actions.
 */
const useIamStore = defineStore('iam', () => {
    /** @type {ref} Array of users */
    const users = ref([]);
    /** @type {ref} Array of errors */
    const errors = ref([]);
    /** @type {ref} Boolean indicating if users are loaded */
    const usersLoaded = ref(false);
    /** @type {ref} Boolean indicating if user is signed in */
    const isSignedIn = ref(false);
    /** @type {ref} Current username */
    const currentUsername = ref(null);
    /** @type {ref} Current user ID */
    const currentUserId = ref(0);
    /** @type {ref} Current user full object */
    const currentUser = ref(null);
    /** @type {computed} Current token from localStorage */
    const currentToken = computed(() => isSignedIn.value ? localStorage.getItem('token') : null);

    /**
     * Initialize authentication state from localStorage on app startup
     */
    function loadUserFromStorage() {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('currentUser');
        
        if (token && savedUser) {
            try {
                const user = JSON.parse(savedUser);
                currentUser.value = user;
                currentUsername.value = user.username;
                currentUserId.value = user.id;
                isSignedIn.value = true;
                console.log('✅ User loaded from storage:', currentUsername.value);
            } catch (error) {
                console.error('Error loading user from storage:', error);
                signOut();
            }
        }
    }

    /**
     * Signs in a user with the provided credentials.
     * @param {SignInCommand} signInCommand - The sign-in command object.
     * @param {Object} router - The Vue router instance for navigation.
     */
    async function signIn(signInCommand, router) {
        console.log('🔐 Attempting sign-in:', signInCommand.username);
        
        try {
            const response = await iamApi.signIn(signInCommand);
            const signInResource = SignInAssembler.toResourceFromResponse(response);
            
            if (signInResource) {
                const user = UserAssembler.toEntityFromResource(signInResource);
                currentUser.value = user;
                currentUsername.value = user.username;
                currentUserId.value = user.id;
                
                // Store token and user data
                localStorage.setItem('token', signInResource.token);
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                isSignedIn.value = true;
                errors.value = [];
                
                console.log('✅ User signed in successfully:', currentUsername.value);
                router.push({ name: 'laboratoryMngmt-laboratories' });
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            isSignedIn.value = false;
            currentUser.value = null;
            console.error('❌ Sign-in failed:', error);
            errors.value.push(error);
            alert('Invalid username or password');
        }
    }

    /**
     * Signs up a new user with the provided details.
     * @param {SignUpCommand} signUpCommand - The sign-up command object.
     * @param {Object} router - The Vue router instance for navigation.
     */
    async function signUp(signUpCommand, router) {
        console.log('📝 Attempting sign-up:', signUpCommand.username);
        
        try {
            const response = await iamApi.signUp(signUpCommand);
            const signUpResource = SignUpAssembler.toResourceFromResponse(response);
            
            if (signUpResource) {
                console.log('✅ User registered successfully:', signUpResource.message);
                errors.value = [];
                alert('Registration successful! Please sign in.');
                router.push({ name: 'iam-sign-in' });
            } else {
                throw new Error('Registration failed');
            }
        } catch (error) {
            console.error('❌ Sign-up failed:', error);
            errors.value.push(error);
            alert('Registration failed. Username might already exist.');
        }
    }

    /**
     * Signs out the current user.
     * @param {Object} router - The Vue router instance for navigation.
     */
    function signOut(router) {
        currentUser.value = null;
        currentUsername.value = null;
        currentUserId.value = 0;
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        isSignedIn.value = false;
        errors.value = [];
        
        console.log('👋 User signed out');
        
        if (router) {
            router.push({ name: 'iam-sign-in' });
        }
    }

    /**
     * Fetches all users from the API.
     */
    async function fetchUsers() {
        try {
            const response = await iamApi.getUsers();
            users.value = UserAssembler.toEntitiesFromResponse(response);
            usersLoaded.value = true;
            console.log(`✅ Loaded ${users.value.length} users.`);
            errors.value = [];
        } catch (error) {
            console.error('❌ Error fetching users:', error);
            errors.value.push(error);
        }
    }

    return {
        users,
        errors,
        usersLoaded,
        currentUsername,
        currentUserId,
        currentUser,
        currentToken,
        isSignedIn,
        loadUserFromStorage,
        signIn,
        signUp,
        signOut,
        fetchUsers
    };
});

export default useIamStore;