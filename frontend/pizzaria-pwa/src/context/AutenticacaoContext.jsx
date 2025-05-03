import React, { createContext, useState, useEffect } from 'react';

export const AutenticacaoContext = createContext();

export function ProvedorAutenticacao({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const userStorage = localStorage.getItem('usuario');
    const tokenStorage = localStorage.getItem('token');
    if (userStorage && tokenStorage) {
      setUsuario(JSON.parse(userStorage));
      setToken(tokenStorage);
    }
    setCarregando(false);
  }, []);

  function fazerLogin(dadosUsuario, jwt) {
    setUsuario(dadosUsuario);
    setToken(jwt);
    localStorage.setItem('usuario', JSON.stringify(dadosUsuario));
    localStorage.setItem('token', jwt);
  }

  function fazerLogout() {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  }

  // Aguarde carregamento inicial para não redirecionar prematuramente
  if (carregando) {
    return null; // ou spinner de carregamento
  }

  return (
    <AutenticacaoContext.Provider value={{ usuario, token, fazerLogin, fazerLogout }}>
      {children}
    </AutenticacaoContext.Provider>
  );
}