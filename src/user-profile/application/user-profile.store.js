import {UserProfileApi} from "../infrastructure/user-profile-api.js";
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {UserAssembler} from "../infrastructure/user.assembler.js";

const userProfileApi=new UserProfileApi();

const useUserProfileStore= defineStore('userProfile',()=>{

    const users=ref([]);
    const errors=ref([]);
    const usersLoaded=ref(false);
    const usersCount=computed(()=>usersLoaded? users.value.length : 0);

    function fetchUsers(){
        return userProfileApi.getUsers().then(response=>{
            users.value=UserAssembler.toEntityFromResponse(response);
            usersLoaded.value=true;
            console.log(usersLoaded.value);
            console.log(users.value);
        }).catch(error=>{
            errors.value.push(error);
        });
    }

    function getUserById(id){
        let idNum=parseInt(id);
        return users.value.find(user=>user["id"]===idNum);
    }

    function addUser(user){
        userProfileApi.createUser(user).then(response=>{
            const resource=response.data;
            const newUser=UserAssembler.toEntityFromResource(resource);
            users.value.push(newUser);
        }).catch(error=>{
            errors.value.push(error);
        });
    }

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