<section id="auth-section" class="card" aria-labelledby="auth-title">
    <h2 id="auth-title">Anmelden</h2>
    <p>Melde dich an, um Produkte und Kategorien zu verwalten.</p>

    <form id="login-form">
        <div class="form-field">
            <label for="username">Benutzername</label>
            <input
                type="text"
                id="username"
                name="username"
                autocomplete="username"
                required
            >
        </div>

        <div class="form-field">
            <label for="password">Passwort</label>
            <input
                type="password"
                id="password"
                name="password"
                autocomplete="current-password"
                required
            >
        </div>

        <button type="submit">Anmelden</button>
    </form>
</section>