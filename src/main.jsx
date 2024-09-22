import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";

import { SessionProvider } from "./Contexts/sessionContext";
import { GuestSessionProvider } from "./Contexts/guestSessionContext";

import App from "./App.jsx";
import Modal from "react-modal";

Modal.setAppElement("#root");

import "./index.css";

import "./assets/styles/reset.css";
import "./assets/styles/fonts.css";
import "./assets/styles/variables.css";
import "./assets/styles/defaults.css";
import "./assets/styles/helpers.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <SessionProvider>
        <GuestSessionProvider>
          <App />
        </GuestSessionProvider>
      </SessionProvider>
    </BrowserRouter>
  </React.StrictMode>
);
