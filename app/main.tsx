import Alert from "@mui/material/Alert";
import React from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { App } from "./App.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    errorElement: <Alert severity="error">Route not found</Alert>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CssBaseline />
    <RouterProvider router={router} />
  </React.StrictMode>,
);
