/* src/features/User/components/ModalRegisterEditUser.tsx */

import React, { useState, useEffect } from "react";

import type { User } from "../types/userType";

import userService from "../services/userService";

import notify from "../../../services/notificationService";

interface ModalRegisterEditUserProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: User | null;
  refreshUsers: () => Promise<void>;
}

const ModalRegisterEditUser: React.FC<
  ModalRegisterEditUserProps
> = ({
  isOpen,
  onClose,
  userToEdit,
  refreshUsers,
}) => {

  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState(
    userToEdit?.name || ""
  );

  const [email, setEmail] = useState(
    userToEdit?.email || ""
  );

  const [senha, setSenha] = useState("");

  const [tipoUsuario, setTipoUsuario] = useState(
    userToEdit?.access_level || "ADM"
  );

  const [showSenha, setShowSenha] =
    useState(false);

  const [scoreSenha, setScoreSenha] =
    useState(0);

  const avaliarForcaSenha = (
    senha: string
  ) => {

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

    const novaSenha = Array.from(
      { length: 10 },
      () =>
        chars[
          Math.floor(
            Math.random() * chars.length
          )
        ]
    ).join("");

    setSenha(novaSenha);

    setScoreSenha(
      avaliarForcaSenha(novaSenha)
    );

  };

  useEffect(() => {

    if (userToEdit) {

      setNome(userToEdit.name);

      setEmail(userToEdit.email);

      setSenha("");

      setTipoUsuario(
        userToEdit.access_level
      );

    } else {

      setNome("");

      setEmail("");

      setSenha("");

      setTipoUsuario("ADM");

    }

    setScoreSenha(0);

  }, [userToEdit, isOpen]);

  const handleSave = async () => {

    try {

      setLoading(true);

      if (userToEdit) {

        await userService.update(
          userToEdit.id,
          {
            name: nome,
            email,
            access_level: tipoUsuario,
            password:
              senha || undefined,
          }
        );

        notify.success(
          "Usuário atualizado com sucesso!"
        );

      } else {

        await userService.create({
          name: nome,
          email,
          password: senha,
          access_level: tipoUsuario,
          is_active: true,
        });

        notify.success(
          "Usuário criado com sucesso!"
        );

      }

      await refreshUsers();

      onClose();

    } catch (error: any) {

      notify.error(
        "Erro ao criar/atualizar usuário!",
        error
      );

    } finally {

      setLoading(false);

    }

  };

  if (!isOpen) return null;

  return (
    <>

      <div className="modal fade show d-block">

        <div className="modal-dialog modal-lg modal-dialog-centered">

          <div className="modal-content rounded-0">

            <div className="modal-header bg-light">

              <h5 className="modal-title fw-bold">
                {
                  userToEdit
                    ? "Editar Usuário"
                    : "Novo Usuário"
                }
              </h5>

              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              />

            </div>

            <div className="modal-body">

              <div className="row">

                <div className="col-md-6 mb-3">

                  <label className="form-label fw-semibold">
                    Nome Completo
                  </label>

                  <input
                    type="text"
                    className="form-control rounded-0"
                    value={nome}
                    onChange={(e) =>
                      setNome(
                        e.target.value
                      )
                    }
                    placeholder="Digite o nome"
                  />

                </div>

                <div className="col-md-6 mb-3">

                  <label className="form-label fw-semibold">
                    E-mail
                  </label>

                  <input
                    type="email"
                    className="form-control rounded-0"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    placeholder="Digite o e-mail"
                  />

                </div>

                <div className="col-md-6 mb-4">

                  <label className="form-label fw-semibold">
                    Senha
                  </label>

                  <div className="input-group mb-2">

                    <input
                      type={
                        showSenha
                          ? "text"
                          : "password"
                      }
                      className="form-control rounded-0"
                      value={senha}
                      onChange={(e) => {

                        setSenha(
                          e.target.value
                        );

                        setScoreSenha(
                          avaliarForcaSenha(
                            e.target.value
                          )
                        );

                      }}
                      placeholder="Digite a senha"
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-0"
                      onClick={() =>
                        setShowSenha(
                          (prev) =>
                            !prev
                        )
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

                    <button
                      type="button"
                      className="btn btn-outline-dark rounded-0"
                      onClick={
                        gerarSenhaAleatoria
                      }
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
                        width: `${
                          (scoreSenha / 5) *
                          100
                        }%`,
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
                        ? userToEdit
                          ? "Digite apenas se desejar alterar a senha."
                          : "Digite uma senha."
                        : scoreSenha <= 2
                        ? "Senha fraca."
                        : scoreSenha <= 4
                        ? "Senha média."
                        : "Senha forte."
                    }
                  </small>

                </div>

                <div className="col-md-6 mb-3">

                  <label className="form-label fw-semibold">
                    Tipo de Usuário
                  </label>

                  <select
                    className="form-select rounded-0"
                    value={tipoUsuario}
                    onChange={(e) =>
                      setTipoUsuario(
                        e.target.value
                      )
                    }
                  >

                    <option value="ADM">
                      Administração
                    </option>

                    <option value="CRD">
                      Coordenação
                    </option>

                    <option value="DEV">
                      Desenvolvimento
                    </option>

                    <option value="DIR">
                      Diretoria
                    </option>

                    <option value="FIN">
                      Financeiro
                    </option>

                    <option value="OPR">
                      Operação
                    </option>

                  </select>

                  <small className="text-muted">
                    Define as permissões
                    do usuário.
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
                disabled={loading}
              >
                {
                  loading
                    ? (
                      <span className="spinner-border spinner-border-sm" />
                    )
                    : userToEdit
                    ? "Atualizar"
                    : "Salvar"
                }
              </button>

            </div>

          </div>

        </div>

      </div>

      <div className="modal-backdrop fade show" />

    </>
  );
};

export default ModalRegisterEditUser;