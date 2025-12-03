/**
 * @class SignUpCommand
 * @summary Represents a sign-up command in the IAM bounded context. Used to register a new user.
 */
export class SignUpCommand {
    /**
     * @param {Object} params - The sign-up parameters.
     * @param {string} params.username - The username of the user.
     * @param {string} params.password - The password of the user.
     * @param {string} [params.fullName] - The full name of the user.
     * @param {string} [params.email] - The email of the user.
     * @param {string} [params.phone] - The phone number of the user.
     * @param {string} [params.role] - The role of the user.
     * @param {string} [params.organization] - The organization of the user.
     */
    constructor({username, password, fullName = '', email = '', phone = '', role = 'technician', organization = ''}) {
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.organization = organization;
    }
}