// src/features/Auth/pages/LoginPage.tsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PasswordInput } from "../components/PasswordInput";
import useLogin from "../hooks/useLogin";

export function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");

  const { login, loading } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const success = await login(email, senha);

    if (success) {
      navigate("/home");
    }
  };

  return (
    <div
      className="container-fluid bg-light"
      style={{ minHeight: "100vh" }}
    >
      <div className="row min-vh-100 justify-content-center align-items-center">
        <div className="col-11 col-sm-8 col-md-5 col-lg-4 col-xl-3">

          <form onSubmit={handleSubmit}>

            <div className="border bg-white p-4 shadow-sm">

              <h4 className="text-center fw-bold mb-3">
                LOGIN
              </h4>

              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">
                  Email
                </label>

                <input
                  type="email"
                  className="form-control rounded-0"
                  id="email"
                  name="email"
                  placeholder="Digite seu email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <PasswordInput
                  value={senha}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSenha(e.target.value)
                  }
                />
              </div>

              <button
                className="btn btn-dark w-100 rounded-0 fw-semibold"
                type="submit"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>

              <div className="text-center mt-3">
                <Link
                  to="/request_password_reset"
                  className="small text-decoration-none"
                >
                  Esqueceu a senha?
                </Link>
              </div>

            </div>

          </form>

        </div>
      </div>
    </div>
  );
}