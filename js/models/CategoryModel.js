/**
 * Manages category data and API requests.
 */
export class CategoryModel {
    /**
     * Creates the category model.
     */
    constructor(apiService) {
        this.apiService = apiService;
    }

    /**
     * Loads all categories.
     */
    async getAll() {
        return this.apiService.request('/categories');
    }

    /**
     * Loads a category by its ID.
     */
    async getById(categoryId) {
        return this.apiService.request(
            `/category/${encodeURIComponent(categoryId)}`
        );
    }

    /**
     * Creates a category.
     */
    async create(name, active) {
        const data = this.prepareData(name, active);

        await this.apiService.request('/category', 'POST', data);
    }

    /**
     * Updates a category.
     */
    async update(categoryId, name, active) {
        const data = this.prepareData(name, active);

        await this.apiService.request(
            `/category/${encodeURIComponent(categoryId)}`,
            'PATCH',
            data
        );
    }

    /**
     * Deletes a category.
     */
    async delete(categoryId) {
        await this.apiService.request(
            `/category/${encodeURIComponent(categoryId)}`,
            'DELETE'
        );
    }

    /**
     * Validates and prepares category input.
     */
    prepareData(name, active) {
        const normalizedName = name.trim();

        if (normalizedName === '') {
            throw new Error('Bitte gib einen Kategorienamen ein.');
        }

        return {
            name: normalizedName,
            active: active ? 1 : 0
        };
    }
}