/**
 * Manages product data and API requests.
 */
export class ProductModel {
    /**
     * Creates the product model.
     */
    constructor(apiService) {
        this.apiService = apiService;
    }

    /**
     * Loads all products.
     */
    async getAll() {
        const products = await this.apiService.request('/products');

        if (!Array.isArray(products)) {
            throw new Error(
                'Die API hat keine gültige Produktliste zurückgegeben.'
            );
        }

        return products;
    }

    /**
     * Loads a product by its SKU.
     */
    async getBySku(sku) {
        return this.apiService.request(
            `/product/${encodeURIComponent(sku)}`
        );
    }

    /**
     * Checks whether a SKU already exists.
     */
    async exists(sku) {
        try {
            await this.getBySku(sku);
            return true;
        } catch (error) {
            if (error.status === 404) {
                return false;
            }

            throw error;
        }
    }

    /**
     * Validates and saves a product.
     */
    async save(sku, values) {
        const normalizedSku = sku.trim();
        const normalizedName = values.name.trim();
        const categoryId = Number(values.id_category);
        const price = Number(values.price);
        const stock = Number(values.stock);

        if (normalizedSku === '' || normalizedName === '') {
            throw new Error('Bitte gib eine SKU und einen Namen ein.');
        }

        if (!Number.isInteger(categoryId) || categoryId <= 0) {
            throw new Error('Bitte wähle eine Kategorie aus.');
        }

        if (
            String(values.price).trim() === '' ||
            !Number.isFinite(price) ||
            price < 0
        ) {
            throw new Error('Bitte gib einen gültigen Preis ab 0 ein.');
        }

        if (
            String(values.stock).trim() === '' ||
            !Number.isInteger(stock) ||
            stock < 0
        ) {
            throw new Error(
                'Bitte gib einen ganzzahligen Bestand ab 0 ein.'
            );
        }

        const image = values.image.trim();

        if (image !== '') {
            let imageUrl;

            try {
                imageUrl = new URL(image);
            } catch {
                throw new Error('Bitte gib eine gültige Bild-URL ein.');
            }

            if (!['https:', 'http:'].includes(imageUrl.protocol)) {
                throw new Error(
                    'Die Bild-URL muss mit https:// oder http:// beginnen.'
                );
            }
        }

        const data = {
            active: values.active ? 1 : 0,
            id_category: categoryId,
            name: normalizedName,
            image: image,
            description: values.description.trim(),
            price: price,
            stock: stock
        };

        await this.apiService.request(
            `/product/${encodeURIComponent(normalizedSku)}`,
            'PUT',
            data
        );
    }

    /**
     * Deletes a product by its SKU.
     */
    async delete(sku) {
        await this.apiService.request(
            `/product/${encodeURIComponent(sku)}`,
            'DELETE'
        );
    }
}