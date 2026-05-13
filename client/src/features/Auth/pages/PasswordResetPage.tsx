// src/features/Auth/pages/PasswordResetPage.tsx

import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import notify from "../../../services/notificationService";
import authService from "../services/authService";

export const PasswordResetPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token?: string }>();

  const [loading, setLoading] = useState(false);
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [scoreSenha, setScoreSenha] = useState(0);

  const avaliarForcaSenha = (senha: string) => {
    let score = 0;

    if (senha.length >= 6) score++;
    if (/[A-Z]/.test(senha)) score++;
    if (/[a-z]/.test(senha)) score++;
    if (/[0-9]/.test(senha)) score++;
    if (/[^A-Za-z0-9]/.test(senha)) score++;

    return score;
  };

  const gerarSenhaAleatoria = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

    const novaSenha = Array.from({ length: 10 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");

    setSenha(novaSenha);
    setScoreSenha(avaliarForcaSenha(novaSenha));
  };

  const handleSave = async () => {
    if (!token) {
      notify.error("Token inválido");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      await authService.passwordReset({
        token,
        password: senha,
      });

      notify.success("Senha recuperada com sucesso!");

      navigate("/login");
    } catch (error: any) {
      notify.error("Erro ao recuperar senha!", error);
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
                A senha deve possuir no mínimo 6 caracteres.
                Utilize letras maiúsculas, números e caracteres especiais.
              </div>
            </div>

            <form>

              <div className="mb-3">

                <label
                  htmlFor="inpSenha"
                  className="form-label fw-semibold"
                >
                  Nova Senha
                </label>

                <div className="input-group">

                  <input
                    type={showSenha ? "text" : "password"}
                    className="form-control rounded-0"
                    id="inpSenha"
                    name="new-password"
                    value={senha}
                    onChange={(e) => {
                      setSenha(e.target.value);
                      setScoreSenha(avaliarForcaSenha(e.target.value));
                    }}
                    placeholder="Digite sua nova senha"
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                  />

                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-0"
                    onClick={() => setShowSenha((prev) => !prev)}
                  >
                    <i
                      className={`bi ${
                        showSenha ? "bi-eye-slash" : "bi-eye"
                      }`}
                    />
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-dark rounded-0"
                    onClick={gerarSenhaAleatoria}
                  >
                    Gerar
                  </button>

                </div>

              </div>

              <div className="mb-3">

                <div
                  className="border"
                  style={{
                    height: "10px",
                    backgroundColor: "#e9ecef",
                  }}
                >
                  <div
                    style={{
                      width: `${(scoreSenha / 5) * 100}%`,
                      height: "100%",
                      backgroundColor:
                        scoreSenha <= 2
                          ? "#dc3545"
                          : scoreSenha <= 4
                          ? "#ffc107"
                          : "#198754",
                      transition: "0.3s",
                    }}
                  />
                </div>

                <small
                  className={`d-block mt-2 text-${
                    scoreSenha <= 2
                      ? "danger"
                      : scoreSenha <= 4
                      ? "warning"
                      : "success"
                  }`}
                >
                  {scoreSenha === 0
                    ? "Digite uma senha."
                    : scoreSenha <= 2
                    ? "Senha fraca."
                    : scoreSenha <= 4
                    ? "Senha média."
                    : "Senha forte."}
                </small>

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
                  "Recuperar Senha"
                )}
              </button>

              <div className="text-center mt-3">
                <Link
                  to="/login"
                  className="small text-decoration-none"
                >
                  Voltar para login
                </Link>
              </div>

            </form>

          </div>

        </div>

      </div>
    </div>
  );
};
``