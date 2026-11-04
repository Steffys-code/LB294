import { ApiService } from './services/ApiService.js';
import { AuthModel } from './models/AuthModel.js';
import { AuthView } from './views/AuthView.js';
import { AuthController } from './controllers/AuthController.js';

/**
 * Creates and connects the authentication components.
 */
function initializeApplication() {
    const apiService = new ApiService();
    const authModel = new AuthModel(apiService);
    const authView = new AuthView();

    const authController = new AuthController(authModel, authView);

    authController.initialize();
}

initializeApplication();