require('dotenv').config();  // Carregar variáveis de ambiente do arquivo .env

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

// Configuração do DynamoDB com credenciais da AWS
const dynamoDB = new DynamoDBClient({
  region: process.env.AWS_REGION,  // Região configurada no .env
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,  // A chave de acesso do .env
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,  // A chave secreta do .env
  },
});

module.exports = { dynamoDB };
