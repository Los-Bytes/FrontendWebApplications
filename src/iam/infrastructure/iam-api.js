import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";
import { BaseApi } from "../../shared/infrastructure/base-api.js";

const signInEndpointPath = import.meta.env.VITE_SIGNIN_ENDPOINT_PATH;
const signUpEndpointPath = import.meta.env.VITE_SIGNUP_ENDPOINT_PATH;
const usersEndpointPath = import.meta.env.VITE_USERS_ENDPOINT_PATH;

/**
 * @class IamApi
 * @extends BaseApi
 * @summary API class for Identity and Access Management operations.
 */
export class IamApi extends BaseApi {
    #signInEndpoint;
    #signUpEndpoint;
    #usersEndpoint;

    /**
     * @constructor
     */
    constructor() {
        super();
        this.#signInEndpoint = new BaseEndpoint(this, signInEndpointPath);
        this.#signUpEndpoint = new BaseEndpoint(this, signUpEndpointPath);
        this.#usersEndpoint = new BaseEndpoint(this, usersEndpointPath);
    }

    /**
     * Sign in a user
     * @param {SignInCommand} signInCommand - The sign-in command data.
     * @returns {Promise} A promise that resolves with the sign-in response.
     */
    signIn(signInCommand) {
        return this.#signInEndpoint.create(signInCommand);
    }

    /**
     * Sign up a new user
     * @param {SignUpCommand} signUpCommand - The sign-up command data.
     * @returns {Promise} A promise that resolves with the sign-up response.
     */
    signUp(signUpCommand) {
        return this.#signUpEndpoint.create(signUpCommand);
    }

    /**
     * Get all users
     * @returns {Promise} A promise that resolves with the list of users.
     */
    getUsers() {
        return this.#usersEndpoint.getAll();
    }

    /**
     * Get user by ID
     * @param {number} id - The user ID
     * @returns {Promise} A promise that resolves with the user data.
     */
    getUserById(id) {
        return this.#usersEndpoint.getById(id);
    }
}