const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Usa o body-parser para interpretar requisições JSON
app.use(bodyParser.json());

// Endpoint para verificar o webhook (requisito do WhatsApp)
app.get('/webhook', (req, res) => {
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token === 'SEU_TOKEN_DE_VERIFICACAO') {
        res.status(200).send(challenge);
    } else {
        res.status(403).send('Erro na verificação');
    }
});

// Endpoint que recebe mensagens do WhatsApp
app.post('/webhook', (req, res) => {
    let body = req.body;

    if (body.object) {
        // Verifica se a mensagem está presente no corpo da requisição
        if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
            let message = body.entry[0].changes[0].value.messages[0];
            let from = message.from; // O número de telefone que enviou a mensagem
            let msgBody = message.text.body; // O conteúdo da mensagem

            console.log('Mensagem recebida:', msgBody);

            // Aqui você pode processar a mensagem e decidir a resposta
            // Exemplo simples:
            if (msgBody.toLowerCase().includes('olá')) {
                // Responda aqui de acordo com a lógica
                console.log(`Respondendo "Olá" para o número: ${from}`);
            }
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

// Define a porta para o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
