import React, { createContext, useState, useEffect } from 'react';

export const AutenticacaoContext = createContext();

export function ProvedorAutenticacao({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const userStorage = localStorage.getItem('usuario');
    const tokenStorage = localStorage.getItem('token');

    // só tenta parsear se não for 'undefined' e existir ambos
    if (
      userStorage &&
      userStorage !== 'undefined' &&
      tokenStorage &&
      tokenStorage !== 'undefined'
    ) {
      try {
        setUsuario(JSON.parse(userStorage));
        setToken(tokenStorage);
      } catch (e) {
        console.error('Falha ao parsear usuário salvo:', e);
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
      }
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

  // enquanto carrega, não renderiza nada (ou um spinner se preferir)
  if (carregando) return null;

  return (
    <AutenticacaoContext.Provider value={{ usuario, token, fazerLogin, fazerLogout }}>
      {children}
    </AutenticacaoContext.Provider>
  );
}
