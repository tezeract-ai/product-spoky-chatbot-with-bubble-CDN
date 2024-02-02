import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Create a new div element
const rootDiv = document.createElement("div");
rootDiv.id = "chatbot-root";

// Append the div to the body (or another element) - adjust as needed
document.body.appendChild(rootDiv);

// Render your React component inside the dynamically created div
ReactDOM.createRoot(rootDiv).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
