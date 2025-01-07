import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors'; // Importe o middleware CORS

const app = express();
const port = 3000;
const token = "sk-8cf6826a4fd0d3e472ead62d6b37feeb";

// Habilite CORS para permitir apenas domínios de sharpos.ai
app.use(cors());

// Defina a rota /api
app.get('/api', async (req, res, next) => {
    const { directory, body } = req.query; // Pega os parâmetros da query string

    // Verifique se "directory" e "body" estão presentes
    if (!directory || !body) {
        return res.status(400).json({ error: 'Parâmetros "directory" e "body" são obrigatórios.' });
    }

    console.log("Diretory:", directory, " Body:", body);

    const url = `https://rebyte.ai/${directory}`;

    const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };

    // Se o corpo estiver em formato de string JSON, converta-o em um objeto JavaScript
    let parsedBody = {};
    try {
        parsedBody = JSON.parse(body);
    } catch (error) {
        return res.status(400).json({ error: 'Corpo da requisição inválido.' });
    }

    try {
        const response = await fetch(url, {
            method: "POST", // O método continua POST
            headers: headers,
            body: JSON.stringify(parsedBody), // Envia o body como string JSON
        });

        if (!response.ok) {
            throw new Error('Erro na resposta da API externa');
        }

        const data = await response.json(); // Usando .json() em vez de .text() para obter o JSON
        res.json(data); // Envia a resposta da API para o cliente
    } catch (error) {
        // Passando o erro para o middleware global
        next(error);
    }
});

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err); // Loga o erro para depuração

    // Verifica se o erro é de resposta da API externa ou erro geral
    if (err.message === 'Erro na resposta da API externa') {
        return res.status(502).json({ error: 'Falha ao comunicar com a API externa.' });
    }

    // Se não for erro esperado, retorna erro 500 (erro genérico)
    res.status(500).json({ error: 'Ocorreu um erro inesperado na aplicação.' });
});

// Inicie o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
