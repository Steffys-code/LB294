/**
 * Manages authentication elements and user feedback.
 */
export class AuthView {
    /**
     * Selects the existing authentication and navigation elements.
     */
    constructor() {
        this.loginForm = document.getElementById('login-form');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.loginButton = this.loginForm.querySelector(
            'button[type="submit"]'
        );

        this.logoutButton = document.getElementById('logout-button');
        this.authSection = document.getElementById('auth-section');
        this.managementSection = document.getElementById(
            'management-section'
        );
        this.mainNavigation = document.getElementById('main-navigation');
        this.feedbackElement = document.getElementById('feedback');

        this.isBusy = false;
    }

    /**
     * Connects form submission to the login handler.
     */
    bindLogin(handler) {
        this.loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            if (this.isBusy) {
                return;
            }

            handler(
                this.usernameInput.value,
                this.passwordInput.value
            );
        });
    }

    /**
     * Connects the logout button to the logout handler.
     */
    bindLogout(handler) {
        this.logoutButton.addEventListener('click', () => {
            if (this.isBusy) {
                return;
            }

            handler();
        });
    }

    /**
     * Updates the interface for the authentication state.
     */
    setAuthenticated(isAuthenticated) {
        this.authSection.hidden = isAuthenticated;
        this.managementSection.hidden = !isAuthenticated;
        this.mainNavigation.hidden = !isAuthenticated;

        this.clearPassword();

        if (isAuthenticated) {
            this.logoutButton.focus();
        } else {
            this.usernameInput.focus();
        }
    }

    /**
     * Enables or disables authentication controls during requests.
     */
    setBusy(isBusy) {
        this.isBusy = isBusy;

        this.usernameInput.disabled = isBusy;
        this.passwordInput.disabled = isBusy;
        this.loginButton.disabled = isBusy;
        this.logoutButton.disabled = isBusy;

        this.loginForm.setAttribute('aria-busy', String(isBusy));

        this.loginButton.textContent = isBusy
            ? 'Bitte warten …'
            : 'Anmelden';

        this.logoutButton.textContent = isBusy
            ? 'Bitte warten …'
            : 'Abmelden';
    }

    /**
     * Displays feedback without interpreting the message as HTML.
     * @param {string} message The message displayed to the user.
     */
    showFeedback(message) {
        this.feedbackElement.textContent = message;
    }

    /**
     * Removes the current feedback message.
     */
    clearFeedback() {
        this.feedbackElement.textContent = '';
    }

    /**
     * Removes the password from the input field.
     */
    clearPassword() {
        this.passwordInput.value = '';
    }
}