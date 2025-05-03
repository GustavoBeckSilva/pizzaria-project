import React, { createContext, useState } from 'react';

export const CarrinhoContext = createContext();

export function ProvedorCarrinho({ children }) {
  const [itens, setItens] = useState([]);

  function adicionarPizza(pizza) {
    setItens((anteriores) => [...anteriores, pizza]);
  }

  function removerPizza(indice) {
    setItens((anteriores) => anteriores.filter((_, i) => i !== indice));
  }

  function limparCarrinho() {
    setItens([]);
  }

  return (
    <CarrinhoContext.Provider value={{ itens, adicionarPizza, removerPizza, limparCarrinho }}>
      {children}
    </CarrinhoContext.Provider>
  );
}