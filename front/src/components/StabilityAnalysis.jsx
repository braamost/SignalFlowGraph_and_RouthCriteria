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
    }else {
      setError('Degree must be a positive integer');
    }
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (equation.some(coef => coef === '')) {
      setError('Please fill in all coefficients of the characteristic equation');
      return;
    }

    if(equation[0] === '0'){
      setError('Leading coefficient cannot be 0');
      return;
    }
    setLoading(true);

    try {
      console.log(equation) 
      const results = await analyzeStability({ 
        degree: degree,
        equation: equation 
      });
      onResultsReceived(results);
      window.scrollTo({
        top: 100000,
        left: 100000,
        behavior: 'smooth',
      });
    } catch (error) {
      console.error('Error analyzing stability:', error);
      setError(`${error.response.statusText} . See console for details.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stability-analysis">
      <h2>Routh Stability Analysis</h2>
      <form onSubmit={handleSubmit} className="stability-form">
        <div className="form-group degree-group">
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
        </div>
        
        <div className="form-group coefficients-group">
          <label>Characteristic Equation Coefficients:</label>
          <div className="coefficients-container">
            {equation.map((coef, index) => (
              <div className="coefficient-input" key={index}>
                <input
                  type="number"
                  value={coef}
                  onChange={(e) => {
                    const newEquation = [...equation];
                    newEquation[index] = e.target.value;
                    setEquation(newEquation);
                    setError(null);
                  }}
                  className="coefficient-field"
                  step="any"
                />
                {degree - index > 0 && <label className="power-label">s{degree - index != 1 && <sup>{degree - index}</sup>} + </label>}
              </div>
            ))}
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button 
          type="submit" 
          disabled={loading} 
          className={`submit-button ${loading ? 'loading' : ''}`}
        >
          {loading ? 'Analyzing...' : 'Analyze Stability'}
        </button>
      </form>
    </div>
  );
}

export default StabilityAnalysis;
