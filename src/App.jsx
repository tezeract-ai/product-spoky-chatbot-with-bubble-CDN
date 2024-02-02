import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ChatBot from "./ChatBot";
import { Box } from "@mui/material";
function App() {
  console.log("app");
  return (
    <>
      <ChatBot />
    </>
  );
}

export default App;
