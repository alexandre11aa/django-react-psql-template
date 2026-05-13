/* src/features/User/components/ModalRegisterEditUser.tsx */

import React, { useState, useEffect } from "react";

import type { User } from "../types/userType";

import authService from "../../Auth/services/authService";
import userService from "../services/userService";

import notify from "../../../services/notificationService";

interface ModalChangePasswordProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit: User;
}

const ModalChangePassword: React.FC<ModalChangePasswordProps> = ({
  isOpen,
  onClose,
  userToEdit,
}) => {

  const [nome, setNome] = useState(userToEdit?.name || "");
  const [email, setEmail] = useState(userToEdit?.email || "");

  const [senha, setSenha] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  const [tipoUsuario, setTipoUsuario] = useState(
    userToEdit?.access_level || "ADM"
  );

  const [showSenha, setShowSenha] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);

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

    const senhaGerada = Array.from(
      { length: 10 },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");

    setNovaSenha(senhaGerada);
    setScoreSenha(avaliarForcaSenha(senhaGerada));
  };

  useEffect(() => {
    setNome(userToEdit.name);
    setEmail(userToEdit.email);

    setSenha("");
    setNovaSenha("");

    setTipoUsuario(userToEdit.access_level);

  }, [userToEdit, isOpen]);

  const handleSave = async () => {

    try {

      await authService.token(
        email,
        senha || ""
      );

      await userService.update(userToEdit.id, {
        name: nome,
        email,
        access_level: tipoUsuario,
        password: novaSenha || undefined,
      });

      notify.success("Senha alterada com sucesso!");

      onClose();

    } catch (error: any) {

      notify.error(
        "Erro ao alterar senha!",
        error
      );

    }

  };

  if (!isOpen) return null;

  return (
    <>

      <div className="modal fade show d-block">
        
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
        >

          <div className="modal-content rounded-0">

            <div className="modal-header bg-light">

              <h5 className="modal-title fw-bold">
                Alterar Senha
              </h5>

              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              />

            </div>

            <div className="modal-body">

              <div className="row">

                <div className="col-md-6 mb-4">

                  <label
                    htmlFor="inpSenha"
                    className="form-label fw-semibold"
                  >
                    Senha Atual
                  </label>

                  <div className="input-group">

                    <input
                      type={showSenha ? "text" : "password"}
                      className="form-control rounded-0"
                      id="inpSenha"
                      value={senha}
                      onChange={(e) =>
                        setSenha(e.target.value)
                      }
                      placeholder="Digite sua senha atual"
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-0"
                      onClick={() =>
                        setShowSenha((prev) => !prev)
                      }
                    >
                      <i
                        className={`bi ${
                          showSenha
                            ? "bi-eye-slash"
                            : "bi-eye"
                        }`}
                      />
                    </button>

                  </div>

                </div>

                <div className="col-md-6 mb-4">

                  <label
                    htmlFor="novaSenha"
                    className="form-label fw-semibold"
                  >
                    Nova Senha
                  </label>

                  <div className="input-group mb-2">

                    <input
                      type={
                        showNovaSenha
                          ? "text"
                          : "password"
                      }
                      className="form-control rounded-0"
                      id="novaSenha"
                      value={novaSenha}
                      onChange={(e) => {
                        setNovaSenha(e.target.value);

                        setScoreSenha(
                          avaliarForcaSenha(
                            e.target.value
                          )
                        );
                      }}
                      placeholder="Digite a nova senha"
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-0"
                      onClick={() =>
                        setShowNovaSenha(
                          (prev) => !prev
                        )
                      }
                    >
                      <i
                        className={`bi ${
                          showNovaSenha
                            ? "bi-eye-slash"
                            : "bi-eye"
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

                  <div className="progress rounded-0 mb-2">

                    <div
                      className={`progress-bar ${
                        scoreSenha <= 2
                          ? "bg-danger"
                          : scoreSenha <= 4
                          ? "bg-warning"
                          : "bg-success"
                      }`}
                      style={{
                        width: `${(scoreSenha / 5) * 100}%`,
                      }}
                    />

                  </div>

                  <small
                    className={`text-${
                      scoreSenha <= 2
                        ? "danger"
                        : scoreSenha <= 4
                        ? "warning"
                        : "success"
                    }`}
                  >
                    {
                      scoreSenha === 0
                        ? "Digite uma nova senha."
                        : scoreSenha <= 2
                        ? "Senha fraca."
                        : scoreSenha <= 4
                        ? "Senha média."
                        : "Senha forte."
                    }
                  </small>

                </div>

              </div>

            </div>

            <div className="modal-footer bg-light">

              <button
                type="button"
                className="btn btn-outline-secondary rounded-0"
                onClick={onClose}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn btn-dark rounded-0"
                onClick={handleSave}
              >
                Atualizar
              </button>

            </div>

          </div>

        </div>

      </div>

      <div className="modal-backdrop fade show" />

    </>
  );
};

export default ModalChangePassword;