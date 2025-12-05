/**
 * @class User
 * @summary Represents a user entity.
 */
export class User {
    /**
     * @param {Object} params - The user parameters.
     * @param {string|number} params.id - The user ID.
     * @param {string} params.username - The username.
     */
    constructor({ id, username, userName, fullName, email, role, organization, phone, documentRegistration, imgToImage }) {
        this.id = id;
        this.username = username || userName;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.organization = organization;
        this.phone = phone;
        this.documentRegistration = documentRegistration;
        this.profileImageUrl = imgToImage;
    }
}