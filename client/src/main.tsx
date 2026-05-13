import React from "react";
import App from "./App.tsx";
import ReactDOM from "react-dom/client";

import "./styles/global.css";
import "./styles/main.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
