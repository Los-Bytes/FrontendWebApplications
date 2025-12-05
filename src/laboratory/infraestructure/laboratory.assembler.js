import {LabResponsible} from "../domain/model/labResponsible.js";
import {Laboratory} from "../domain/model/laboratory.js";

/**
 * Assembler for converting laboratory resources and responses into Laboratory and LabResponsible entities.
 */
export class LaboratoryMngmtAssembler{
    static toLaboratoryEntityFromResource(resource){
        return new Laboratory({...resource});
    }

    static toLaboratoryEntityFromResponse(response){
        if (response.status !== 200){
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        let resources =response.data instanceof Array? response.data : response.data['laboratories'];
        return resources.map(resource=>this.toLaboratoryEntityFromResource(resource));
    }

    static toLabResponsibleEntityFromResource(resource){
        return new LabResponsible({...resource});
    }

    static toLabResponsibleEntityFromResponse(response){
        if (response.status !== 200){
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        let resources =response.data instanceof Array? response.data : response.data['labResponsibles'];
        return resources.map(resource=>this.toLabResponsibleEntityFromResource(resource));
    }
}