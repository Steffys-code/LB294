/**
 * Displays products and manages product input.
 */
export class ProductView {
    /**
     * Creates the product form and selects existing elements.
     */
    constructor() {
        this.createButton = document.getElementById(
            'create-product-button'
        );
        this.listElement = document.getElementById('product-list');
        this.isBusy = false;
        this.editingSku = null;

        this.feedbackElement = document.createElement('p');
        this.feedbackElement.setAttribute('role', 'status');
        this.feedbackElement.setAttribute('aria-live', 'polite');

        this.form = document.createElement('form');
        this.form.id = 'product-form';
        this.form.hidden = true;

        this.form.innerHTML = `
            <h3 id="product-form-title">Produkt erstellen</h3>

            <div class="product-fields">
                <div class="form-field">
                    <label for="product-sku">SKU</label>
                    <input
                        id="product-sku"
                        name="sku"
                        type="text"
                        required
                    >
                </div>

                <div class="form-field">
                    <label for="product-name">Name</label>
                    <input
                        id="product-name"
                        name="name"
                        type="text"
                        required
                    >
                </div>

                <div class="form-field">
                    <label for="product-category">Kategorie</label>
                    <select
                        id="product-category"
                        name="id_category"
                        required
                    ></select>
                </div>

                <div class="form-field">
                    <label for="product-price">Preis</label>
                    <input
                        id="product-price"
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        required
                    >
                </div>

                <div class="form-field">
                    <label for="product-stock">Bestand</label>
                    <input
                        id="product-stock"
                        name="stock"
                        type="number"
                        min="0"
                        step="1"
                        required
                    >
                </div>

                <div class="form-field">
                    <label for="product-image">Bild-URL</label>
                    <input
                        id="product-image"
                        name="image"
                        type="url"
                        placeholder="https://..."
                    >
                </div>

                <div class="form-field product-field-wide">
                    <label for="product-description">
                        Beschreibung
                    </label>
                    <textarea
                        id="product-description"
                        name="description"
                        rows="4"
                    ></textarea>
                </div>
            </div>

            <label class="product-active">
                <input name="active" type="checkbox">
                Aktiv
            </label>

            <div class="product-actions">
                <button type="submit">Speichern</button>
                <button type="button" data-action="cancel">
                    Abbrechen
                </button>
            </div>
        `;

        this.form.setAttribute(
            'aria-labelledby',
            'product-form-title'
        );

        this.formTitle = this.form.querySelector('h3');
        this.skuInput = this.form.elements.namedItem('sku');
        this.nameInput = this.form.elements.namedItem('name');
        this.categoryInput = this.form.elements.namedItem('id_category');
        this.priceInput = this.form.elements.namedItem('price');
        this.stockInput = this.form.elements.namedItem('stock');
        this.imageInput = this.form.elements.namedItem('image');
        this.descriptionInput = this.form.elements.namedItem(
            'description'
        );
        this.activeInput = this.form.elements.namedItem('active');

        this.listElement.before(this.feedbackElement, this.form);
    }

    /**
     * Connects product creation.
     */
    bindCreate(handler) {
        this.createButton.addEventListener('click', () => {
            if (!this.isBusy) {
                handler();
            }
        });
    }

