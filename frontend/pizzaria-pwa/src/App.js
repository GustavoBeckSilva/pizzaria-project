import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProvedorAutenticacao } from './context/AutenticacaoContext';
import { ProvedorCarrinho } from './context/CarrinhoContext';
import { RotaProtegida } from './components/RotaProtegida';
import { PAPEIS } from './utils/constantes';

import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import HomePage from './pages/Public/HomePage';

import DashboardPage from './pages/Pizzaiolo/DashboardPage';
import SaboresPage from './pages/Pizzaiolo/SaboresPage';
import FlavorForm from './pages/Pizzaiolo/FlavorForm';

import MenuPage from './pages/Cliente/MenuPage';
import CarrinhoPage from './pages/Cliente/CarrinhoPage';
import PedidosPage from './pages/Cliente/PedidosPage';
import CheckoutPage from './pages/Cliente/CheckoutPage';

import Layout from './components/Layout';

import PerfilPage from './pages/Perfil/PerfilPage';

function App() {
  return (
    <ProvedorAutenticacao>
      <ProvedorCarrinho>
        <BrowserRouter>
          <Layout>
            <Routes>
              {/* Rota inicial para HomePage */}
              <Route path="/home" element={<HomePage />} />
              
              {/* Rotas públicas */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Rotas do cliente (precisa estar logado) */}
              <Route element={<RotaProtegida />}>
                {/* 2. Adicione a nova rota do perfil aqui */}
                <Route path="/perfil" element={<PerfilPage />} />

                <Route path="/cliente/menu" element={<MenuPage />} />
                <Route path="/cliente/carrinho" element={<CarrinhoPage />} />
                <Route path="/cliente/checkout" element={<CheckoutPage />} />
                <Route path="/cliente/pedidos" element={<PedidosPage />} />
              </Route>

              {/* Rotas do pizzaiolo (precisa estar logado e ter papel) */}
              <Route element={<RotaProtegida papelObrigatorio={PAPEIS.PIZZAIOTO} />}>
                <Route path="/pizzaiolo/pedidos" element={<DashboardPage />} />
                <Route path="/pizzaiolo/sabores" element={<SaboresPage />} />
                <Route path="/pizzaiolo/sabores/novo" element={<FlavorForm />} />
                <Route path="/pizzaiolo/sabores/:id" element={<FlavorForm />} />
              </Route>

              {/* Redirecionamento padrão */}
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ProvedorCarrinho>
    </ProvedorAutenticacao>
  );
}

export default App;