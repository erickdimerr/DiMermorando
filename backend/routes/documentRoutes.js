const express = require('express');
const { UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { dynamoDB } = require('../config/awsConfig');

const router = express.Router();

// Rota para atualizar a contagem no DynamoDB
router.post('/update', async (req, res) => {
  const { type, count } = req.body;  // Remover 'numero', pois não temos chave de ordenação

  console.log('Dados recebidos no back-end:', { type, count });

  // Validação do tipo de documento (tipos válidos)
  const validTypes = ['Memorando', 'MemorandoCircular', 'Oficio', 'OficioCircular', 'Atestado', 'Declaracao'];

  // Verificar se o tipo de documento é válido
  if (!validTypes.includes(type)) {
    console.log('Tipo de documento inválido:', type);
    return res.status(400).send('Tipo de documento inválido');
  }

  // Definir os parâmetros para a atualização no DynamoDB
  const params = {
    TableName: 'Memorando',  // Nome da tabela
    Key: {
      type: { S: type },         // Chave de Partição (type)
    },
    UpdateExpression: 'set #count = :count',  // Usar #count para evitar palavra reservada
    ExpressionAttributeNames: {
      '#count': 'count'  // Mapear #count para count
    },
    ExpressionAttributeValues: {
      ':count': { N: String(count) },  // O valor de count, deve ser passado como número
    },
  };

  try {
    // Criar o comando de atualização para enviar ao DynamoDB
    const command = new UpdateItemCommand(params);

    // Enviar o comando de atualização para o DynamoDB
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
