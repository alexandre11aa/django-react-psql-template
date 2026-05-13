/* src/features/User/components/ModalStatusUser.tsx */

import React, { useState } from "react";
import { createPortal } from "react-dom";
import notify from "../services/notificationService";

interface ModalStatusUserProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  toEdit?: { id: number; is_active: boolean } | null;
  refresh?: () => Promise<void>;
  service: { toggleStatus: (id: number) => Promise<void>; };
}

const ModalStatusUser: React.FC<ModalStatusUserProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  toEdit, 
  refresh, 
  service, 
}) => {

  const [statusAtivo, setStatusAtivo] = useState("1");
  const [save, setSave] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!toEdit) return;

    // Se o status não mudou, não faz nada
    const novoStatus = statusAtivo === "1";
    if (novoStatus === toEdit.is_active) {
      onClose();
      return;
    }

    try {

      setSave(true);

      // Atualizar status
      await service.toggleStatus(toEdit.id);
      await refresh?.();
      onClose();
      if (onSave) { await onSave(); }

      notify.success('Status do item alterado com sucesso!');

    } catch (error: any) {
      notify.error("Erro ao alterar status do item!", error);

    } finally {
      setSave(false);

    }
  };

  return createPortal(
    <>
      <div className="modal-backdrop fade show"></div>

      <div
        className="modal fade show d-block"
        tabIndex={-1}
        onClick={onClose}
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content rounded-0 border">

            {/* HEADER */}
            <div className="modal-header bg-light">
              <h5 className="modal-title fw-bold">
                Status no Sistema
              </h5>

              <button
                type="button"
                className="btn-close rounded-0"
                onClick={onClose}
              />
            </div>

            {/* BODY */}
            <div className="modal-body">
              <div className="d-flex gap-5">

                {/* ATIVO */}
                <div className="form-check">
                  <input
                    className="form-check-input rounded-0"
                    type="radio"
                    name="status"
                    checked={statusAtivo === "1"}
                    onChange={() => setStatusAtivo("1")}
                  />
                  <label className="form-check-label fw-semibold text-success">
                    Ativo
                  </label>

                  <div className="text-muted small">
                    Habilitado no sistema
                  </div>
                </div>

                {/* INATIVO */}
                <div className="form-check">
                  <input
                    className="form-check-input rounded-0"
                    type="radio"
                    name="status"
                    checked={statusAtivo === "0"}
                    onChange={() => setStatusAtivo("0")}
                  />
                  <label className="form-check-label fw-semibold text-danger">
                    Inativo
                  </label>

                  <div className="text-muted small">
                    Desabilitado no sistema
                  </div>
                </div>

              </div>
            </div>

            {/* FOOTER */}
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
                {save ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  "Salvar"
                )}
              </button>

            </div>

          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default ModalStatusUser;
