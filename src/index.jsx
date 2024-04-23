import React from "react";
import ReactDOM from "react-dom/client";
import "../src/API/I18n.js";
import App from "./App.jsx";
import "./all.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { HashRouter } from "react-router-dom";
import "react-calendar/dist/Calendar.css";

import "./index.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
