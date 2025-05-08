import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/Button';

const Home = () => {
  // Usando os nomes exatos que coincidem com os da AWS
  const [counts, setCounts] = useState({
    Memorando: 0,
    MemorandoCircular: 0,
    Oficio: 0,
    OficioCircular: 0,
    Atestado: 0,
    Declaracao: 0,
  });

  // Função para obter a contagem atual do DynamoDB
  const fetchCounts = async () => {
    const types = ['Memorando', 'MemorandoCircular', 'Oficio', 'OficioCircular', 'Atestado', 'Declaracao'];
  
    try {
      // Buscando os valores de contagem para cada tipo de documento
      const newCounts = {};
      for (let type of types) {
        const response = await axios.get(`http://localhost:5000/api/getCount/${type}`);
        newCounts[type] = response.data.count || 0;  // Usando o valor de count ou 0 se não encontrado
      }
      console.log('Contagens recuperadas:', newCounts);  // Log de depuração
  
      setCounts(newCounts);  // Atualiza o estado com os valores recuperados
    } catch (error) {
      console.error('Erro ao buscar contagens:', error);
    }
  };

  // Função chamada ao clicar no botão
  const handleClick = async (type) => {
    // Garantindo que o tipo de documento tenha a primeira letra maiúscula
    const formattedType = type.charAt(0).toUpperCase() + type.slice(1);

    // Obter o valor atual de count do estado
    const currentCount = counts[formattedType] || 0;

    // Incrementa 1 na contagem atual
    const updatedCount = currentCount + 1;

    console.log(`Enviando para o back-end: Tipo: ${formattedType}, Contagem: ${updatedCount}`);

    try {
      // Envia o valor incrementado para o backend
      const response = await axios.post('http://localhost:5000/api/update', {
        type: formattedType,
        count: updatedCount,  // Envia o valor atualizado para o backend
      });

      console.log('Resposta do back-end:', response.data);

      // Recarrega as contagens após a atualização
      fetchCounts();
    } catch (error) {
      console.error('Erro ao enviar para o banco de dados:', error);
    }
  };

  // Usar useEffect para carregar a contagem quando o componente for montado
  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <div>
      <h2>Página Principal</h2>
      <div className="buttons">
        <Button label="Memorando" onClick={() => handleClick('Memorando')} />
        <Button label="Memorando Circular" onClick={() => handleClick('MemorandoCircular')} />
        <Button label="Ofício" onClick={() => handleClick('Oficio')} />
        <Button label="Ofício Circular" onClick={() => handleClick('OficioCircular')} />
        <Button label="Atestado" onClick={() => handleClick('Atestado')} />
        <Button label="Declaração" onClick={() => handleClick('Declaracao')} />
      </div>
      <div className="counts">
        <p>Memorando: {counts.Memorando}</p>
        <p>Memorando Circular: {counts.MemorandoCircular}</p>
        <p>Ofício: {counts.Oficio}</p>
        <p>Ofício Circular: {counts.OficioCircular}</p>
        <p>Atestado: {counts.Atestado}</p>
        <p>Declaração: {counts.Declaracao}</p>
      </div>
    </div>
  );
};

export default Home;
