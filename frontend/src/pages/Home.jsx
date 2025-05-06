import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/Button';

const Home = () => {
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
      const newCounts = {};
      for (let type of types) {
        const response = await axios.get(`http://localhost:5000/api/getCount/${type}`);
        newCounts[type.toLowerCase()] = response.data.count || 0;
      }
      setCounts(newCounts);
    } catch (error) {
      console.error('Erro ao buscar contagens:', error);
    }
  };

  // Função chamada ao clicar no botão
  const handleClick = async (type) => {
    // Garantindo que o tipo de documento tenha a primeira letra maiúscula
    const formattedType = type.charAt(0).toUpperCase() + type.slice(1);

    // Obter o valor atual de count do estado
    const currentCount = counts[type.toLowerCase()];

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
        <Button label="Memorando" onClick={() => handleClick('memorando')} />
        <Button label="Memorando Circular" onClick={() => handleClick('memorandoCircular')} />
        <Button label="Ofício" onClick={() => handleClick('oficio')} />
        <Button label="Ofício Circular" onClick={() => handleClick('oficioCircular')} />
        <Button label="Atestado" onClick={() => handleClick('atestado')} />
        <Button label="Declaração" onClick={() => handleClick('declaracao')} />
      </div>
      <div className="counts">
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
