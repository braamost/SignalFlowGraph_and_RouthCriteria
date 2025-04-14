import React, { useState } from 'react';
import { analyzeStability } from '../services/api';

function StabilityAnalysis({ onResultsReceived }) {
  const [equation, setEquation] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!equation) {
      alert('Please enter a characteristic equation');
      return;
    }
    
    setLoading(true);
    
    try {
      const results = await analyzeStability({ equation });
      onResultsReceived(results);
    } catch (error) {
      console.error('Error analyzing stability:', error);
      alert('Error analyzing stability. See console for details.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="stability-analysis">
      <h2>Routh Stability Analysis</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="equation">Characteristic Equation:</label>
          <input
            type="text"
            id="equation"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            placeholder="e.g., s^5+s^4+10s^3+72s^2+152s+240"
            className="equation-input"
          />
          <p className="help-text">
            Enter the characteristic equation using the format shown in the placeholder.
            Use s^n for powers of s.
          </p>
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Stability'}
        </button>
      </form>
    </div>
  );
}

export default StabilityAnalysis;