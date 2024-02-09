import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ChatBot from "./ChatBot";
import { Box, Button, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

function App() {
  let dateFormatted;
  // console.log("app");
  // useEffect(() => {
  //   console.log("useEffect");
  //    Access the functions from the library when the component mounts
  //   Access the functions from the library when the component mounts
  //   const result = window.statusChecker.textAccordingToType("onTraining");
  //   dateFormatted = window.dateFormatter.formatNotificationsDate(
  //     "2024-01-05T07:29:48.986Z"
  //   );
  //   const uuid = window.uuidGenerator.generateShortUniqueId();
  //   console.log(uuid);
  //   console.log(dateFormatted?.date, "date----------------");
  //   console.log(dateFormatted?.time, "Time----------------");
  //   console.log(result);
  //   console.log(window);
  // }, []);
  // const [loading, setLoading] = useState(false);
  return (
    <>
      <ChatBot />
    </>
  );
}

export default App;
