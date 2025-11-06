export class Product{
    constructor({id=null, name='', description='', category='', mesurementUnit='',
                    unitPrice=null, expirationDate='', batch=''}){
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.mesurementUnit = mesurementUnit;
        this.unitPrice = unitPrice;
        this.expirationDate = expirationDate;
        this.batch = batch;

    }
}