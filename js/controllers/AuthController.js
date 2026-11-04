/**
 * Coordinates authentication actions between the model and the view.
 */
export class AuthController {
    /**
     * Creates the authentication controller.
     */
    constructor(authModel, authView) {
        this.authModel = authModel;
        this.authView = authView;
        this.isBusy = false;
    }

    /**
     * Connects user actions and displays the initial authentication state.
     */
    initialize() {
        this.authView.bindLogin((username, password) => {
            this.login(username, password);
        });

        this.authView.bindLogout(() => {
            this.logout();
        });

        this.authView.setBusy(false);
        this.authView.clearFeedback();
        this.authView.setAuthenticated(this.authModel.isLoggedIn());
    }

    /**
     * Authenticates the user and updates the interface.
     */
    async login(username, password) {
        if (this.isBusy) {
            return;
        }

        this.isBusy = true;
        this.authView.clearFeedback();
        this.authView.setBusy(true);

        let feedbackMessage;

        try {
            await this.authModel.login(username, password);
            feedbackMessage = 'Du bist erfolgreich angemeldet.';
        } catch (error) {
            feedbackMessage = error instanceof Error
                ? error.message
                : 'Die Anmeldung ist fehlgeschlagen.';
        } finally {
            this.isBusy = false;
            this.authView.setBusy(false);
            this.authView.setAuthenticated(this.authModel.isLoggedIn());
            this.authView.showFeedback(feedbackMessage);
        }
    }

    /**
     * Signs the user out and updates the interface.
     */
    async logout() {
        if (this.isBusy) {
            return;
        }

        this.isBusy = true;
        this.authView.clearFeedback();
        this.authView.setBusy(true);

        let feedbackMessage;

        try {
            await this.authModel.logout();
            feedbackMessage = 'Du bist erfolgreich abgemeldet.';
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Unbekannter Fehler.';

            feedbackMessage =
                `Die Abmeldung konnte nicht bestätigt werden. ${errorMessage}`;
        } finally {
            this.isBusy = false;
            this.authView.setBusy(false);
            this.authView.setAuthenticated(this.authModel.isLoggedIn());
            this.authView.showFeedback(feedbackMessage);
        }
    }
}