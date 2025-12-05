import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { LaboratoryApi } from "../infraestructure/laboratory-api.js";
import { LabResponsibleApi } from "../infraestructure/labResponsible-api.js";
import { LaboratoryMngmtAssembler } from "../infraestructure/laboratoryMngmt.assembler.js";
import useAuthStore from "../../iam/application/iam.store.js";

const laboratoryApi = new LaboratoryApi();
const labResponsibleApi = new LabResponsibleApi();

const useLaboratoryMngmtStore = defineStore('laboratoryMngmt', () => {

    const laboratories = ref([]);
    const labResponsibles = ref([]);
    const errors = ref([]);
    const laboratoriesLoaded = ref(false);
    const labResponsiblesLoaded = ref(false);
    const laboratoriesCount = computed(() => laboratoriesLoaded ? laboratories.value.length : 0);
    const labResponsiblesCount = computed(() => labResponsiblesLoaded ? labResponsibles.value.length : 0);
    const authStore = useAuthStore();

    // Filtrar laboratorios del usuario actual (admin o miembro)
    const userLaboratories = computed(() => {
        if (!authStore.isSignedIn) return [];

        const userId = authStore.currentUserId;
        return laboratories.value.filter(lab =>
            lab.adminUserId === userId ||
            (lab.memberUserIds && lab.memberUserIds.includes(userId))
        );
    });

    // Verificar si el usuario es admin de un laboratorio
    function isLabAdmin(labId) {
        if (!authStore.isSignedIn) return false;
        const lab = laboratories.value.find(l => l.id === labId);
        return lab && lab.adminUserId === authStore.currentUserId;
    }

    // Verificar si el usuario es miembro de un laboratorio
    function isLabMember(labId) {
        if (!authStore.isSignedIn) return false;
        const lab = laboratories.value.find(l => l.id === labId);
        return lab && lab.memberUserIds && lab.memberUserIds.includes(authStore.currentUserId);
    }

    // Verificar si el usuario tiene acceso al laboratorio
    function hasLabAccess(labId) {
        return isLabAdmin(labId) || isLabMember(labId);
    }

    // 1) Laboratory Management
    // Fetch all laboratories
    function fetchLaboratories() {
        return laboratoryApi.getLaboratories().then(response => {
            laboratories.value = LaboratoryMngmtAssembler.toLaboratoryEntityFromResponse(response);
            laboratoriesLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    // Get laboratory by id
    function getLaboratoryById(id) {
        let idNum = parseInt(id);
        return laboratories.value.find(lab => lab["id"] === idNum);
    }

    // Add new laboratory
    function addLaboratory(laboratory) {
        // ✅ Asignar el usuario actual como administrador
        if (authStore.isSignedIn) {
            laboratory.adminUserId = authStore.currentUserId;

            // ✅ Si no tiene memberUserIds, inicializar como array vacío
            if (!laboratory.memberUserIds) {
                laboratory.memberUserIds = [];
            }

            // ✅ Si labResponsibleId está presente y no es el mismo que el admin, agregarlo como miembro
            if (laboratory.labResponsibleId &&
                parseInt(laboratory.labResponsibleId) !== authStore.currentUserId &&
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

    // Update laboratory
    function updateLaboratory(laboratory) {
        if (!isLabAdmin(laboratory.id)) {
            console.error("Only lab admin can update this laboratory");
            return Promise.reject("Unauthorized");
        }

        laboratoryApi.updateLaboratory(laboratory).then(response => {
            const resource = response.data;
            const updatedLaboratory = LaboratoryMngmtAssembler.toLaboratoryEntityFromResource(resource);
            const index = laboratories.value.findIndex(lab => lab['id'] === updatedLaboratory.id);
            if (index !== -1) laboratories.value[index] = updatedLaboratory;
            return updatedLaboratory;
        }).catch(error => {
            errors.value.push(error);
            throw error;
        });
    }

    // Delete laboratory by id
    function deleteLaboratory(id) {
        if (!isLabAdmin(id)) {
            console.error("Only lab admin can delete this laboratory");
            return Promise.reject("Unauthorized");
        }

        laboratoryApi.deleteLaboratory(id).then(() => {
            const index = laboratories.value.findIndex(lab => lab['id'] === id);
            if (index !== -1) laboratories.value.splice(index, 1);
            return true;
        }).catch(error => {
            errors.value.push(error);
            throw error;
        });
    }

    // Añadir miembro a un laboratorio (solo admin)
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

    // Remover miembro de un laboratorio (solo admin)
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

    // 2) Laboratory Member Management
    // Lab Responsible Management
    function fetchLabResponsibles() {
        return labResponsibleApi.getLabResponsibles().then(response => {
            labResponsibles.value = LaboratoryMngmtAssembler.toLabResponsibleEntityFromResponse(response);
            labResponsiblesLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    // Get lab responsible by id
    function getLabResponsibleById(id) {
        let idNum = parseInt(id);
        return labResponsibles.value.find(responsible => responsible["id"] === idNum);
    }

    // Add new lab responsible
    function addLabResponsible(labResponsible) {
        labResponsibleApi.createLabResponsible(labResponsible).then(response => {
            const resource = response.data;
            const newLabResponsible = LaboratoryMngmtAssembler.toLabResponsibleEntityFromResource(resource);
            labResponsibles.value.push(newLabResponsible);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    // Update lab responsible
    function updateLabResponsible(labResponsible) {
        labResponsibleApi.updateLabResponsible(labResponsible).then(response => {
            const resource = response.data;
            const updatedLabResponsible = LaboratoryMngmtAssembler.toLabResponsibleEntityFromResource(resource);
            const index = labResponsibles.value.findIndex(responsible => responsible['id'] === updatedLabResponsible.id);
            if (index !== -1) labResponsibles.value[index] = updatedLabResponsible;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    // Delete lab responsible by id
    function deleteLabResponsible(id) {
        labResponsibleApi.deleteLabResponsible(id).then(() => {
            const index = labResponsibles.value.findIndex(responsible => responsible['id'] === id);
            if (index !== -1) labResponsibles.value.splice(index, 1);
        }).catch(error => {
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
        userLaboratories, // ✅ Nuevo
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
        isLabAdmin, // ✅ Nuevo
        isLabMember, // ✅ Nuevo
        hasLabAccess, // ✅ Nuevo
        addMemberToLab, // ✅ Nuevo
        removeMemberFromLab // ✅ Nuevo

    };
});

export default useLaboratoryMngmtStore;