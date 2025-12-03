/**
 * @class SignInResource
 * @summary Resource representing sign-in data returned from the API.
 */
export class SignInResource {
    /**
     * @param {string|number} id - The user ID.
     * @param {string} username - The username.
     * @param {string} token - The authentication token.
     * @param {string} [fullName] - The full name.
     * @param {string} [email] - The email.
     * @param {string} [role] - The user role.
     * @param {string} [organization] - The organization.
     * @param {string} [imgToImage] - The profile image URL.
     */
    constructor({id, username, token, fullName = '', email = '', role = '', organization = '', imgToImage = ''}) {
        this.id = id;
        this.username = username;
        this.token = token;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.organization = organization;
        this.imgToImage = imgToImage;
    }
}