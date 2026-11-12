import { ApiService } from './services/ApiService.js';
import { AuthModel } from './models/AuthModel.js';
import { AuthView } from './views/AuthView.js';
import { AuthController } from './controllers/AuthController.js';
import { CategoryModel } from './models/CategoryModel.js';
import { CategoryView } from './views/CategoryView.js';
import { CategoryController } from './controllers/CategoryController.js';
import { ProductModel } from './models/ProductModel.js';
import { ProductView } from './views/ProductView.js';
import { ProductController } from './controllers/ProductController.js';
import { PermalinkController } from './controllers/PermalinkController.js';

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

    const productModel = new ProductModel(apiService);
    const productView = new ProductView();
    const productController = new ProductController(
        productModel,
        productView,
        categoryModel
    );

    productController.initialize();

    const authModel = new AuthModel(apiService);
    const authView = new AuthView();

    const permalinkController = new PermalinkController(
        authModel,
        productController,
        categoryController,
        authView
    );

    const authController = new AuthController(
        authModel,
        authView,
        async () => {
            await categoryController.loadCategories();
            await productController.loadProducts();
            await permalinkController.openCurrentRecord();
        }
    );

    authController.initialize();
}

initializeApplication();