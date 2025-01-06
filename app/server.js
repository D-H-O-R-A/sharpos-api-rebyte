import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors'; // Importe o middleware CORS

const app = express();
const port = 3000;
const token = "sk-8cf6826a4fd0d3e472ead62d6b37feeb";

// Habilite CORS para permitir apenas domínios de sharpos.ai
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = /^(https?:\/\/(?:[a-zA-Z0-9-]+\.)?sharpos\.ai)$/;
        if (allowedOrigins.test(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Não autorizado pelo CORS'));
        }
    }
}));

// Defina a rota /api
app.get('/api', async (req, res) => {
    const { directory, body } = req.query; // Pega os parâmetros da query string
    
    // Verifique se "directory" e "body" estão presentes
    if (!directory || !body) {
        return res.status(400).json({ error: 'Parâmetros "directory" e "body" são obrigatórios.' });
    }

    const url = `https://rebyte.ai/${directory}`;
    
    const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
    
    // Parse o body para um objeto JavaScript
    const parsedBody = JSON.parse(body);

    try {
        const response = await fetch(url, {
            method: "POST", // O método continua POST
            headers: headers,
            body: JSON.stringify(parsedBody), // Envia o body como string JSON
        });

        const data = await response.json();
        res.json(data); // Envia a resposta da API para o cliente
    } catch (error) {
        console.error(error); // Para debugar possíveis erros
        res.status(500).json({ error: 'Erro ao fazer a requisição à API' });
    }
});

// Inicie o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
