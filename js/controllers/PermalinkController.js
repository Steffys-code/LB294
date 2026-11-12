/**
 * Creates permanent record URLs and opens linked records after login.
 */
export class PermalinkController {
    /**
     * Connects authentication, record controllers, and feedback.
     */
    constructor(
        authModel,
        productController,
        categoryController,
        authView
    ) {
        this.authModel = authModel;
        this.productController = productController;
        this.categoryController = categoryController;
        this.authView = authView;
    }

    /**
     * Creates a URL using the current application path.
     */
    static createUrl(recordType, identifier) {
        if (!['product', 'category'].includes(recordType)) {
            throw new Error('Der Datensatztyp wird nicht unterstützt.');
        }

        const recordIdentifier = String(identifier);

        if (recordIdentifier.trim() === '') {
            throw new Error('Die Datensatzkennung fehlt.');
        }

        const url = new URL(window.location.href);

        // Replace previous record parameters and section anchors.
        url.searchParams.delete('product');
        url.searchParams.delete('category');
        url.hash = '';

        // URLSearchParams encodes special characters automatically.
        url.searchParams.set(recordType, recordIdentifier);

        return url.href;
    }

    /**
     * Opens the linked record only after successful authentication.
     */
    async openCurrentRecord() {
        if (!this.authModel.isLoggedIn()) {
            return;
        }

        const url = new URL(window.location.href);

        const productIdentifiers = url.searchParams.getAll('product');
        const categoryIdentifiers = url.searchParams.getAll('category');

        if (
            productIdentifiers.length === 0 &&
            categoryIdentifiers.length === 0
        ) {
            return;
        }

        // A permalink must identify exactly one record.
        if (
            productIdentifiers.length + categoryIdentifiers.length !== 1
        ) {
            this.authView.showFeedback(
                'Der Permalink ist ungültig. ' +
                'Er muss genau ein Produkt oder eine Kategorie angeben.'
            );

            return;
        }

        const isProduct = productIdentifiers.length === 1;
        const identifier = isProduct
            ? productIdentifiers[0]
            : categoryIdentifiers[0];

        if (identifier.trim() === '') {
            this.authView.showFeedback(
                'Der Permalink ist ungültig. Die Datensatzkennung fehlt.'
            );

            return;
        }

        // Existing controllers load current API data and display errors.
        if (isProduct) {
            await this.productController.edit(identifier);
        } else {
            await this.categoryController.edit(identifier);
        }
    }
}