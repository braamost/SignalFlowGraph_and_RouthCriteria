import React, { useState } from 'react';
import { analyzeStability } from '../services/api';

function StabilityAnalysis({ onResultsReceived }) {
  const [error, setError] = useState(null);
  const [degree, setDegree] = useState(3);
  const [equation, setEquation] = useState(new Array(4).fill(''));
  const [loading, setLoading] = useState(false);

  const handleDegreeChange = (e) => {
    if(!isNaN(e.target.value)) {
      const newDegree = parseInt(e.target.value);
      if(newDegree>0){
      setDegree(newDegree);
      setEquation(new Array(newDegree + 1).fill(''));
      setError(null);
      }   
    }
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (equation.some(coef => coef === '')) {
      setError('Please fill in all coefficients of the characteristic equation');
      return;
    }
    setLoading(true);

    try {
      // console.log(equation) 
      const newEquation = equation.map((coef, index) => [degree - index, parseFloat(coef)]);
      // console.log(newEquation);
      const results = await analyzeStability({ equation: newEquation });
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
          <label htmlFor="degree">Degree of Equation:</label>
          <input
            type="number"
            id="degree"
            value={degree}
            onChange={handleDegreeChange}
            placeholder="3"
            className="degree-input"
            min="0"
            max="20"
          />

          <label>Characteristic Equation Coefficients:</label>
          { equation.map((eq, index) => (
            <input
              key={index}
              type="number"
              value={eq}
              onChange={(e) => {
                const newEquation = [...equation];
                newEquation[index] = e.target.value;
                setEquation(newEquation);
                setError(null);
              }}
              placeholder={`Coefficient of x^${degree - index}`}
            />
          ))}
        </div>
        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Stability'}
        </button>
      </form>
    </div>
  );
}

export default StabilityAnalysis;
