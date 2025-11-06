import {LaboratoryApi} from "../infraestructure/laboratory-api.js";
import {LabResponsibleApi} from "../infraestructure/labResponsible-api.js";
import {LaboratoryMngmtAssembler} from "../infraestructure/laboratoryMngmt.assembler.js";
import {defineStore} from "pinia";
import {computed, ref} from "vue";

const laboratoryApi = new LaboratoryApi();
const labResponsibleApi = new LabResponsibleApi();

const useLaboratoryMngmtStore= defineStore('laboratoryMngmt',()=>{

    const laboratories=ref([]);
    const labResponsibles=ref([]);
    const errors=ref([]);
    const laboratoriesLoaded=ref(false);
    const labResponsiblesLoaded=ref(false);
    const laboratoriesCount=computed(()=>laboratoriesLoaded? laboratories.value.length : 0);
    const labResponsiblesCount=computed(()=>labResponsiblesLoaded? labResponsibles.value.length : 0);

    function fetchLaboratories(){
        return laboratoryApi.getLaboratories().then(response=>{
            laboratories.value=LaboratoryMngmtAssembler.toLaboratoryEntityFromResponse(response);
            laboratoriesLoaded.value=true;
        }).catch(error=>{
            errors.value.push(error);
        });
    }

    function getLaboratoryById(id){
        let idNum=parseInt(id);
        return laboratories.value.find(lab=>lab["id"]===idNum);
    }

    function addLaboratory(laboratory){
        laboratoryApi.createLaboratory(laboratory).then(response=>{
            const resource=response.data;
            const newLaboratory=LaboratoryMngmtAssembler.toLaboratoryEntityFromResource(resource);
            laboratories.value.push(newLaboratory);
        }).catch(error=>{
            errors.value.push(error);
        });
    }

    function updateLaboratory(laboratory){
        laboratoryApi.updateLaboratory(laboratory).then(response=>{
            const resource=response.data;
            const updatedLaboratory=LaboratoryMngmtAssembler.toLaboratoryEntityFromResource(resource);
            const index=laboratories.value.findIndex(lab=>lab['id']===updatedLaboratory.id);
            if (index!==-1) laboratories.value[index]=updatedLaboratory;
        }).catch(error=>{
            errors.value.push(error);
        });
    }

    function deleteLaboratory(id){
        laboratoryApi.deleteLaboratory(id).then(()=>{
            const index=laboratories.value.findIndex(lab=>lab['id']===id);
            if (index!==-1) laboratories.value.splice(index,1);
        }).catch(error=>{
            errors.value.push(error);
        });
    }

    function fetchLabResponsibles(){
        return labResponsibleApi.getLabResponsibles().then(response=>{
            labResponsibles.value=LaboratoryMngmtAssembler.toLabResponsibleEntityFromResponse(response);
            labResponsiblesLoaded.value=true;
        }).catch(error=>{
            errors.value.push(error);
        });
    }
    function getLabResponsibleById(id){
        let idNum=parseInt(id);
        return labResponsibles.value.find(responsible=>responsible["id"]===idNum);
    }

    function addLabResponsible(labResponsible){
        labResponsibleApi.createLabResponsible(labResponsible).then(response=>{
            const resource=response.data;
            const newLabResponsible=LaboratoryMngmtAssembler.toLabResponsibleEntityFromResource(resource);
            labResponsibles.value.push(newLabResponsible);
        }).catch(error=>{
            errors.value.push(error);
        });
    }

    function updateLabResponsible(labResponsible){
        labResponsibleApi.updateLabResponsible(labResponsible).then(response=>{
            const resource=response.data;
            const updatedLabResponsible=LaboratoryMngmtAssembler.toLabResponsibleEntityFromResource(resource);
            const index=labResponsibles.value.findIndex(responsible=>responsible['id']===updatedLabResponsible.id);
            if (index!==-1) labResponsibles.value[index]=updatedLabResponsible;
        }).catch(error=>{
            errors.value.push(error);
        });
    }

    function deleteLabResponsible(id){
        labResponsibleApi.deleteLabResponsible(id).then(()=>{
            const index=labResponsibles.value.findIndex(responsible=>responsible['id']===id);
            if (index!==-1) labResponsibles.value.splice(index,1);
        }).catch(error=>{
            errors.value.push(error);
        });
    }

    return {
        laboratories,
        labResponsibles,
        errors,
        laboratoriesLoaded,
        labResponsiblesLoaded,
        laboratoriesCount,
        labResponsiblesCount,
        fetchLaboratories,
        fetchLabResponsibles,
        getLaboratoryById,
        getLabResponsibleById,
        addLaboratory,
        updateLaboratory,
        deleteLaboratory,
        addLabResponsible,
        updateLabResponsible,
        deleteLabResponsible

    };
});

export default useLaboratoryMngmtStore;