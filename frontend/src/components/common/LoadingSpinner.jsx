import React from 'react';

function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      {text && <p>{text}</p>}
    </div>
  );
}

export default LoadingSpinner;
