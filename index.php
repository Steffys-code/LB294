<?php
$pageTitle = 'Produktverwaltung';
require_once __DIR__ . '/includes/header.php';
?>

<main id="main-content" class="container">
    <section class="page-intro" aria-labelledby="page-title">
        <h1 id="page-title">Produktverwaltung</h1>
        <p>Produkte und Kategorien zentral verwalten.</p>
    </section>

    <div id="feedback" role="status" aria-live="polite"></div>

    <?php require __DIR__ . '/includes/login.php'; ?>

    <!-- Display after successful authentication -->
    <div id="management-section" hidden>
        <section id="products" class="card" aria-labelledby="products-title">
            <div class="section-heading">
                <h2 id="products-title">Produkte</h2>

                <button type="button" id="create-product-button">
                    Produkt erstellen
                </button>
            </div>

            <div id="product-list"></div>
        </section>

        <section id="categories" class="card" aria-labelledby="categories-title">
            <div class="section-heading">
                <h2 id="categories-title">Kategorien</h2>

                <button type="button" id="create-category-button">
                    Kategorie erstellen
                </button>
            </div>

            <div id="category-list"></div>
        </section>
    </div>
</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>