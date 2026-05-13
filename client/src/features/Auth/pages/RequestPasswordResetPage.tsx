// src/features/Auth/pages/RequestPasswordResetPage.tsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import notify from "../../../services/notificationService";
import authService from "../services/authService";

export const RequestPasswordResetPage: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSave = async () => {
    try {
      setLoading(true);

      await authService.requestPasswordReset({ email });

      notify.success("Email de recuperação enviado com sucesso!");

      navigate("/login");
    } catch (error: any) {
      notify.error("Erro ao solicitar recuperação de senha!", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid bg-light"
      style={{ minHeight: "100vh" }}
    >
      <div className="row min-vh-100 justify-content-center align-items-center">

        <div className="col-11 col-sm-9 col-md-6 col-lg-4">

          <div className="border bg-white p-4 shadow-sm">

            <h4 className="text-center fw-bold mb-3">
              RECUPERAÇÃO DE SENHA
            </h4>

            <div className="alert alert-warning rounded-0">

              <strong>Atenção</strong>

              <div className="small mt-2">
                Informe o email cadastrado no sistema.
                Um link será enviado para redefinição da senha.
              </div>

            </div>

            <form>

              <div className="mb-4">

                <label
                  htmlFor="email"
                  className="form-label fw-semibold"
                >
                  Email
                </label>

                <input
                  type="email"
                  className="form-control rounded-0"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu email"
                  required
                />

              </div>

              <button
                type="button"
                className="btn btn-dark w-100 rounded-0 fw-semibold"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  "Solicitar Recuperação"
                )}
              </button>

              <div className="text-center mt-3">
                <Link
                  to="/login"
                  className="small text-decoration-none"
                >
                  Voltar para Login!
                </Link>
              </div>

            </form>

          </div>

        </div>

      </div>
    </div>
  );
};