const express = require('express');
const { dynamoDB, UpdateItemCommand } = require('../config/awsConfig');

const router = express.Router();

// Rota para atualizar a contagem no DynamoDB
router.post('/update', async (req, res) => {
  const { type, count, numero } = req.body;

  console.log('Dados recebidos no back-end:', { type, count, numero });  // Log para depuração

  // Validação do tipo de documento (tipos válidos)
  const validTypes = ['Memorando', 'MemorandoCircular', 'Oficio', 'OficioCircular', 'Atestado', 'Declaracao'];

  // Verificar se o tipo de documento é válido
  if (!validTypes.includes(type)) {
    console.log('Tipo de documento inválido:', type);
    return res.status(400).send('Tipo de documento inválido');
  }

  // Definir os parâmetros para a atualização no DynamoDB
  const params = {
    TableName: 'Memorando',  // Nome da tabela, fixo para 'Memorando'
    Key: {
      type: { S: type },         // Chave de Partição (type)
      numero: { N: String(numero) }, // Chave de Ordenação (numero)
    },
    UpdateExpression: 'set count = :count',  // Atualiza o campo 'count'
    ExpressionAttributeValues: {
      ':count': { N: String(count) },  // O valor de count, deve ser passado como número
    },
  };

  try {
    // Enviar o comando de atualização para o DynamoDB
    const command = new UpdateItemCommand(params);
    await dynamoDB.send(command);
    
    // Responder com sucesso
    console.log('Contagem atualizada com sucesso!');
    return res.status(200).send('Contagem atualizada com sucesso');
  } catch (error) {
    console.error('Erro ao atualizar contagem:', error);  // Log de erro
    return res.status(500).send('Erro ao atualizar contagem');
  }
});

module.exports = router;
