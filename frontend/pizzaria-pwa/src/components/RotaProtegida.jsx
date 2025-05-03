import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AutenticacaoContext } from '../context/AutenticacaoContext';
import { PAPEIS } from '../utils/constantes';

export function RotaProtegida({ papelObrigatorio }) {
  const { usuario } = useContext(AutenticacaoContext);

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  if (papelObrigatorio && usuario.tipo_usuario !== papelObrigatorio) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}