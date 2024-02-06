import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ChatBot from "./ChatBot";
import { Box, Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

function App() {
  // console.log("app");
  // useEffect(() => {
  //   console.log("useEffect");
  //   Access the functions from the library when the component mounts
  //   Access the functions from the library when the component mounts
  //   const result = window.statusChecker.textAccordingToType("onTraining");
  //   console.log(result);
  //    console.log(window);
  // }, []);
  // const [loading, setLoading] = useState(false);
  return (
    <>
      <ChatBot />
    </>
  );
}

export default App;
