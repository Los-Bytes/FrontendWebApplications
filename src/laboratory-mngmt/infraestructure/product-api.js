import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const productsEndpointPath=import.meta.env.VITE_PRODUCTS_ENDPOINT_PATH;
export class ProductApi extends BaseApi{
    #productsEndpoint;
    constructor() {
        super();
        this.#productsEndpoint=new BaseEndpoint(this, productsEndpointPath)
    }
    getProducts(){
        return this.#productsEndpoint.getAll();
    }

    getProductById(id){
        return this.#productsEndpoint.getById(id);
    }

    createProduct(resource){
        return this.#productsEndpoint.create(resource);
    }

    updateProduct(resource){
        return this.#productsEndpoint.update(resource.id, resource);
    }

    deleteProduct(id){
        return this.#productsEndpoint.delete(id);
    }


}