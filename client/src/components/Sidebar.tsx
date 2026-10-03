// src/components/Sidebar.tsx

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import notify from "../services/notificationService";
import authService from "../features/Auth/services/authService";

import type { MenuItem } from "../types/menuType";
import { menuSuperior, menuRodape } from "../utils/menu";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const paginaAtual = location.pathname;

  const user = localStorage.getItem("user");

  const userAccessLevel = user
    ? JSON.parse(user).userAccessLevel
    : "";

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {}

    localStorage.clear();

    notify.success("Você saiu do Sistema, até logo!");

    navigate("/login", { replace: true });
  };

  const renderMenu = (menu: MenuItem[]) =>
    menu
      .filter(
        (item) =>
          !item.allowedRoles ||
          item.allowedRoles.includes(userAccessLevel)
      )
      .map((item, index) => (
        <li className="nav-item mb-1" key={index}>

          {item.subitens ? (

            <details
              open={item.subitens.some(
                (sub) => sub.href === paginaAtual
              )}
            >

              <summary
                className="d-flex align-items-center px-3 py-2 border text-dark bg-light"
                style={{
                  cursor: "pointer",
                  listStyle: "none",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                <i className={`${item.icone} me-2`} />

                {isOpen && (
                  <span>{item.titulo}</span>
                )}

              </summary>

              <ul className="nav flex-column">

                {item.subitens
                  .filter(
                    (sub) =>
                      !sub.allowedRoles ||
                      sub.allowedRoles.includes(userAccessLevel)
                  )
                  .map((sub, i) => (

                    <li className="nav-item" key={i}>

                      <a
                        href={sub.href}
                        className={`nav-link border border-top-0 text-dark rounded-0 px-4 py-2 ${
                          paginaAtual === sub.href
                            ? "bg-dark text-white"
                            : "bg-white"
                        }`}
                        style={{
                          fontSize: "14px",
                        }}
                      >
                        <i className={`${sub.icone} me-2`} />

                        {isOpen && (
                          <span>{sub.titulo}</span>
                        )}

                      </a>

                    </li>

                  ))}

              </ul>

            </details>

          ) : item.titulo === "Logout" ? (

            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-light border rounded-0 w-100 text-start px-3 py-2"
              style={{
                fontSize: "14px",
              }}
            >
              <i className={`${item.icone} me-2`} />

              {isOpen && (
                <span>{item.titulo}</span>
              )}

            </button>

          ) : (

            <a
              href={item.href}
              className={`nav-link border rounded-0 px-3 py-2 ${
                paginaAtual === item.href
                  ? "bg-dark text-white"
                  : "bg-white text-dark"
              }`}
              style={{
                fontSize: "14px",
              }}
            >
              <i className={`${item.icone} me-2`} />

              {isOpen && (
                <span>{item.titulo}</span>
              )}

            </a>

          )}

        </li>
      ));

  return (
    <nav
      className="d-flex flex-column border-end bg-light"
      style={{
        width: isOpen ? "260px" : "70px",
        minHeight: "100vh",
        transition: "0.2s",
      }}
    >

      <div className="border-bottom p-3 bg-white">

        <div
          className="d-flex justify-content-between align-items-center"
        >

          {isOpen && (
            <strong style={{ fontSize: "16px" }}>
              SYSTEM
            </strong>
          )}

          <button
            className="btn btn-sm btn-outline-secondary rounded-0"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "❮" : "❯"}
          </button>

        </div>

      </div>

      <div className="flex-grow-1 p-2">

        <ul className="nav flex-column mb-4">
          {renderMenu(menuSuperior)}
        </ul>

      </div>

      <div className="border-top p-2 bg-white">

        <ul className="nav flex-column">
          {renderMenu(menuRodape)}
        </ul>

        {isOpen && (
          <div className="text-center small text-muted mt-3">
            © System
          </div>
        )}

      </div>

    </nav>
  );
}