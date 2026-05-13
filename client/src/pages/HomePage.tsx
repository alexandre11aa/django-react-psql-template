// src/features/Home/pages/HomePage.tsx

import DefaultPageLayout from "../components/DefaultPageLayout";

export const HomePage = () => {

  return (
    <DefaultPageLayout>
     
      <div
        className="d-flex flex-column justify-content-center align-items-center text-center"
        style={{
          minHeight: "70vh",
        }}
      >

        <h2 className="fw-bold mb-3">
          Template Monolítico Django + React
        </h2>

        <p
          className="text-muted mb-5"
          style={{ maxWidth: "700px" }}
        >
          Este projeto é um template base para aplicações web
          utilizando arquitetura monolítica em três camadas.
        </p>

        <div className="row w-100 justify-content-center g-4">

          <div className="col-md-4">

            <div className="border bg-white h-100 p-4">

              <h5 className="fw-bold mb-3">
                Backend
              </h5>

              <p className="mb-0">
                Desenvolvido com Django e Django REST Framework,
                responsável pelas regras de negócio,
                autenticação, APIs e persistência de dados.
              </p>

            </div>

          </div>

          <div className="col-md-4">

            <div className="border bg-white h-100 p-4">

              <h5 className="fw-bold mb-3">
                Frontend
              </h5>

              <p className="mb-0">
                Interface construída com React e TypeScript,
                organizada por features e integrada aos
                serviços da API.
              </p>

            </div>

          </div>

          <div className="col-md-4">

            <div className="border bg-white h-100 p-4">

              <h5 className="fw-bold mb-3">
                Banco de Dados
              </h5>

              <p className="mb-0">
                Utiliza PostgreSQL executando em ambiente
                containerizado com Docker para facilitar
                deploy e desenvolvimento.
              </p>

            </div>

          </div>

        </div>

      </div>
      
    </DefaultPageLayout>                    
  );
};
