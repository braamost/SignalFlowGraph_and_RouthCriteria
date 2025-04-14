import React, { useState } from 'react';
import './styles/App.css';
import GraphEditor from './components/GraphEditor';
import ResultDisplay from './components/ResultDisplay';
import StabilityAnalysis from './components/StabilityAnalysis';

function App() {
  const [activeTab, setActiveTab] = useState('signalFlow');
  const [graphResults, setGraphResults] = useState(null);
  const [stabilityResults, setStabilityResults] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Signal Flow Graph & Stability Analysis</h1>
        <div className="tabs">
          <button 
            className={activeTab === 'signalFlow' ? 'active' : ''} 
            onClick={() => setActiveTab('signalFlow')}
          >
            Signal Flow Graph
          </button>
          <button 
            className={activeTab === 'stability' ? 'active' : ''} 
            onClick={() => setActiveTab('stability')}
          >
            Stability Analysis
          </button>
        </div>
      </header>

      <main>
        {activeTab === 'signalFlow' ? (
          <div className="signal-flow-container">
            <GraphEditor onResultsReceived={setGraphResults} />
            {graphResults && <ResultDisplay results={graphResults} />}
          </div>
        ) : (
          <div className="stability-container">
            <StabilityAnalysis onResultsReceived={setStabilityResults} />
            {stabilityResults && (
              <div className="stability-results">
                <h3>Stability Analysis Results</h3>
                <p>System is: {stabilityResults.is_stable ? 'Stable' : 'Unstable'}</p>
                {!stabilityResults.is_stable && (
                  <div>
                    <p>Number of RHS poles: {stabilityResults.rhs_poles}</p>
                    <p>Pole values: {stabilityResults.pole_values.join(', ')}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
