const express = require('express');
const cors = require('cors');
const documentRoutes = require('./routes/documentRoutes');  // Importando o arquivo de rotas

const app = express();
const port = 5000;

// Middleware CORS: permitir requisições entre origens diferentes
app.use(cors());

// Middleware para parsing de JSON (não é necessário o body-parser)
app.use(express.json());  // Express já tem suporte para JSON nativamente

// Usar as rotas para atualizar a contagem
app.use('/api', documentRoutes);

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
