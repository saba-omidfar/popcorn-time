import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { BrowserRouter } from "react-router-dom";

import "./assets/styles/reset.css";
import "./assets/styles/fonts.css";
import "./assets/styles/variables.css";
import "./assets/styles/defaults.css";
import "./assets/styles/helpers.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
