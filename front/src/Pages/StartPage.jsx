import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/App.css";

function StartPage() {
  const navigate = useNavigate();

  return (
    <div className="start-page">
      <div className="start-content">
        <h1>Signal Flow Graph & Stability Analysis</h1>
        <p>Select an option to begin</p>
        
        <div className="option-cards">
          <div className="option-card" onClick={() => navigate('/signal-flow')}>
            <h2>Signal Flow Graph</h2>
            <p>Create and analyze signal flow graphs with Mason's gain formula</p>
            <button className="option-btn">Start</button>
          </div>         
          <div className="option-card" onClick={() => navigate('/stability')}>
            <h2>Stability Analysis</h2>
            <p>Analyze system stability using Routh-Hurwitz criterion</p>
            <button className="option-btn">Start</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartPage;