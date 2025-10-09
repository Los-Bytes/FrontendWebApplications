import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const usersEndpointPath=import.meta.env.VITE_USERS_ENDPOINT_PATH;

export class UserProfileApi extends BaseApi{
    #usersEndpoint;
    constructor() {
        super();
        this.#usersEndpoint=new BaseEndpoint(this, usersEndpointPath )
    }


    getUsers(){
        return this.#usersEndpoint.getAll();
    }

    getUserById(id){
        return this.#usersEndpoint.getById(id);
    }

    createUser(resource){
        return this.#usersEndpoint.create(resource);
    }

    updateUser(resource){
        return this.#usersEndpoint.update(resource.id, resource);
    }

    deleteUser(id){
        return this.#usersEndpoint.delete(id);
    }


}