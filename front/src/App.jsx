import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';
import StartPage from './Pages/StartPage';
import SignalFlowPage from './Pages/SignalFlowPage';
import StabilityPage from './Pages/StabilityPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/signal-flow" element={<SignalFlowPage />} />
          <Route path="/stability" element={<StabilityPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;