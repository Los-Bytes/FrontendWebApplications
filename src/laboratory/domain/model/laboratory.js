export class Laboratory {
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