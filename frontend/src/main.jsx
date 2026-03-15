import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter } from "react-router-dom";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary:    { main: "#4F8EF7" },
    secondary:  { main: "#A78BFA" },
    success:    { main: "#34D399" },
    warning:    { main: "#FBBF24" },
    error:      { main: "#F87171" },
    background: {
      default: "#0F1117",
      paper:   "#1A1D2E",
    },
    text: {
      primary:   "#F1F5F9",
      secondary: "#94A3B8",
    },
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#1A1D2E",
          border: "1px solid rgba(255,255,255,0.06)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 10,
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #4F8EF7, #7C3AED)",
          boxShadow: "0 4px 15px rgba(79,142,247,0.3)",
          "&:hover": {
            boxShadow: "0 6px 20px rgba(79,142,247,0.5)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            backgroundColor: "rgba(255,255,255,0.04)",
            "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
            "&:hover fieldset": { borderColor: "rgba(79,142,247,0.5)" },
            "&.Mui-focused fieldset": { borderColor: "#4F8EF7" },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#1A1D2E",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "none",
          backgroundColor: "#1A1D2E",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#12152A",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "rgba(79,142,247,0.08)",
          },
          "& .MuiDataGrid-cell": {
            borderColor: "rgba(255,255,255,0.04)",
          },
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);