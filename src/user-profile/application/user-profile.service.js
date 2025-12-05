import {UserProfileApi} from "../infrastructure/user-profile-api.js";
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {UserAssembler} from "../infrastructure/user.assembler.js";

/** Service to manage user profiles. */
const userProfileApi=new UserProfileApi();
/**
 * Pinia store for managing user profiles.
 * Handles fetching, adding, updating, and deleting user profiles.
 * @returns {Object} The store object with state and actions.
 */
const useUserProfileStore= defineStore('userProfile',()=>{
    /** @type {ref} Array of user profiles */
    const users=ref([]);
    /** @type {ref} Array of errors */
    const errors=ref([]);
    /** @type {ref} Boolean indicating if users are loaded */
    const usersLoaded=ref(false);
    /** @type {computed} Count of users */
    const usersCount=computed(()=>usersLoaded? users.value.length : 0);

    /** Fetches the list of users from the API and updates the store state. 
     * @return {Promise<void>}
    */
    function fetchUsers(){
        return userProfileApi.getUsers().then(response=>{
            users.value=UserAssembler.toEntitiesFromResponse(response);
            usersLoaded.value=true;
            console.log('✅ Users loaded:', users.value.length);
        }).catch(error=>{
            console.error('❌ Error fetching users:', error);
            errors.value.push(error);
        });
    }
    /** Retrieves a user by their ID from the store. 
     * @param {number|string} id - The ID of the user to retrieve.
     * @return {Object|undefined} The user object if found, otherwise undefined.
    */
    function getUserById(id){
        let idNum=parseInt(id);
        return users.value.find(user=>user["id"]===idNum);
    }
    /**
     * Adds a new user profile to the store and persists it via the API.
     * @param {Object} user - The user profile to add.
     * @return {void}
     */
    function addUser(user){
        userProfileApi.createUser(user).then(response=>{
            const resource=response.data;
            const newUser=UserAssembler.toEntityFromResource(resource);
            users.value.push(newUser);
        }).catch(error=>{
            errors.value.push(error);
        });
    }
    /**
     * Updates an existing user profile in the store and persists changes via the API.
     * @param {Object} user - The user profile to update.
     * @return {void}
     */
    function updateUser(user){
        userProfileApi.updateUser(user).then(response=>{
            const resource=response.data;
            const updatedUser=UserAssembler.toEntityFromResource(resource);
            const index=users.value.findIndex(tut=>tut['id']===updatedUser.id);
            if (index!==-1) users.value[index]=updatedUser;
        }).catch(error=>{
            errors.value.push(error);
        });
    }
    /**
     * Deletes a user profile from the store and via the API.
     * @param {number|string} id - The ID of the user to delete.
     * @return {void}
     */
    function deleteUser(id){
        userProfileApi.deleteUser(id).then(()=>{
            const index=users.value.findIndex(tut=>tut['id']===id);
            if (index!==-1) users.value.splice(index,1);
        }).catch(error=>{
            errors.value.push(error);
        });
    }

    return {
        users,
        errors,
        usersLoaded,
        usersCount,
        fetchUsers,
        getUserById,
        addUser,
        updateUser,
        deleteUser
    }

});

export default useUserProfileStore;