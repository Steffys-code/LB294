/**
 * Displays categories and manages category input.
 */
export class CategoryView {
    /**
     * Selects existing elements and creates the category form.
     */
    constructor() {
        this.createButton = document.getElementById(
            'create-category-button'
        );
        this.listElement = document.getElementById('category-list');

        this.isBusy = false;
        this.editingId = null;

        this.form = document.createElement('form');
        this.form.hidden = true;

        this.formTitle = document.createElement('h3');

        const nameLabel = document.createElement('label');
        nameLabel.htmlFor = 'category-name';
        nameLabel.textContent = 'Name';

        this.nameInput = document.createElement('input');
        this.nameInput.id = 'category-name';
        this.nameInput.name = 'name';
        this.nameInput.type = 'text';
        this.nameInput.required = true;

        const activeLabel = document.createElement('label');

        this.activeInput = document.createElement('input');
        this.activeInput.type = 'checkbox';
        this.activeInput.name = 'active';

        activeLabel.append(this.activeInput, ' Aktiv');

        this.saveButton = document.createElement('button');
        this.saveButton.type = 'submit';
        this.saveButton.textContent = 'Speichern';

        this.cancelButton = document.createElement('button');
        this.cancelButton.type = 'button';
        this.cancelButton.textContent = 'Abbrechen';

        this.feedbackElement = document.createElement('p');
        this.feedbackElement.setAttribute('role', 'status');
        this.feedbackElement.setAttribute('aria-live', 'polite');

        this.listElement.before(
            this.feedbackElement,
            this.form
        );

        this.form.append(
            this.formTitle,
            nameLabel,
            this.nameInput,
            activeLabel,
            this.saveButton,
            this.cancelButton
        );
    }

    /**
     * Connects category creation.
     */
    bindCreate(handler) {
        this.createButton.addEventListener('click', () => {
            if (!this.isBusy) {
                handler();
            }
        });
    }

    /**
     * Connects category form submission.
     */
    bindSave(handler) {
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();

            if (this.isBusy) {
                return;
            }

            handler(
                this.editingId,
                this.nameInput.value,
                this.activeInput.checked
            );
        });
    }

    /**
     * Connects cancellation.
     */
    bindCancel(handler) {
        this.cancelButton.addEventListener('click', () => {
            if (!this.isBusy) {
                handler();
            }
        });
    }

    /**
     * Connects category list actions.
     */
    bindActions(editHandler, deleteHandler) {
        this.listElement.addEventListener('click', (event) => {
            const button = event.target.closest('button[data-action]');

            if (!button || this.isBusy) {
                return;
            }

            if (button.dataset.action === 'edit') {
                editHandler(button.dataset.id);
            } else if (button.dataset.action === 'delete') {
                deleteHandler(
                    button.dataset.id,
                    button.dataset.name
                );
            }
        });
    }

    /**
     * Displays categories without interpreting API values as HTML.
     */
    render(categories) {
        this.listElement.replaceChildren();

        if (categories.length === 0) {
            const message = document.createElement('p');
            message.textContent = 'Keine Kategorien vorhanden.';
            this.listElement.append(message);
            return;
        }

        const list = document.createElement('ul');

        for (const category of categories) {
            const item = document.createElement('li');
            const label = document.createElement('span');

            const status = String(category.active) === '1'
                ? 'Aktiv'
                : 'Inaktiv';

            label.textContent = `${category.name} (${status}) `;

            const editButton = this.createActionButton(
                'Bearbeiten',
                'edit',
                category
            );

            const deleteButton = this.createActionButton(
                'Löschen',
                'delete',
                category
            );

            item.append(label, editButton, ' ', deleteButton);
            list.append(item);
        }

        this.listElement.append(list);
    }

    /**
     * Creates an accessible category action button.
     */
    createActionButton(text, action, category) {
        const button = document.createElement('button');

        button.type = 'button';
        button.textContent = text;
        button.dataset.action = action;
        button.dataset.id = category.category_id;
        button.dataset.name = category.name;
        button.disabled = this.isBusy;

        button.setAttribute(
            'aria-label',
            `${category.name}: ${text}`
        );

        return button;
    }

    /**
     * Opens the form for creation or editing.
     */
    showForm(category = null) {
        this.editingId = category ? category.category_id : null;

        this.formTitle.textContent = category
            ? 'Kategorie bearbeiten'
            : 'Kategorie erstellen';

        this.nameInput.value = category ? category.name : '';
        this.activeInput.checked = category
            ? String(category.active) === '1'
            : true;

        this.form.hidden = false;
        this.nameInput.focus();
    }

    /**
     * Closes and resets the form.
     */
    hideForm() {
        this.form.hidden = true;
        this.form.reset();
        this.editingId = null;
        this.createButton.focus();
    }

    /**
     * Enables or disables category controls during requests.
     */
    setBusy(isBusy) {
        this.isBusy = isBusy;
        this.createButton.disabled = isBusy;

        for (const control of this.form.elements) {
            control.disabled = isBusy;
        }

        for (const button of this.listElement.querySelectorAll('button')) {
            button.disabled = isBusy;
        }

        this.form.setAttribute('aria-busy', String(isBusy));
        this.listElement.setAttribute('aria-busy', String(isBusy));
    }

    /**
     * Displays category feedback.
     */
    showFeedback(message) {
        this.feedbackElement.textContent = message;
    }

    /**
     * Requests confirmation before deletion.
     */
    confirmDelete(name) {
        return window.confirm(
            `Möchtest Du die Kategorie "${name}" wirklich löschen?`
        );
    }
}