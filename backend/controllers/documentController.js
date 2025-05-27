const { dynamoDB } = require('../config/awsConfig');
const bcrypt = require('bcryptjs');  // Para criptografar a senha dos usuários
const { v4: uuidv4 } = require('uuid');  // Para gerar um UUID único, caso queira usar isso como userId

// Função para registrar usuário
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Verificar se todos os dados foram fornecidos
  if (!name || !email || !password || !role) {
    return res.status(400).send('Todos os campos são obrigatórios');
  }

  // Gerar um userId único (pode ser o UUID ou pode ser o próprio email)
  const userId = uuidv4(); // Gerando um UUID único. Caso prefira, use o próprio email aqui.

  // Criptografar a senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Parâmetros para adicionar o usuário ao DynamoDB
  const params = {
    TableName: 'Users',  // Nome da tabela de usuários
    Item: {
      userId,  // Usando o UUID como chave de partição
      email,
      name,
      password: hashedPassword,
      role
    }
  };

  try {
    // Criar o comando para inserir o usuário
    await dynamoDB.put(params).promise();

    console.log('Usuário registrado com sucesso no DynamoDB!');
    res.status(200).send('Cadastro realizado com sucesso!');
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).send('Erro ao cadastrar usuário');
  }
};

// Exportando as funções do controlador
module.exports = { registerUser };
