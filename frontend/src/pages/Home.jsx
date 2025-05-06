import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/Button';

const Home = () => {
  // Estado para armazenar a contagem de cliques para cada tipo de documento
  const [counts, setCounts] = useState({
    memorando: 0,
    memorandoCircular: 0,
    oficio: 0,
    oficioCircular: 0,
    atestado: 0,
    declaracao: 0,
  });

  // Função para obter a contagem atual do DynamoDB
  const fetchCounts = async () => {
    const types = ['Memorando', 'MemorandoCircular', 'Oficio', 'OficioCircular', 'Atestado', 'Declaracao'];

    try {
      // Buscando os valores de contagem para cada tipo de documento
      const newCounts = {};
      for (let type of types) {
        const response = await axios.get(`http://localhost:5000/api/getCount/${type}`);
        newCounts[type.toLowerCase()] = response.data.count || 0;  // Usando o valor de count ou 0 se não encontrado
      }
      setCounts(newCounts);  // Atualiza o estado com os valores recuperados
    } catch (error) {
      console.error('Erro ao buscar contagens:', error);
    }
  };

  // Função chamada ao clicar no botão
  const handleClick = async (type) => {
    console.log('Estado de counts antes de atualizar:', counts);  // Verificar o estado atual de counts

    // Garantindo que o tipo de documento tenha a primeira letra maiúscula
    const formattedType = type.charAt(0).toUpperCase() + type.slice(1);

    // Garantindo que a contagem seja um número válido
    const currentCount = counts[type] || 0;  // Se não houver valor para o tipo, assume 0
    const numero = currentCount + 1;

    // Verificar se o número é válido antes de atualizá-lo
    if (isNaN(numero)) {
      console.error('Erro: Número inválido para', type);
      return;  // Impedir que a contagem seja enviada para o banco de dados
    }

    // Atualizando a contagem local para cada tipo de documento antes de enviar a requisição
    const newCounts = { ...counts, [type]: numero };
    setCounts(newCounts);

    console.log(`Enviando para o back-end: Tipo: ${formattedType}, Contagem: ${newCounts[type]}, Numero: ${numero}`);

    try {
      // Enviando a requisição POST para o back-end
      const response = await axios.post('http://localhost:5000/api/update', {
        type: formattedType,  // Enviar o tipo com a primeira letra maiúscula
        count: numero,  // Número de cliques para esse tipo de documento
        numero: numero,  // Enviar o número do documento (que pode ser a contagem)
      });

      console.log('Resposta do back-end:', response.data);

      // Recarregar as contagens após a atualização bem-sucedida
      fetchCounts();
    } catch (error) {
      console.error('Erro ao enviar para o banco de dados:', error);
    }
  };

  // Usar useEffect para carregar a contagem quando o componente for montado
  useEffect(() => {
    fetchCounts();  // Carregar a contagem ao iniciar
  }, []);

  return (
    <div>
      <h2>Página Principal</h2>
      <div className="buttons">
        {/* Botões para cada tipo de documento */}
        <Button label="Memorando" onClick={() => handleClick('memorando')} />
        <Button label="Memorando Circular" onClick={() => handleClick('memorandoCircular')} />
        <Button label="Ofício" onClick={() => handleClick('oficio')} />
        <Button label="Ofício Circular" onClick={() => handleClick('oficioCircular')} />
        <Button label="Atestado" onClick={() => handleClick('atestado')} />
        <Button label="Declaração" onClick={() => handleClick('declaracao')} />
      </div>
      <div className="counts">
        {/* Exibindo a contagem de cliques para cada tipo de documento */}
        <p>Memorando: {counts.memorando}</p>
        <p>Memorando Circular: {counts.memorandoCircular}</p>
        <p>Ofício: {counts.oficio}</p>
        <p>Ofício Circular: {counts.oficioCircular}</p>
        <p>Atestado: {counts.atestado}</p>
        <p>Declaração: {counts.declaracao}</p>
      </div>
    </div>
  );
};

export default Home;
