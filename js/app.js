import { ApiService } from './services/ApiService.js';
import { AuthModel } from './models/AuthModel.js';
import { AuthView } from './views/AuthView.js';
import { AuthController } from './controllers/AuthController.js';
import { CategoryModel } from './models/CategoryModel.js';
import { CategoryView } from './views/CategoryView.js';
import { CategoryController } from './controllers/CategoryController.js';

/**
 * Creates and connects the application components.
 */
function initializeApplication() {
    const apiService = new ApiService();

    const categoryModel = new CategoryModel(apiService);
    const categoryView = new CategoryView();
    const categoryController = new CategoryController(
        categoryModel,
        categoryView
    );

    categoryController.initialize();

    const authModel = new AuthModel(apiService);
    const authView = new AuthView();

    const authController = new AuthController(
        authModel,
        authView,
        () => categoryController.loadCategories()
    );

    authController.initialize();
}

initializeApplication();