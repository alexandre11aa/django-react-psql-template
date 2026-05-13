// src/features/Auth/components/PasswordInput.tsx

import { useState } from "react";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PasswordInput({
  value,
  onChange,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="mb-3">

      <label
        htmlFor="senha"
        className="form-label fw-semibold"
      >
        Senha
      </label>

      <div className="input-group">

        <input
          type={show ? "text" : "password"}
          className="form-control rounded-0"
          id="senha"
          name="senha"
          placeholder="Digite sua senha"
          required
          autoComplete="new-password"
          value={value}
          onChange={onChange}
        />

        <button
          type="button"
          className="btn btn-outline-secondary rounded-0"
          onClick={() => setShow(!show)}
        >
          <i className={`bi ${show ? "bi-eye" : "bi-eye-slash"}`} />
        </button>

      </div>

    </div>
  );
}