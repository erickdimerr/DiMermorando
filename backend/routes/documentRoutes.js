const express = require('express');
const { UpdateItemCommand, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { dynamoDB } = require('../config/awsConfig');

const router = express.Router();

// Rota POST para atualizar a contagem no DynamoDB
router.post('/update', async (req, res) => {
  const { type, count, numero } = req.body;

  console.log('Dados recebidos no back-end:', { type, count, numero });

  // Validação do tipo de documento (tipos válidos)
  const validTypes = ['Memorando', 'MemorandoCircular', 'Oficio', 'OficioCircular', 'Atestado', 'Declaracao'];

  // Verificar se o tipo de documento é válido
  if (!validTypes.includes(type)) {
    console.log('Tipo de documento inválido:', type);
    return res.status(400).send('Tipo de documento inválido');
  }

  // Recuperar o valor atual de count do DynamoDB para o tipo de documento
  const paramsGet = {
    TableName: 'documents',
    Key: {
      type: { S: type },
    },
  };

  try {
    const getCommand = new GetItemCommand(paramsGet);
    const data = await dynamoDB.send(getCommand);

    let currentCount = 0;
    if (data.Item && data.Item.count) {
      currentCount = parseInt(data.Item.count.N, 10); // Obter o valor atual de count do DynamoDB
    }

    const newCount = currentCount + count; // Incrementar a contagem existente com a contagem recebida

    // Definir os parâmetros para a atualização no DynamoDB
    const paramsUpdate = {
      TableName: 'documents',  // Nome da tabela
      Key: {
        type: { S: type },
      },
      UpdateExpression: 'set #count = :count', // Usar #count para evitar palavra reservada
      ExpressionAttributeNames: {
        '#count': 'count',
      },
      ExpressionAttributeValues: {
        ':count': { N: String(newCount) }, // O novo valor de count, após o incremento
      },
    };

    const command = new UpdateItemCommand(paramsUpdate);
    await dynamoDB.send(command);

    // Responder com sucesso
    console.log('Contagem atualizada com sucesso!');
    return res.status(200).send('Contagem atualizada com sucesso');
  } catch (error) {
    console.error('Erro ao atualizar contagem:', error);  // Log de erro
    return res.status(500).send('Erro ao atualizar contagem');
  }
});

// Rota GET para recuperar a contagem do tipo de documento do DynamoDB
router.get('/getCount/:type', async (req, res) => {
  const { type } = req.params;  // Obtém o tipo de documento (Memorando, etc.)

  try {
    const params = {
      TableName: 'documents',
      Key: {
        type: { S: type },  // Chave de Partição (type)
      },
    };

    const command = new GetItemCommand(params);
    const data = await dynamoDB.send(command);

    // Verificar se o item foi encontrado
    if (!data.Item) {
      return res.status(404).send('Item não encontrado');
    }

    // Extrair o valor de 'count' do item retornado
    const count = data.Item.count ? parseInt(data.Item.count.N, 10) : 0;
    return res.status(200).json({ count });
  } catch (error) {
    console.error('Erro ao recuperar a contagem:', error);
    return res.status(500).send('Erro ao recuperar a contagem');
  }
});

module.exports = router;
