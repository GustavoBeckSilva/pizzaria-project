import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AutenticacaoContext } from '../context/AutenticacaoContext';
import { CarrinhoContext } from '../context/CarrinhoContext';
import { PAPEIS } from '../utils/constantes';

export default function Navbar() {
  const { usuario, fazerLogout } = useContext(AutenticacaoContext);
  const { itens } = useContext(CarrinhoContext);
  const navigate = useNavigate();

  function handleLogout() {
    fazerLogout();
    navigate('/login');
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">Pizzaria</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {!usuario && (
              <>              
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Registrar</Link>
                </li>
              </>
            )}

            {usuario && usuario.tipo_usuario === PAPEIS.CLIENTE && (
              <>              
                <li className="nav-item">
                  <Link className="nav-link" to="/cliente/menu">Menu</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/cliente/carrinho">
                    Carrinho <span className="badge bg-secondary">{itens.length}</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/cliente/pedidos">Meus Pedidos</Link>
                </li>
              </>
            )}

            {usuario && usuario.tipo_usuario === PAPEIS.PIZZAIOTO && (
              <>              
                <li className="nav-item">
                  <Link className="nav-link" to="/pizzaiolo/pedidos">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/pizzaiolo/sabores">Sabores</Link>
                </li>
              </>
            )}
          </ul>

          {usuario && (
            <ul className="navbar-nav">
              <li className="nav-item">
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                  Sair
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}