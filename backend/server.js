const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const documentRoutes = require('./routes/documentRoutes');  // Importando o arquivo de rotas

const app = express();
const port = 5000;

// Middleware CORS: permitir requisições entre origens diferentes
app.use(cors());

// Middleware para parsing de JSON
app.use(bodyParser.json());

// Usar as rotas para atualizar a contagem
app.use('/api', documentRoutes);

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
