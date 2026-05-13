// src/App.tsx

import { BrowserRouter as Router } from "react-router-dom";
import { AppRouter } from "./routes/Routes";
import Notification from "./components/Notification";

export default function App() {
  return (
    <Router>

      {/* Feedback */}
      <Notification />

      {/* Rotas do app */}
      <AppRouter />

    </Router>
  );
}
