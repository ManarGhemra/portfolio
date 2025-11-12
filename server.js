const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// خدمة الملفات الثابتة (HTML, CSS, JS)
app.use(express.static(__dirname));

// مسار تحميل الملفات
app.get('/download/:file', (req, res) => {
    const fileName = req.params.file;
    const filePath = path.join(__dirname, fileName);

    res.download(filePath, fileName, (err) => {
        if (err) {
            console.error('Erreur téléchargement:', err);
            res.status(404).send('Fichier introuvable');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

