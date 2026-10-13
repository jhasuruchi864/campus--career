import React from 'react';

export const Card = ({ children, className = '', interactive = false, onClick, ...props }) => {
  return (
    <div
      className={`card ${interactive ? 'card-interactive' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
