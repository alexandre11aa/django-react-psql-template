import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setNavigator } from "../utils/navigate";
import { ProtectedRoute } from "./ProtectedRoutes";
import { PublicRoute } from "./PublicRoutes";
import { LoginPage } from "../features/Auth/pages/LoginPage";
import { PasswordResetPage } from "../features/Auth/pages/PasswordResetPage";
import { RequestPasswordResetPage } from "../features/Auth/pages/RequestPasswordResetPage";
import { HomePage } from "../pages/HomePage";
import { ProfileUserPage } from "../features/User/pages/ProfileUserPage";
import { ManageUserPage } from "../features/User/pages/ManageUserPage";
import { MaintenancePage } from "../pages/MaintenancePage";

const RouterWrapper: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  return (
    <Routes>

      {/* Rota pública */}

      <Route path="/" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>} 
      />
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>} 
      />

      <Route path="/password_reset/:token" element={
        <PublicRoute>
          <PasswordResetPage />
        </PublicRoute>} 
      />
      <Route path="/request_password_reset" element={
        <PublicRoute>
          <RequestPasswordResetPage />
        </PublicRoute>}  
      />

      {/* Rota protegida */}

      <Route path="/home" element={
        <ProtectedRoute allowedRoles={["ADM", "USR"]}>
          <HomePage />
        </ProtectedRoute>} 
      />

      <Route path="/maintenance" element={
        <ProtectedRoute allowedRoles={["ADM", "USR"]}>
          <MaintenancePage />
        </ProtectedRoute>} 
      />

      <Route path="/profile_user" element={
        <ProtectedRoute allowedRoles={["ADM", "USR"]}>
          <ProfileUserPage />
        </ProtectedRoute>} 
      />
      <Route path="/manage_user" element={
        <ProtectedRoute allowedRoles={["ADM"]}>
          <ManageUserPage />
        </ProtectedRoute>} 
      />

      {/* Catch-all */}

      <Route path="*" element={
        <Navigate to="/login" replace />} 
      />
      
    </Routes>
  );
};

export const AppRouter = () => <RouterWrapper />;
