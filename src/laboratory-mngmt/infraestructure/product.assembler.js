import {Product} from "../domain/model/product.js";

export class ProductAssembler{
    static toEntityFromResource(resource){
        return new Product({...resource});
    }

    static toEntityFromResponse(response){
        if (response.status !== 200){
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        let resources =response.data instanceof Array? response.data : response.data['products'];
        return resources.map(resource=>this.toEntityFromResource(resource));
    }

}