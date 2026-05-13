// components/DefaultPageLayout.tsx

import React from "react";
import type { ReactNode } from "react";

import { Sidebar } from "../components/Sidebar";

interface DefaultPageLayoutProps {
  children: ReactNode;
}

const DefaultPageLayout: React.FC<DefaultPageLayoutProps> = ({
  children,
}) => {
  return (
    <div
      className="d-flex bg-light"
      style={{
        minHeight: "100vh",
      }}
    >

      <Sidebar />

      <main
        className="d-flex justify-content-center p-4"
        style={{
          width: "100%",
          overflowX: "auto",
        }}
      >

        <div
          className="bg-white border p-4"
          style={{
            width: "1100px",
            minWidth: "1100px",
            minHeight: "100%",
          }}
        >

          {children}

        </div>

      </main>

    </div>
  );
};

export default DefaultPageLayout;