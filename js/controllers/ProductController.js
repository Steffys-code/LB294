/**
 * Coordinates product actions between models and view.
 */
export class ProductController {
    /**
     * Creates the product controller.
     */
    constructor(productModel, productView, categoryModel) {
        this.productModel = productModel;
        this.productView = productView;
        this.categoryModel = categoryModel;
        this.isBusy = false;
    }

    /**
     * Connects product actions.
     */
    initialize() {
        this.productView.bindCreate(() => {
            this.create();
        });

        this.productView.bindCancel(() => {
            this.productView.hideForm();
            this.productView.focusCreateButton();
        });

        this.productView.bindSave((editingSku, sku, values) => {
            this.save(editingSku, sku, values);
        });

        this.productView.bindActions(
            (sku) => {
                this.edit(sku);
            },
            (sku, name) => {
                this.delete(sku, name);
            }
        );
    }

    /**
     * Loads and displays all products.
     */
    async loadProducts() {
        await this.runAction(async () => {
            await this.refreshList();
        });
    }

    /**
     * Refreshes products and category labels.
     */
    async refreshList() {
        const products = await this.productModel.getAll();

        let categories = [];

        try {
            categories = await this.categoryModel.getAll();
        } catch {
            this.productView.showFeedback(
                'Die Produkte wurden geladen, die Kategorienamen jedoch nicht.'
            );
        }

        this.productView.render(products, categories);
    }

    /**
     * Opens an empty product form.
     */
    async create() {
        const succeeded = await this.runAction(async () => {
            const categories = await this.categoryModel.getAll();

            if (categories.length === 0) {
                throw new Error(
                    'Bitte erstelle zuerst eine Kategorie.'
                );
            }

            this.productView.showForm(categories);
        });

        if (succeeded) {
            this.productView.focusForm();
        }
    }

    /**
     * Loads a product and opens the edit form.
     */
    async edit(sku) {
        const succeeded = await this.runAction(async () => {
            const product = await this.productModel.getBySku(sku);
            const categories = await this.categoryModel.getAll();

            this.productView.showForm(categories, product);
        });

        if (succeeded) {
            this.productView.focusForm();
        }
    }

    /**
     * Creates or updates a product.
     */
    async save(editingSku, sku, values) {
        const succeeded = await this.runAction(async () => {
            const targetSku = editingSku === null
                ? sku.trim()
                : editingSku;

            if (targetSku === '') {
                throw new Error('Bitte gib eine SKU ein.');
            }

            if (
                editingSku === null &&
                await this.productModel.exists(targetSku)
            ) {
                throw new Error(
                    'Diese SKU existiert bereits. ' +
                    'Bitte bearbeite das vorhandene Produkt ' +
                    'oder verwende eine andere SKU.'
                );
            }

            await this.productModel.save(targetSku, values);

            this.productView.hideForm();

            await this.refreshAfterChange(
                'Das Produkt wurde gespeichert.'
            );
        });

        if (succeeded) {
            this.productView.focusCreateButton();
        }
    }

    /**
     * Deletes a product after confirmation.
     */
    async delete(sku, name) {
        if (this.isBusy || !this.productView.confirmDelete(name)) {
            return;
        }

        const succeeded = await this.runAction(async () => {
            await this.productModel.delete(sku);

            this.productView.hideForm();

            await this.refreshAfterChange(
                'Das Produkt wurde gelöscht.'
            );
        });

        if (succeeded) {
            this.productView.focusCreateButton();
        }
    }

    /**
     * Separates successful writes from failed list refreshes.
     */
    async refreshAfterChange(message) {
        this.productView.showFeedback(message);

        try {
            await this.refreshList();
        } catch {
            this.productView.showFeedback(
                `${message} Die Liste konnte jedoch nicht ` +
                'neu geladen werden.'
            );
        }
    }

    /**
     * Runs an action with shared busy and error handling.
     */
    async runAction(action) {
        if (this.isBusy) {
            return false;
        }

        this.isBusy = true;
        this.productView.setBusy(true);
        this.productView.showFeedback('');

        try {
            await action();
            return true;
        } catch (error) {
            this.productView.showFeedback(
                error instanceof Error
                    ? error.message
                    : 'Die Produkt-Aktion ist fehlgeschlagen.'
            );

            return false;
        } finally {
            this.isBusy = false;
            this.productView.setBusy(false);
        }
    }
}