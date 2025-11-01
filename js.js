<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Portfolio — Ghemra Manar</title>
  <link rel="stylesheet" href="css.css" />
</head>
<body>
  <div class="bg">
    <div class="blob b1"></div>
    <div class="blob b2"></div>
    <div class="grid-glow"></div>
  </div>

  <header class="top">
    <div class="top-left">
      <h1 class="name">Ghemra <span>Manar</span></h1>
      <p class="role">Développeuse Web • Ingénierie des Données</p>
    </div>
    <div class="top-right no-print">
      <button class="btn ghost" onclick="window.location='admin.html'">🔒 Admin</button>
      <button class="btn" id="downloadBtn">⬇️ Télécharger CV</button>
    </div>
  </header>

  <main class="wrap">
    <section class="card intro reveal">
      <div class="profile">
        <img src="photo.jpg" alt="photo manar" />
      </div>
      <div class="bio">
        <h2>À propos</h2>
        <p>Je m'appelle <strong>Ghemra Manar</strong>, née le <strong>22/08/2003</strong>. Étudiante en <em>Master 1 Ingénierie des Données et Technologies Web</em>. Passionnée par le développement web, IA et expériences utilisateurs élégantes.</p>
        <div class="contact-row">
          <a href="mailto:ghemramanar8@gmail.com" class="link">✉ ghemramanar8@gmail.com</a>
          <span class="sep">•</span>
          <a href="tel:+213779532854" class="link">📞 0779 53 28 54</a>
          <span class="sep">•</span>
          <span class="muted">📍 Sétif, Algérie</span>
        </div>
      </div>
    </section>

    <section class="card reveal">
      <h2 class="section-title">Formation</h2>
      <ul class="list">
        <li><strong>2024 – 2025 :</strong> Master 1 — Ingénierie des Données et Technologies Web, Université Ferhat Abbas Sétif 1</li>
        <li><strong>2021 – 2024 :</strong> Licence en Mathématiques et Informatique — Université Ferhat Abbas Sétif 1</li>
      </ul>
    </section>

    <section class="card reveal">
      <h2 class="section-title">Expériences</h2>
      <ul class="list">
        <li>Stage d’un mois en enseignement d’informatique (niveau CEM)</li>
      </ul>
    </section>

    <section class="card reveal" id="projects-section">
      <h2 class="section-title">Projets récents</h2>
      <div id="project-list" class="projects-grid">
        <!-- Projets statiques (HTML original) -->
        <div class="project-card">
          <h3>Chatbot universitaire</h3>
          <p>Répond aux questions concernant la faculté.</p>
          <a href="#" target="_blank" class="btn ghost">Voir le projet</a>
        </div>
        <div class="project-card">
          <h3>API REST avec FastAPI</h3>
          <p>Fusion de plusieurs fichiers PDF.</p>
          <a href="#" target="_blank" class="btn ghost">Voir le projet</a>
        </div>
        <div class="project-card">
          <h3>Site web de shopping</h3>
          <p>Produits féminins.</p>
          <a href="#" target="_blank" class="btn ghost">Voir le projet</a>
        </div>
        <div class="project-card">
          <h3>Site web de prévisions météorologiques</h3>
          <p>Météo en temps réel.</p>
          <a href="#" target="_blank" class="btn ghost">Voir le projet</a>
        </div>
        <div class="project-card">
          <h3>Site scientifique sur l’espace</h3>
          <p>Vulgarisation des découvertes spatiales.</p>
          <a href="#" target="_blank" class="btn ghost">Voir le projet</a>
        </div>
        <div class="project-card">
          <h3>Portfolio personnel</h3>
          <p>Mon site web moderne et responsive présentant mes projets et compétences.</p>
          <a href="https://moccasin-issi-75.tiiny.site/" target="_blank" class="btn ghost">Voir le projet</a>
        </div>
      </div>
    </section>

    <section class="card reveal">
      <h2 class="section-title">Compétences</h2>
      <div class="chips">
        <span>C++</span><span>Java</span><span>Python</span><span>HTML</span><span>CSS</span><span>JavaScript</span>
        <span>FastAPI</span><span>Flask</span><span>MySQL</span><span>Oracle</span><span>Git</span><span>VS Code</span>
      </div>
    </section>

    <section class="card reveal">
      <h2 class="section-title">Activités & Langues</h2>
      <p><strong>Activités :</strong> Membre & organisatrice du Sétifian Scientific Club (SESC)</p>
      <p><strong>Langues :</strong> Arabe (natif), Français (bien), Anglais (intermédiaire)</p>
    </section>

    <section class="card contact-card reveal no-print">
      <h2 class="section-title">Contact</h2>
      <p>Envoyer un message directement (ouvre votre client mail).</p>
      <div class="contact-actions">
        <a class="btn" href="mailto:ghemramanar8@gmail.com?subject=Contact%20via%20Portfolio">✉ Envoyer un mail</a>
        <button class="btn ghost" id="printBtn">🖨 Imprimer / Enregistrer en PDF</button>
      </div>
    </section>
  </main>

  <footer class="foot">
    <p>© 2025 — <strong>Ghemra Manar</strong> • Portfolio</p>
  </footer>

  <script src="js.js"></script>
</body>
</html>
