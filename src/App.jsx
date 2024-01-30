import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ChatBot from './ChatBot';
function App() {
console.log("app");
  return (
    <>
      <Router>
        <Routes>
          <Route path="/spoky-chatbot/:id" element={<ChatBot />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
