import { createTheme, ThemeProvider } from "@mui/material";
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

const theme = createTheme({
  components: {
    MuiIcon: {
      defaultProps: {
        className: "material-symbols-outlined",
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);
