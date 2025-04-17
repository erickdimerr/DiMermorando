import React, { useState } from 'react';
import axios from 'axios';
import Button from '../components/Button';  // Certifique-se de que o componente Button esteja importado corretamente

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

  // Função chamada ao clicar no botão
  const handleClick = async (type) => {
    // Atualizando a contagem local para cada tipo de documento
    const newCounts = { ...counts, [type]: counts[type] + 1 };
    setCounts(newCounts);

    // Garantindo que o tipo de documento tenha a primeira letra maiúscula
    const formattedType = type.charAt(0).toUpperCase() + type.slice(1);

    // Gerando o numero que pode ser a contagem ou algum identificador único
    const numero = newCounts[type];

    console.log(`Enviando para o back-end: Tipo: ${formattedType}, Contagem: ${newCounts[type]}, Numero: ${numero}`);

    try {
      // Enviando a requisição POST para o back-end
      const response = await axios.post('http://localhost:5000/api/update', {
        type: formattedType,  // Enviar o tipo com a primeira letra maiúscula
        count: newCounts[type],  // Número de cliques para esse tipo de documento
        numero: numero,  // Enviar o número do documento (que pode ser a contagem)
      });
      console.log('Resposta do back-end:', response.data);
    } catch (error) {
      console.error('Erro ao enviar para o banco de dados:', error);
    }
  };

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
