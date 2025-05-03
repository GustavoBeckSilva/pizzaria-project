import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProvedorAutenticacao } from './context/AutenticacaoContext';
import { ProvedorCarrinho } from './context/CarrinhoContext';
import { RotaProtegida } from './components/RotaProtegida';
import { PAPEIS } from './utils/constantes';

// Páginas de Autenticação
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

// Páginas de Pizzaiolo
import DashboardPage from './pages/Pizzaiolo/DashboardPage';
import SaboresPage from './pages/Pizzaiolo/SaboresPage';

// Páginas de Cliente
import MenuPage from './pages/Cliente/MenuPage';
import CarrinhoPage from './pages/Cliente/CarrinhoPage';
import PedidosPage from './pages/Cliente/PedidosPage';

// Layout compartilhado
import Layout from './components/Layout';

function App() {
  return (
    <ProvedorAutenticacao>
      <ProvedorCarrinho>
        <BrowserRouter>
          <Layout>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Rotas do cliente (precisa estar logado) */}
              <Route element={<RotaProtegida />}>
                <Route path="/cliente/menu" element={<MenuPage />} />
                <Route path="/cliente/carrinho" element={<CarrinhoPage />} />
                <Route path="/cliente/pedidos" element={<PedidosPage />} />
              </Route>

              {/* Rotas do pizzaiolo (precisa estar logado e ter papel) */}
              <Route element={<RotaProtegida papelObrigatorio={PAPEIS.PIZZAIOTO} />}>
                <Route path="/pizzaiolo/pedidos" element={<DashboardPage />} />
                <Route path="/pizzaiolo/sabores" element={<SaboresPage />} />
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