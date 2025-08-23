import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import GlobalStyles from "@mui/material/GlobalStyles";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "../styles/global.css";
import { Toaster } from "sonner";
import { PageRouter } from "../router";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "../providers/theme-provider";
import { StyledEngineProvider } from "@mui/material/styles";
import { QueryClientProvider } from "../providers/query-client-provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider>
      <ThemeProvider>
        <StyledEngineProvider enableCssLayer>
          <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
          <CssBaseline />
          <PageRouter />
          <Toaster />
        </StyledEngineProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
