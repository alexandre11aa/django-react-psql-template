// src/routes/PublicRouter.tsx

import { Navigate } from "react-router-dom";
import useValidateToken from "../hooks/useValidateToken";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const isValid = useValidateToken();

  if (isValid === null) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  // Se o token for válido, o usuário já está logado → redireciona
  if (isValid) {
    return <Navigate to="/home" replace />;
  }

  // Caso contrário, exibe a página pública
  return <>{children}</>;
};