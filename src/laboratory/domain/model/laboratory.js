/**
 * @class Laboratory
 * @summary Represents a laboratory entity with its attributes.
 */
export class Laboratory {
    /**
     * @param {Object} params - The laboratory parameters.
     * @param {string|number} [params.id] - The laboratory ID.
     * @param {string} [params.name] - The name of the laboratory.
     * @param {string} [params.address] - The address of the laboratory.
     * @param {string} [params.phone] - The contact phone number of the laboratory.
     * @param {number} [params.capacity] - The capacity of the laboratory.
     * @param {string} [params.registrationDate] - The registration date of the laboratory.
     * @param {string|number} [params.labResponsibleId] - The ID of the laboratory responsible person.
     * @param {string|number} [params.adminUserId] - The ID of the laboratory admin user.
     * @param {Array<string|number>} [params.memberUserIds] - The IDs of the laboratory member users.
    */
    constructor({
                    id = null, name = '',
                    address = '',
                    phone = '',
                    capacity = null,
                    registrationDate = '',
                    labResponsibleId = null,
                    adminUserId = null,
                    memberUserIds = []
                }) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.capacity = capacity;
        this.registrationDate = registrationDate;
        this.labResponsibleId= labResponsibleId;
        this.adminUserId = adminUserId;
        this.memberUserIds = memberUserIds;
    }
}