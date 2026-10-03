// src/features/User/pages/ManageUserPage.tsx

import React, { useState, useEffect } from "react";
import notify from "../../../services/notificationService";
import DefaultPageLayout from "../../../components/DefaultPageLayout";
import Pagination from "../../../components/Pagination";
import ModalRegisterEditUser from "../components/ModalRegisterEditUser";
import ModalStatus from "../../../components/ModalStatus";
import type { User } from "../types/userType";
import userService from "../services/userService";

const PAGE_SIZE = 10;

export const ManageUserPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [filterField, setFilterField] =
    useState<"name" | "email" | "access_level">("name");

  const [modalRegisterOpen, setModalRegisterOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [modalStatusOpen, setModalStatusOpen] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [activeFilter, setFilter] = useState<"todos" | "ativos" | "inativos">("ativos");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async (page: number) => {
    try {
      setLoading(true);

      const data = await userService.search(page, PAGE_SIZE, {
        searchField: filterField,
        searchValue: searchTerm,
        isActive: activeFilter === "todos" ? undefined : activeFilter === "ativos",
      });

      setTotalPages(Math.max(1, Math.ceil(data.count / PAGE_SIZE)));
      setUsers(data.results);
      setCurrentPage(page);
    } catch (error: any) {
      notify.error("Erro ao carregar usuários!", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, [searchTerm, filterField, activeFilter]);

  const handlePageChange = (page: number) => {
    if (page < 1) return;
    if (page > totalPages) return;
    fetchUsers(page);
  };

  return (
    <DefaultPageLayout>
      <ModalRegisterEditUser
        isOpen={modalRegisterOpen}
        onClose={() => setModalRegisterOpen(false)}
        userToEdit={editingUser}
        refreshUsers={() => fetchUsers(currentPage)}
      />

      <ModalStatus
        isOpen={modalStatusOpen}
        onClose={() => setModalStatusOpen(false)}
        toEdit={editingUser}
        refresh={() => fetchUsers(currentPage)}
        service={userService}
      />

      <div className="border-bottom pb-3 mb-4 d-flex justify-content-between align-items-center">
        
        <div>
          <h3 className="fw-bold mb-1">Gerenciamento de Acesso</h3>
          <small className="text-muted">Acessos cadastrados no sistema</small>
        </div>

        <button
          className="btn btn-dark rounded-0"
          onClick={() => {
            setEditingUser(null);
            setModalRegisterOpen(true);
          }}
        >
          Novo Acesso
        </button>

      </div>

      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label fw-semibold">Filtro</label>
          <select
            className="form-select rounded-0"
            value={filterField}
            onChange={(e) => setFilterField(e.target.value as any)}
          >
            <option value="name">Nome</option>
            <option value="email">Email</option>
            <option value="access_level">Acesso</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label fw-semibold">Pesquisar</label>
          <div className="input-group">
            <input
              className="form-control rounded-0"
              placeholder="Digite para buscar..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={() => setSearchTerm(inputValue)}
              onKeyDown={(e) => { if (e.key === "Enter") setSearchTerm(inputValue); }}
            />
            <button
              type="button"
              className="btn btn-dark rounded-0"
              onClick={() => setSearchTerm(inputValue)}
            >
              Ir
            </button>
          </div>
        </div>

        <div className="col-md-4">
          <label className="form-label fw-semibold">Status</label>

          <div className="btn-group w-100">
            <button
              className={`btn btn-outline-dark rounded-0 ${
                activeFilter === "todos" ? "active" : ""
              }`}
              onClick={() => setFilter("todos")}
            >
              Todos
            </button>

            <button
              className={`btn btn-outline-dark rounded-0 ${
                activeFilter === "ativos" ? "active" : ""
              }`}
              onClick={() => setFilter("ativos")}
            >
              Ativos
            </button>

            <button
              className={`btn btn-outline-dark rounded-0 ${
                activeFilter === "inativos" ? "active" : ""
              }`}
              onClick={() => setFilter("inativos")}
            >
              Inativos
            </button>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <colgroup>
            <col style={{ width: "20%" }} />  {/* Email */}
            <col style={{ width: "20%" }} /> {/* Nome */}
            <col style={{ width: "20%" }} /> {/* Acesso */}
            <col style={{ width: "20%" }} /> {/* Status */}
            <col style={{ width: "20%" }} /> {/* Ações */}
          </colgroup>
          <thead className="table-light">
            <tr>
              <th>Email</th>
              <th>Nome</th>
              <th>Acesso</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  <div className="spinner-border" />
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.name}</td>
                  <td>{user.access_level}</td>

                  <td>
                    <span
                      className={`badge rounded-0 ${
                        user.is_active ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {user.is_active ? "Ativo" : "Inativo"}
                    </span>
                  </td>

                  <td className="text-center">
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm rounded-0"
                        onClick={() => {
                          setEditingUser(user);
                          setModalRegisterOpen(true);
                        }}
                      >
                        Editar
                      </button>

                      <button
                        className="btn btn-outline-danger btn-sm rounded-0"
                        onClick={() => {
                          setEditingUser(user);
                          setModalStatusOpen(true);
                        }}
                      >
                        Status
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  Nenhum usuário encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINAÇÃO */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </DefaultPageLayout>
  );
};
