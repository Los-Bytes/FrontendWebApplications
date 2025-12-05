import axios from "axios";

/**
 * Base API class to handle HTTP requests.
 * Uses Axios for making requests.
 * The base URL is set from environment variables.
 * @class BaseApi
 * @property {object} http - The Axios instance for making HTTP requests.
 * @constructor
 * Initializes the Axios instance with the base URL.
 */
const platformApi=import.meta.env.VITE_LABIOT_PLATFORM_API_URL;
export class BaseApi{
    #http;
    constructor() {
        this.#http=axios.create({
            baseURL:platformApi,
        })
    }
    get http(){
        return this.#http
    }
}
