const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Pour servir les fichiers statiques (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Route pour télécharger un fichier spécifique
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, 'public', 'fichiers', filename);
  res.download(filepath, filename, err => {
    if (err) {
      console.error(err);
      res.status(404).send('Fichier non trouvé');
    }
  });
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
