/**
 * @class SignUpResource
 * @summary Resource representing sign-up response data.
 */
export class SignUpResource {
    /**
     * @param {string} message - The response message.
     * @param {number} [id] - The newly created user ID.
     * @param {string} [username] - The username of the new user.
     */
    constructor({message, id = null, username = ''}) {
        this.message = message;
        this.id = id;
        this.username = username;
    }
}