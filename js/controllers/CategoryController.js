/**
 * Coordinates category actions between the model and the view.
 */
export class CategoryController {
    /**
     * Creates the category controller.
     */
    constructor(categoryModel, categoryView) {
        this.categoryModel = categoryModel;
        this.categoryView = categoryView;
        this.isBusy = false;
    }

    /**
     * Connects category actions.
     */
    initialize() {
        this.categoryView.bindCreate(() => {
            this.categoryView.showFeedback('');
            this.categoryView.showForm();
        });

        this.categoryView.bindCancel(() => {
            this.categoryView.hideForm();
        });

        this.categoryView.bindSave((categoryId, name, active) => {
            this.save(categoryId, name, active);
        });

        this.categoryView.bindActions(
            (categoryId) => {
                this.edit(categoryId);
            },
            (categoryId, name) => {
                this.delete(categoryId, name);
            }
        );
    }

    /**
     * Loads and displays all categories.
     */
    async loadCategories() {
        await this.runAction(async () => {
            await this.refreshList();
        });
    }

    /**
     * Refreshes the list without starting another action.
     */
    async refreshList() {
        const categories = await this.categoryModel.getAll();

        this.categoryView.render(categories);
    }

    /**
     * Loads the current category before editing.
     */
    async edit(categoryId) {
        await this.runAction(async () => {
            const category = await this.categoryModel.getById(
                categoryId
            );

            this.categoryView.showForm(category);
        });

        if (!this.categoryView.form.hidden) {
            this.categoryView.nameInput.focus();
        }
    }

    /**
     * Creates or updates a category.
     */
    async save(categoryId, name, active) {
        await this.runAction(async () => {
            if (categoryId === null) {
                await this.categoryModel.create(name, active);
            } else {
                await this.categoryModel.update(
                    categoryId,
                    name,
                    active
                );
            }

            this.categoryView.hideForm();
            this.categoryView.showFeedback(
                'Die Kategorie wurde gespeichert.'
            );

            try {
                await this.refreshList();
            } catch {
                this.categoryView.showFeedback(
                    'Die Kategorie wurde gespeichert. ' +
                    'Die Liste konnte jedoch nicht neu geladen werden.'
                );
            }
        });

        this.categoryView.createButton.focus();
    }

    /**
     * Deletes a category after confirmation.
     */
    async delete(categoryId, name) {
        if (this.isBusy || !this.categoryView.confirmDelete(name)) {
            return;
        }

        await this.runAction(async () => {
            try {
                await this.categoryModel.delete(categoryId);
            } catch (error) {
                if (error.status === 500) {
                    throw new Error(
                        'Die Kategorie konnte nicht gelöscht werden. ' +
                        'Möglicherweise sind ihr noch Produkte zugeordnet ' +
                        'oder es liegt ein anderer API-Fehler vor.'
                    );
                }

                throw error;
            }

            this.categoryView.showFeedback(
                'Die Kategorie wurde gelöscht.'
            );

            try {
                await this.refreshList();
            } catch {
                this.categoryView.showFeedback(
                    'Die Kategorie wurde gelöscht. ' +
                    'Die Liste konnte jedoch nicht neu geladen werden.'
                );
            }
        });

        this.categoryView.createButton.focus();
    }

    /**
     * Runs an action with shared busy and error handling.
     */
    async runAction(action) {
        if (this.isBusy) {
            return;
        }

        this.isBusy = true;
        this.categoryView.setBusy(true);
        this.categoryView.showFeedback('');

        try {
            await action();
        } catch (error) {
            this.categoryView.showFeedback(
                error instanceof Error
                    ? error.message
                    : 'Die Kategorie-Aktion ist fehlgeschlagen.'
            );
        } finally {
            this.isBusy = false;
            this.categoryView.setBusy(false);
        }
    }
}