export class User{
    constructor({id=null, userName='', fullName='', email='', phone='',
                    role='', organization='', documentRegistration='' , imgToImage=''}) {
        this.id = id;
        this.userName = userName;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.organization = organization;
        this.documentRegistration = documentRegistration;
        this.imgToImage = imgToImage;
    }
}