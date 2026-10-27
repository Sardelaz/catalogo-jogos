import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rota Proxy para buscar os jogos na API GamerPower
app.get('/api/giveaways', async (req, res) => {
    try {
        const { platform, type } = req.query;
        let apiUrl = 'https://www.gamerpower.com/api/giveaways';
        
        const params = new URLSearchParams();
        if (platform) params.append('platform', platform);
        if (type) params.append('type', type);
        
        if (params.toString()) {
            apiUrl += `?${params.toString()}`;
        }

        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            return res.status(response.status).json({ error: 'Erro ao consultar a GamerPower API' });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Erro no servidor:', error);
        res.status(500).json({ error: 'Falha interna ao buscar jogos.' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});