import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ChatBot from "./ChatBot";
import { Box, Button, ThemeProvider, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import theme from "./theme/theme";

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <ChatBot />
      </ThemeProvider>
    </>
  );
}

export default App;
