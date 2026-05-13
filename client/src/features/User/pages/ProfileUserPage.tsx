// src/features/User/pages/ManageUserPage.tsx

import React, { useState, useEffect } from "react";

import notify from "../../../services/notificationService";

import DefaultPageLayout from "../../../components/DefaultPageLayout";

import ModalChangePassword from "../components/ModalChangePassword";

import type { User } from "../types/userType";

import userService from "../services/userService";

export const ProfileUserPage: React.FC = () => {

  const user = localStorage.getItem("user");

  const userId = user ? JSON.parse(user).userId : null;

  const [modalOpen, setModalOpen] = useState(false);
  const [userData, setUserData] = useState<User>();

  const fetchUser = async () => {
    try {
      const data = await userService.get(userId);
      setUserData(data);
    } catch (error: any) {
      notify.error("Erro ao carregar usuário!", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <DefaultPageLayout>

      {userData && (
        <ModalChangePassword
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          userToEdit={userData}
        />
      )}

      <div className="d-flex flex-column h-100">

        <div className="border-bottom pb-3 mb-4">

          <h3 className="fw-bold mb-1">
            Perfil de Usuário
          </h3>

          <small className="text-muted">
            Dados da conta autenticada no sistema
          </small>

        </div>

        <div>

          <div className="row">

            <div className="col-md-6 mb-3">

              <label className="form-label fw-semibold">
                Nome Completo
              </label>

              <input
                type="text"
                className="form-control rounded-0 border-dark-subtle"
                value={userData?.name ?? ""}
                readOnly
              />

            </div>

            <div className="col-md-6 mb-3">

              <label className="form-label fw-semibold">
                Email
              </label>

              <input
                type="text"
                className="form-control rounded-0 border-dark-subtle"
                value={userData?.email ?? ""}
                readOnly
              />

            </div>

            <div className="col-md-6 mb-3">

              <label className="form-label fw-semibold">
                Tipo de Usuário
              </label>

              <input
                type="text"
                className="form-control rounded-0 border-dark-subtle"
                value={
                  {
                    ADM: "Administração",
                    CRD: "Coordenação",
                    DEV: "Desenvolvimento",
                    DIR: "Diretoria",
                    FIN: "Financeiro",
                    OPR: "Operação",
                  }[userData?.access_level ?? ""]
                  || "Sem informação"
                }
                readOnly
              />

            </div>

          </div>

        </div>

        <div className="mt-auto border-top pt-3 d-flex justify-content-end">

          <button
            type="button"
            className="btn btn-dark rounded-0 px-4"
            onClick={() => setModalOpen(true)}
          >
            Alterar Senha
          </button>

        </div>

      </div>

    </DefaultPageLayout>
  );
};