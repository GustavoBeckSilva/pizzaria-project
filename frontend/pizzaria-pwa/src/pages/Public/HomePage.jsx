/*
===============================
src/pages/Public/HomePage.jsx
===============================
*/
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Bem‑vindo à Pizzaria!</h1>
      <p className="lead mb-4">Descubra nossos sabores e peça agora mesmo.</p>
      <div className="d-flex justify-content-center gap-3">
        <Button onClick={() => navigate('/cliente/menu')}>Peça agora</Button>
        <Button variant="outline" onClick={() => navigate('/login')}>Login/Registro</Button>
      </div>
    </div>
  );
}