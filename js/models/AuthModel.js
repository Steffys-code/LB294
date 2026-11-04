import {
    AUTHENTICATE_ENDPOINT,
    UNAUTHENTICATE_ENDPOINT
} from '../config/apiConfig.js';

/**
 * Manages authentication requests and the local authentication state.
 */
export class AuthModel {
    /**
     * Creates the authentication model.
     */
    constructor(apiService) {
        this.apiService = apiService;
        this.isAuthenticated = false;
    }

    /**
     * Authenticates the user with the API.
     */
    async login(username, password) {
        this.isAuthenticated = false;

        const normalizedUsername = username.trim();

        if (normalizedUsername === '' || password === '') {
            throw new Error(
                'Bitte gib Deinen Benutzernamen und Dein Passwort ein.'
            );
        }

        await this.apiService.request(
            AUTHENTICATE_ENDPOINT,
            'POST',
            {
                username: normalizedUsername,
                password: password
            }
        );

        this.isAuthenticated = true;
    }

    /**
     * Requests removal of the authentication cookie.
     * @returns {Promise<void>} Resolves after successful logout.
     * @throws {Error} If the logout request fails.
     */
    async logout() {
        await this.apiService.request(
            UNAUTHENTICATE_ENDPOINT,
            'POST'
        );

        this.isAuthenticated = false;
    }

    /**
     * Returns the locally tracked authentication state.
     * @returns {boolean} Whether authentication was successful locally.
     */
    isLoggedIn() {
        return this.isAuthenticated;
    }
}