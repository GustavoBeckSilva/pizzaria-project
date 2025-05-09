import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Public/HomePage.css'; // adicione este arquivo de estilos

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container fade-in">
      <h1 className="home-title slide-in-left">Bem‑vindo à Pizzaria!</h1>
      <p className="home-subtitle pop-in">Descubra nossos sabores e peça agora mesmo.</p>
    </div>
  );
}