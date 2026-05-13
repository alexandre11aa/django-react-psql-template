// src/pages/MaintenancePage.tsx

import DefaultPageLayout from "../components/DefaultPageLayout";

export const MaintenancePage = () => {
  return (
    <DefaultPageLayout>

      <div
        className="d-flex flex-column justify-content-center align-items-center text-center"
        style={{
          minHeight: "70vh",
        }}
      >

        <div className="mb-4">
          <i
            className="bi bi-tools"
            style={{
              fontSize: "64px",
            }}
          />
        </div>

        <h2 className="fw-bold mb-4">
          Página em Desenvolvimento!
        </h2>

        <p className="mb-3">
          Esta funcionalidade ainda está em fase de
          desenvolvimento/manutenção.
        </p>

      </div>

    </DefaultPageLayout>
  );
};