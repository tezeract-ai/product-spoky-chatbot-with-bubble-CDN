import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import DynamicRouteComponent from './DynamicRouteComponent';
import './App.css';
import ChatBot from './ChatBot';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/spoky-chatbot/:id" element={<ChatBot />} />
          <Route path='/dynamic/:id' element={<DynamicRouteComponent/>}></Route>
          <Route path='/ChatBot' component={ChatBot}></Route>

        </Routes>
      </Router>
    </>
  )
}

export default App
