import { API_BASE_URL } from '../config/apiConfig.js';

/**
 * Sends API requests and handles responses and errors.
 */
export class ApiService {
    /**
     * Sends a request to an API endpoint.
     */
    async request(endpoint, method = 'GET', data = null) {
        const options = {
            method: method,
            credentials: 'include',
            headers: {
                Accept: 'application/json'
            }
        };

        if (data !== null) {
            options.body = JSON.stringify(data);
        }

        let response;

        try {
            response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        } catch {
            throw new Error(
                'Die API ist nicht erreichbar. Prüfe die Verbindung ' +
                'und mögliche Browser- oder CORS-Meldungen.'
            );
        }

        if (!response.ok) {
            const error = new Error(
                this.getErrorMessage(response.status)
            );

            error.status = response.status;

            throw error;
        }

        if (response.status === 204) {
            return null;
        }

        const responseText = await response.text();

        if (responseText.trim() === '') {
            return null;
        }

        try {
            return JSON.parse(responseText);
        } catch {
            throw new Error(
                'Die API hat eine ungültige JSON-Antwort zurückgegeben.'
            );
        }
    }

    /**
     * Returns a user-friendly message for an HTTP error.
     */
    getErrorMessage(status) {
        switch (status) {
            case 400:
                return 'Die übermittelten Daten sind ungültig.';
            case 401:
                return 'Die Anmeldung ist fehlgeschlagen oder abgelaufen.';
            case 403:
                return 'Du hast keine Berechtigung für diese Aktion.';
            case 404:
                return 'Die angeforderten Daten wurden nicht gefunden.';
            case 500:
                return 'Bei der API ist ein interner Fehler aufgetreten.';
            default:
                return `Die Anfrage ist fehlgeschlagen (HTTP ${status}).`;
        }
    }
}