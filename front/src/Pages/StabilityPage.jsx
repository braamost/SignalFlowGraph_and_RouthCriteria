import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StabilityAnalysis from '../components/StabilityAnalysis';
import "../styles/App.css" 
import StabilityResultDisplay from '../components/StabilityResultDisplay';

function StabilityPage() {
  const [stabilityResults, setStabilityResults] = useState(null);

  return (
    <div className="page-container">
      <header className="App-header">
        <h1>Stability Analysis</h1>
        <div className="back">
          <Link to="/" className="back-link">← Back to Start</Link>
        </div>
      </header>
      <main>

       <div className="stability-container">
            <StabilityAnalysis onResultsReceived={setStabilityResults} />
            {stabilityResults && (
              <StabilityResultDisplay stabilityResults={stabilityResults} />
            )}
          </div>
      </main>
    </div>
  );
}

export default StabilityPage;