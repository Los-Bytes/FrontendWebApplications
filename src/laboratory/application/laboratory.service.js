import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {LaboratoryApi} from "../infraestructure/laboratory-api.js";
import {LabResponsibleApi} from "../infraestructure/labResponsible-api.js";
import {LaboratoryMngmtAssembler} from "../infraestructure/laboratory.assembler.js";
import useIamStore from "../../iam/application/iam.service.js";

const laboratoryApi = new LaboratoryApi();
const labResponsibleApi = new LabResponsibleApi();

/**
 * Laboratory Management Store
 * @module laboratoryMngmtStore
 * @description Store for managing laboratories and lab responsibles.
 * @returns {object} Store with state, getters, and actions for laboratory management.
 */
const useLaboratoryMngmtStore= defineStore('laboratoryMngmt',()=>{
    /** @type {ref} Array laboratories - List of laboratory entities */
    const laboratories=ref([]);
    /** @type {ref} Array labResponsibles - List of lab responsible entities */
    const labResponsibles=ref([]);
    /** @type {ref} Array errors - List of errors encountered */
    const errors=ref([]);
    /** @type {ref} Boolean laboratoriesLoaded - Flag indicating if laboratories have been loaded */
    const laboratoriesLoaded=ref(false);
    /** @type {ref} Boolean labResponsiblesLoaded - Flag indicating if lab responsibles have been loaded */
    const labResponsiblesLoaded=ref(false);
    /** @type {computed} Number laboratoriesCount - Count of loaded laboratories */
    const laboratoriesCount=computed(()=>laboratoriesLoaded? laboratories.value.length : 0);
    /** @type {computed} Number labResponsiblesCount - Count of loaded lab responsibles */
    const labResponsiblesCount=computed(()=>labResponsiblesLoaded? labResponsibles.value.length : 0);
    /** @type {object} iamStore - Instance of IAM store for user management */
    const iamStore = useIamStore();

    /**
     * @type {computed} Array userLaboratories - Laboratories where the current user is admin or member
     */
    const userLaboratories = computed(() => {
        if (!iamStore.currentUser) return [];
        
        const userId = iamStore.currentUser.id;
        return laboratories.value.filter(lab => 
            lab.adminUserId === userId || 
            (lab.memberUserIds && lab.memberUserIds.includes(userId))
        );
    });

    /** Check if the current user is the admin of a given laboratory */
    function isLabAdmin(labId) {
        if (!iamStore.currentUser) return false;
        const lab = laboratories.value.find(l => l.id === labId);
        return lab && lab.adminUserId === iamStore.currentUser.id;
    }

    /** Check if the current user is a member of a given laboratory */
    function isLabMember(labId) {
        if (!iamStore.currentUser) return false;
        const lab = laboratories.value.find(l => l.id === labId);
        return lab && lab.memberUserIds && lab.memberUserIds.includes(iamStore.currentUser.id);
    }

    /** Check if the current user has access (admin or member) to a given laboratory */
    function hasLabAccess(labId) {
        return isLabAdmin(labId) || isLabMember(labId);
    }

    /** Fetch all laboratories from the API */
    function fetchLaboratories(){
        return laboratoryApi.getLaboratories().then(response=>{
            laboratories.value=LaboratoryMngmtAssembler.toLaboratoryEntityFromResponse(response);
            laboratoriesLoaded.value=true;
        }).catch(error=>{
            errors.value.push(error);
        });
    }

    /** Get a laboratory by its ID */
    function getLaboratoryById(id){
        let idNum=parseInt(id);
        return laboratories.value.find(lab=>lab["id"]===idNum);
    }

    /** Add a new laboratory */
    function addLaboratory(laboratory) {
        if (iamStore.currentUser) {
            laboratory.adminUserId = iamStore.currentUser.id;
            
            if (!laboratory.memberUserIds) {
                laboratory.memberUserIds = [];
            }
            
            if (laboratory.labResponsibleId && 
                parseInt(laboratory.labResponsibleId) !== iamStore.currentUser.id &&
                !laboratory.memberUserIds.includes(parseInt(laboratory.labResponsibleId))) {
                laboratory.memberUserIds.push(parseInt(laboratory.labResponsibleId));
            }
        }

        laboratoryApi.createLaboratory(laboratory).then(response => {
            const resource = response.data;
            const newLaboratory = LaboratoryMngmtAssembler.toLaboratoryEntityFromResource(resource);
            laboratories.value.push(newLaboratory);
            return newLaboratory;
        }).catch(error => {
            errors.value.push(error);
            throw error;
        });
    }

    /** Update an existing laboratory */
    function updateLaboratory(laboratory){
        if (!isLabAdmin(laboratory.id)) {
            console.error("Only lab admin can update this laboratory");
            return Promise.reject("Unauthorized");
        }

        laboratoryApi.updateLaboratory(laboratory).then(response=>{
            const resource=response.data;
            const updatedLaboratory=LaboratoryMngmtAssembler.toLaboratoryEntityFromResource(resource);
            const index=laboratories.value.findIndex(lab=>lab['id']===updatedLaboratory.id);
            if (index!==-1) laboratories.value[index]=updatedLaboratory;
            return updatedLaboratory;
        }).catch(error=>{
            errors.value.push(error);
            throw error;
        });
    }

    /** Delete a laboratory by its ID */
    function deleteLaboratory(id){
        if (!isLabAdmin(id)) {
            console.error("Only lab admin can delete this laboratory");
            return Promise.reject("Unauthorized");
        }

        laboratoryApi.deleteLaboratory(id).then(()=>{
            const index=laboratories.value.findIndex(lab=>lab['id']===id);
            if (index!==-1) laboratories.value.splice(index,1);
            return true;
        }).catch(error=>{
            errors.value.push(error);
            throw error;
        });
    }

    /** Add a member to a laboratory */
    function addMemberToLab(labId, userId) {
        if (!isLabAdmin(labId)) {
            console.error("Only lab admin can add members");
            return Promise.reject("Unauthorized");
        }

        const lab = laboratories.value.find(l => l.id === labId);
        if (!lab) return Promise.reject("Laboratory not found");
        
        if (!lab.memberUserIds) {
            lab.memberUserIds = [];
        }

        if (!lab.memberUserIds.includes(userId)) {
            lab.memberUserIds.push(userId);
            return updateLaboratory(lab);
        }
        return Promise.resolve();
    }

    /** Remove a member from a laboratory */
    function removeMemberFromLab(labId, userId) {
        if (!isLabAdmin(labId)) {
            console.error("Only lab admin can remove members");
            return Promise.reject("Unauthorized");
        }

        const lab = laboratories.value.find(l => l.id === labId);
        if (!lab) return Promise.reject("Laboratory not found");
        
        if (lab.memberUserIds) {
            lab.memberUserIds = lab.memberUserIds.filter(id => id !== userId);
            return updateLaboratory(lab);
        }
        return Promise.resolve();
    }

    /** Fetch all lab responsibles from the API */
    function fetchLabResponsibles(){
        return labResponsibleApi.getLabResponsibles().then(response=>{
            labResponsibles.value=LaboratoryMngmtAssembler.toLabResponsibleEntityFromResponse(response);
            labResponsiblesLoaded.value=true;
        }).catch(error=>{
            errors.value.push(error);
        });
    }

    /** Get a lab responsible by its ID */
    function getLabResponsibleById(id){
        let idNum=parseInt(id);
        return labResponsibles.value.find(responsible=>responsible["id"]===idNum);
    }

    /** Add a new lab responsible */
    function addLabResponsible(labResponsible){
        labResponsibleApi.createLabResponsible(labResponsible).then(response=>{
            const resource=response.data;
            const newLabResponsible=LaboratoryMngmtAssembler.toLabResponsibleEntityFromResource(resource);
            labResponsibles.value.push(newLabResponsible);
        }).catch(error=>{
            errors.value.push(error);
        });
    }

    /** Update an existing lab responsible */
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

    /** Delete a lab responsible by its ID */
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
        userLaboratories,
        fetchLaboratories,
        fetchLabResponsibles,
        getLaboratoryById,
        getLabResponsibleById,
        addLaboratory,
        updateLaboratory,
        deleteLaboratory,
        addLabResponsible,
        updateLabResponsible,
        deleteLabResponsible,
        isLabAdmin,
        isLabMember,
        hasLabAccess,
        addMemberToLab,
        removeMemberFromLab
    };
});

export default useLaboratoryMngmtStore;