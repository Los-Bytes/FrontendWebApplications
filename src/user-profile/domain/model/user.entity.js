/**
 * @class User
 * @summary Represents a user entity in the system.
 */
export class User {
    /**
     * @param {Object} params - The user parameters.
     * @param {string|number} params.id - The user ID.
     * @param {string} params.username - The username.
     * @param {string} [params.password] - The password (only for authentication).
     * @param {string} [params.fullName] - The full name.
     * @param {string} [params.email] - The email.
     * @param {string} [params.phone] - The phone number.
     * @param {string} [params.role] - The role.
     * @param {string} [params.organization] - The organization.
     * @param {string} [params.documentRegistration] - The document registration.
     * @param {string} [params.imgToImage] - The profile image URL.
     * @param {string} [params.suscriptionPlan] - The subscription plan.
     */
    constructor({
        id, 
        username,
        password,
        fullName = '', 
        email = '', 
        phone = '', 
        role = 'technician', 
        organization = '',
        documentRegistration = 'DNI',
        imgToImage = 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg',
        suscriptionPlan = 'Free'
    }) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.organization = organization;
        this.documentRegistration = documentRegistration;
        this.imgToImage = imgToImage;
        this.suscriptionPlan = suscriptionPlan;
    }

    /**
     * Check if user is a platform administrator
     * @returns {boolean}
     */
    isAdmin() {
        return this.role === 'admin';
    }

    /**
     * Get display name
     * @returns {string}
     */
    getDisplayName() {
        return this.fullName || this.username;
    }

    /**
     * Check if user can manage other users
     * @returns {boolean}
     */
    canManageUsers() {
        return this.isAdmin();
    }
}