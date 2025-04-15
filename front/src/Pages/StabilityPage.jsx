import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StabilityAnalysis from '../components/StabilityAnalysis';
import "../styles/App.css" 

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
              <div className="stability-results">
                <h3>Stability Analysis Results</h3>
                <div className={`status-badge ${stabilityResults.is_stable ? 'stable' : 'unstable'}`}>
                  {stabilityResults.is_stable ? 'Stable' : 'Unstable'}
                </div>
                
                <div className="results-grid">
                  <div className="results-card">
                    <h4>System Properties</h4>
                    <div className="property-item">
                      <span className="property-label">Right-Half Plane Poles:</span>
                      <span className="property-value">{stabilityResults.rhs_poles}</span>
                    </div>
                    {stabilityResults.pole_values && (
                      <div className="property-item">
                        <span className="property-label">Pole Values:</span>
                        <span className="property-value pole-list">
                          {stabilityResults.pole_values.map((pole, index) => (
                            <span key={index} className="pole-value">{pole}</span>
                          ))}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="results-card">
                    <h4>Routh Array</h4>
                    <div className="routh-table-container">
                      <table className="routh-table">
                        <tbody>
                          {stabilityResults.routh_array.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((cell, cellIndex) => {
                                // Detect sign changes for highlighting
                                const isFirstColumn = cellIndex === 0;
                                const prevRowFirstCol = rowIndex > 0 ? stabilityResults.routh_array[rowIndex-1][0] : null;
                                const signChanged = isFirstColumn && prevRowFirstCol !== null && 
                                                   ((cell > 0 && prevRowFirstCol < 0) || 
                                                    (cell < 0 && prevRowFirstCol > 0));
                                
                                return (
                                  <td 
                                    key={cellIndex} 
                                    className={isFirstColumn ? (signChanged ? 'sign-change' : 'first-column') : ''}
                                  >
                                    {typeof cell === 'number'
                                      ? Math.abs(cell) < 0.0001 && cell !== 0
                                        ? cell.toExponential(4)
                                        : cell.toFixed(4)
                                      : cell}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>


      </main>
    </div>
  );
}

export default StabilityPage;