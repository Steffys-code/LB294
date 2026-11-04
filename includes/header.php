<!DOCTYPE html>
<html lang="de-CH">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title><?= htmlspecialchars(
        $pageTitle ?? 'Produktverwaltung',
        ENT_QUOTES,
        'UTF-8'
    ) ?></title>

    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <a class="skip-link" href="#main-content">Zum Inhalt springen</a>

    <header class="site-header">
        <div class="container header-content">
            <a class="brand" href="index.php">Produktverwaltung</a>

            <nav id="main-navigation" aria-label="Hauptnavigation" hidden>
                <a href="#products">Produkte</a>
                <a href="#categories">Kategorien</a>
                <button type="button" id="logout-button">Abmelden</button>
            </nav>
        </div>
    </header>