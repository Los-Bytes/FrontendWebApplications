import {ProductApi} from "../infraestructure/product-api.js";
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {ProductAssembler} from "../infraestructure/product.assembler.js";


const productApi = new ProductApi();

const useProductProfileStore= defineStore('productProfile',()=>{

    const products=ref([]);
    const errors=ref([]);
    const productsLoaded=ref(false);
    const productsCount=computed(()=>productsLoaded? products.value.length : 0);

    function fetchProducts(){
        return productApi.getProducts().then(response=>{
            products.value=ProductAssembler.toEntityFromResponse(response);
            productsLoaded.value=true;
            console.log(productsLoaded.value);
            console.log(products.value);
        }).catch(error=>{
            errors.value.push(error);
        });
    }

    function getProductById(id){
        let idNum=parseInt(id);
        return products.value.find(product=>product["id"]===idNum);
    }

    function addProduct(product){
        productApi.createProduct(product).then(response=>{
            const resource=response.data;
            const newProduct=ProductAssembler.toEntityFromResource(resource);
            products.value.push(newProduct);
        }).catch(error=>{
            errors.value.push(error);
        });
    }

    function updateProduct(product){
        productApi.updateProduct(product).then(response=>{
            const resource=response.data;
            const updatedProduct=ProductAssembler.toEntityFromResource(resource);
            const index=products.value.findIndex(tut=>tut['id']===updatedProduct.id);
            if (index!==-1) products.value[index]=updatedProduct;
        }).catch(error=>{
            errors.value.push(error);
        });
    }

    function deleteProduct(id){
        productApi.deleteProduct(id).then(()=>{
            const index=products.value.findIndex(tut=>tut['id']===id);
            if (index!==-1) products.value.splice(index,1);
        }).catch(error=>{
            errors.value.push(error);
        });
    }

    return {
        products,
        errors,
        productsLoaded,
        productsCount,
        fetchProducts,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct
    }

});

export default useProductProfileStore;