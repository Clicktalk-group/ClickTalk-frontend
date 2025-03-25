import React from 'react';
import './LoadingIndicator.scss';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="loading-indicator">
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  );
};

export default LoadingIndicator;
