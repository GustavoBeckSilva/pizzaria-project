import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
      <div className="container">
        <NavLink className="navbar-brand fw-bold" to="/home">
          🍕 Pizzaria
        </NavLink>

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
          <ul className="navbar-nav me-auto gap-2">
            {!usuario ? (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `nav-link${isActive ? ' active' : ''}`
                    }
                  >
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `nav-link${isActive ? ' active' : ''}`
                    }
                  >
                    Registrar
                  </NavLink>
                </li>
              </>
            ) : usuario.tipo_usuario === PAPEIS.CLIENTE ? (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/cliente/menu"
                    className={({ isActive }) =>
                      `nav-link${isActive ? ' active' : ''}`
                    }
                  >
                    Menu
                  </NavLink>
                </li>
                <li className="nav-item position-relative">
                  <NavLink
                    to="/cliente/carrinho"
                    className={({ isActive }) =>
                      `nav-link${isActive ? ' active' : ''}`
                    }
                  >
                    Carrinho
                  </NavLink>
                  {itens.length > 0 && (
                    <span className="badge bg-danger rounded-circle position-absolute top-0 start-100 translate-middle">
                      {itens.length}
                    </span>
                  )}
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/cliente/pedidos"
                    className={({ isActive }) =>
                      `nav-link${isActive ? ' active' : ''}`
                    }
                  >
                    Meus Pedidos
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/pizzaiolo/pedidos"
                    className={({ isActive }) =>
                      `nav-link${isActive ? ' active' : ''}`
                    }
                  >
                    Pedidos
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/pizzaiolo/sabores"
                    className={({ isActive }) =>
                      `nav-link${isActive ? ' active' : ''}`
                    }
                  >
                    Sabores
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {usuario && (
            <button
              className="btn btn-outline-light fw-semibold"
              onClick={handleLogout}
            >
              Sair
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}