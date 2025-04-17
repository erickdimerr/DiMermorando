const { dynamoDB, UpdateItemCommand } = require('../config/awsConfig');

// Função para atualizar a contagem no DynamoDB
const updateCount = async (req, res) => {
  const { type, count } = req.body;

  // Log para verificar se o tipo de documento e a contagem estão sendo recebidos corretamente
  console.log('Requisição recebida:', { type, count });

  // Verifica se o tipo de documento é válido
  const validTypes = ['Memorando', 'MemorandoCircular', 'Oficio', 'OficioCircular', 'Atestado', 'Declaracao'];
  if (!validTypes.includes(type)) {
    console.log('Tipo de documento inválido:', type);
    return res.status(400).send('Tipo de documento inválido');
  }

  const params = {
    TableName: type,  // O nome da tabela será o tipo do documento (Memorando, Ofício, etc.)
    Key: {
      type: { S: type },  // A chave primária será o tipo do documento
    },
    UpdateExpression: 'set count = :count',  // Atualiza o campo `count`
    ExpressionAttributeValues: {
      ':count': { N: String(count) },  // A contagem deve ser um número, então a convertemos para String
    },
  };

  try {
    // Criar o comando de atualização
    const command = new UpdateItemCommand(params);

    // Enviar o comando para o DynamoDB
    await dynamoDB.send(command);

    console.log('Contagem atualizada com sucesso no DynamoDB!');
    res.status(200).send('Contagem atualizada com sucesso');
  } catch (error) {
    console.error('Erro ao atualizar contagem:', error);
    res.status(500).send('Erro ao atualizar contagem');
  }
};

module.exports = { updateCount };
