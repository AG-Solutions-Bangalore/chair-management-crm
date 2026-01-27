import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppProvider from "./lib/context-panel.jsx";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "./lib/theme-context.jsx";

const queryClient = new QueryClient(); 

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      // basename="/admin"
    >
      <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppProvider>
          <App />
        </AppProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
