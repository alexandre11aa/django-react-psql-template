// src/routes/ProtectedRouter.tsx

import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import notify from "../services/notificationService";
import useValidateToken from "../hooks/useValidateToken";
import "./ProtectedRoutes.css";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const isValid = useValidateToken();

  // Lê o usuário do localStorage
  const user = localStorage.getItem("user");
  const userAccessLevel = user ? JSON.parse(user).userAccessLevel : "";

  // Exibe toasts apenas DEPOIS da renderização
  useEffect(() => {
    if (isValid && !allowedRoles.includes(userAccessLevel)) {
      notify.error("Ops! Você não tem permissão para acessar esta página...");
    }
  }, [isValid, userAccessLevel, allowedRoles]);

  // Enquanto valida o token
  if (isValid === null) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  // Se não for válido
  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  // Se não tiver permissão
  if (!allowedRoles.includes(userAccessLevel)) {
    return <Navigate to="/home" replace />;
  }

  // Caso contrário, renderiza o conteúdo
  return <>{children}</>;
};