    /**
     * Connects form submission.
     */
    bindSave(handler) {
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();

            if (this.isBusy) {
                return;
            }

            handler(
                this.editingSku,
                this.skuInput.value,
                {
                    name: this.nameInput.value,
                    id_category: this.categoryInput.value,
                    price: this.priceInput.value,
                    stock: this.stockInput.value,
                    image: this.imageInput.value,
                    description: this.descriptionInput.value,
                    active: this.activeInput.checked
                }
            );
        });
    }

    /**
     * Connects form cancellation.
     */
    bindCancel(handler) {
        const button = this.form.querySelector(
            '[data-action="cancel"]'
        );

        button.addEventListener('click', () => {
            if (!this.isBusy) {
                handler();
            }
        });
    }

    /**
     * Connects product list actions.
     */
    bindActions(editHandler, deleteHandler) {
        this.listElement.addEventListener('click', (event) => {
            const button = event.target.closest('button[data-action]');

            if (!button || this.isBusy) {
                return;
            }

            if (button.dataset.action === 'edit') {
                editHandler(button.dataset.sku);
            } else if (button.dataset.action === 'delete') {
                deleteHandler(
                    button.dataset.sku,
                    button.dataset.name
                );
            }
        });
    }

    /**
     * Populates category options and opens the form.
     */
    showForm(categories, product = null) {
        this.form.reset();
        this.editingSku = product ? product.sku : null;

        this.formTitle.textContent = product
            ? 'Produkt bearbeiten'
            : 'Produkt erstellen';

        this.categoryInput.replaceChildren();

        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = 'Bitte auswählen';
        this.categoryInput.append(placeholder);

        for (const category of categories) {
            const option = document.createElement('option');
            const suffix = String(category.active) === '1'
                ? ''
                : ' (Inaktiv)';

            option.value = category.category_id;
            option.textContent = `${category.name}${suffix}`;
            this.categoryInput.append(option);
        }

        if (
            product &&
            !categories.some(
                (category) =>
                    String(category.category_id) ===
                    String(product.id_category)
            )
        ) {
            const option = document.createElement('option');

            option.value = product.id_category;
            option.textContent =
                `Kategorie ${product.id_category} (nicht geladen)`;

            this.categoryInput.append(option);
        }

        this.skuInput.value = product ? product.sku : '';
        this.skuInput.readOnly = product !== null;
        this.nameInput.value = product ? product.name : '';
        this.categoryInput.value = product
            ? String(product.id_category)
            : '';
        this.priceInput.value = product ? product.price : '0';
        this.stockInput.value = product ? product.stock : '0';
        this.imageInput.value = product ? product.image ?? '' : '';
        this.descriptionInput.value = product
            ? product.description ?? ''
            : '';
        this.activeInput.checked = product
            ? String(product.active) === '1'
            : true;

        this.form.hidden = false;
    }

    /**
     * Focuses the first editable product field.
     */
    focusForm() {
        if (this.editingSku === null) {
            this.skuInput.focus();
        } else {
            this.nameInput.focus();
        }
    }

    /**
     * Closes and resets the form.
     */
    hideForm() {
        this.form.hidden = true;
        this.form.reset();
        this.editingSku = null;
    }

    /**
     * Displays products and their category names.
     */
    render(products, categories) {
        this.listElement.replaceChildren();

        if (products.length === 0) {
            const message = document.createElement('p');
            message.textContent = 'Keine Produkte vorhanden.';
            this.listElement.append(message);
            return;
        }

        const list = document.createElement('ul');

        for (const product of products) {
            const item = document.createElement('li');
            const content = document.createElement('div');
            const title = document.createElement('h3');
            const metadata = document.createElement('p');
            const details = document.createElement('details');
            const summary = document.createElement('summary');
            const description = document.createElement('p');
            const actions = document.createElement('div');

            const category = categories.find(
                (entry) =>
                    String(entry.category_id) ===
                    String(product.id_category)
            );

            const categoryName = category
                ? category.name
                : `Kategorie ${product.id_category}`;

            const status = String(product.active) === '1'
                ? 'Aktiv'
                : 'Inaktiv';

            const price = Number(product.price);
            const formattedPrice = Number.isFinite(price)
                ? price.toLocaleString('de-CH', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })
                : '–';

            content.className = 'product-content';
            actions.className = 'product-actions';

            title.textContent = product.name;
            metadata.textContent =
                `SKU: ${product.sku} · ${categoryName} · ` +
                `${status} · Preis: ${formattedPrice} · ` +
                `Bestand: ${product.stock}`;

            summary.textContent = 'Produktdetails';
            description.textContent = product.description ||
                'Keine Beschreibung vorhanden.';

            details.append(summary, description);

            const imageUrl = this.getSafeImageUrl(product.image);

            if (imageUrl !== null) {
                const image = document.createElement('img');
                image.src = imageUrl;
                image.alt = product.name;
                image.loading = 'lazy';
                image.referrerPolicy = 'no-referrer';

                image.addEventListener('error', () => {
                    image.hidden = true;
                });

                details.append(image);
            }

            content.append(title, metadata, details);

            actions.append(
                this.createActionButton('Bearbeiten', 'edit', product),
                this.createActionButton('Löschen', 'delete', product)
            );

            item.append(content, actions);
            list.append(item);
        }

        this.listElement.append(list);
    }

    /**
     * Accepts only HTTP and HTTPS image URLs.
     */
    getSafeImageUrl(value) {
        if (!value) {
            return null;
        }

        try {
            const url = new URL(value);

            return ['https:', 'http:'].includes(url.protocol)
                ? url.href
                : null;
        } catch {
            return null;
        }
    }

    /**
     * Creates a product action button.
     */
    createActionButton(text, action, product) {
        const button = document.createElement('button');

        button.type = 'button';
        button.textContent = text;
        button.dataset.action = action;
        button.dataset.sku = product.sku;
        button.dataset.name = product.name;
        button.disabled = this.isBusy;

        button.setAttribute(
            'aria-label',
            `${product.name}: ${text}`
        );

        return button;
    }

    /**
     * Enables or disables product controls during requests.
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
     * Displays product feedback.
     */
    showFeedback(message) {
        this.feedbackElement.textContent = message;
    }

    /**
     * Requests confirmation before deletion.
     */
    confirmDelete(name) {
        return window.confirm(
            `Möchtest Du das Produkt "${name}" wirklich löschen?`
        );
    }

    /**
     * Focuses the create button.
     */
    focusCreateButton() {
        this.createButton.focus();
    }
}