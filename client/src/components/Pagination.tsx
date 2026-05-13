// src/components/Pagination.tsx

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 5) return null;

  const maxVisible = 10;

  let startPage = currentPage - Math.floor(maxVisible / 2);
  let endPage = currentPage + Math.floor(maxVisible / 2);

  if (startPage < 1) {
    startPage = 1;
    endPage = Math.min(totalPages, maxVisible);
  } else if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, totalPages - maxVisible + 1);
  }

  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <nav className="d-flex justify-content-center mt-4">
      <ul className="pagination pagination-sm">

        {/* PRIMEIRA */}
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link rounded-0"
            onClick={() => onPageChange(1)}
          >
            «
          </button>
        </li>

        {/* ANTERIOR */}
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link rounded-0"
            onClick={() => onPageChange(currentPage - 1)}
          >
            ‹
          </button>
        </li>

        {/* PÁGINAS */}
        {visiblePages.map((page) => (
          <li
            key={page}
            className={`page-item ${page === currentPage ? "active" : ""}`}
          >
            <button
              className="page-link rounded-0"
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}

        {/* PRÓXIMA */}
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button
            className="page-link rounded-0"
            onClick={() => onPageChange(currentPage + 1)}
          >
            ›
          </button>
        </li>

        {/* ÚLTIMA */}
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button
            className="page-link rounded-0"
            onClick={() => onPageChange(totalPages)}
          >
            »
          </button>
        </li>

      </ul>
    </nav>
  );
};

export default Pagination;
