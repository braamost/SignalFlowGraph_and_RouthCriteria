import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GraphEditor from '../components/GraphEditor';
import ResultDisplay from '../components/ResultDisplay';
import "../styles/App.css"

function SignalFlowPage() {
  const [graphResults, setGraphResults] = useState(null);
  return (
    <div className="page-container">
      <header className="App-header">
        <h1>Signal Flow Graph</h1>
        <div className="back">
          <Link to="/" className="back-link">← Back to Start</Link>
        </div>
      </header>
      <main>
        <div className="signal-flow-container">
          <GraphEditor onResultsReceived={setGraphResults} />
          {graphResults && <ResultDisplay results={graphResults} />}
        </div>
      </main>
    </div>
  );
}

export default SignalFlowPage;