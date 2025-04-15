import React from 'react';

function ResultDisplay({ results }) {
  if (!results) return null;
  console.log('Results:', results);
  return (
    <div className="results-display">
      <h2>Signal Flow Graph Analysis Results</h2>
      
      <div className="result-section">
        <h3>Forward Paths</h3>
        <ul>
          {results.forward_paths && results.forward_paths.map((path, index) => (
            <li key={`path-${index}`}>
             Path {index + 1}: {path.join(' → ')} (Gain: {
                                                            /^[\d+\-*/().\s]+$/.test(results.forward_path_gains[index])
                                                               ? eval(results.forward_path_gains[index]).toFixed(3)
                                                               : results.forward_path_gains[index]
          })</li>
          ))}
        </ul>
      </div>
      
      <div className="result-section">
        <h3>Individual Loops</h3>
        <ul>
          {results.loops && results.loops.map((loop, index) => (
            <li key={`loop-${index}`}>
             Loop {index + 1}: {loop.join(' → ')} (Gain: {
                                                            /^[\d+\-*/().\s]+$/.test(results.loop_gains[index])
                                                                ? eval(results.loop_gains[index]).toFixed(3)
                                                                : results.loop_gains[index]
          })</li>
          ))}
        </ul>
      </div>
      
      <div className="result-section">
        <h3>Delta Values</h3>
        <p>Δ = {
                 /^[\d+\-*/().\s]+$/.test(results.delta)
                      ? eval(results.delta).toFixed(3)
                      : results.delta
       }</p>
        <ul>
          {results.delta_values && results.delta_values.map((delta, index) => (
            <li key={`delta-${index}`}>
              Δ{index + 1} = {/^[\d+\-*/().\s]+$/.test(delta)
                                ? eval(delta).toFixed(3)
                                : delta
          }</li>
          ))}
        </ul>
      </div>
      
      <div className="result-section">
        <h3>Transfer Function</h3>
        <p>{
            /^[\d+\-*/().\s]+$/.test(results.transfer_function) // check if only numbers/operators
                 ? eval(results.transfer_function)
                 : results.transfer_function
      }</p>
      </div>
    </div>
  );
}

export default ResultDisplay;
