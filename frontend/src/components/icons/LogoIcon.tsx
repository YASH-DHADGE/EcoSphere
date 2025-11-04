
import React from 'react';

const LogoIcon: React.FC<{ className?: string }> = ({ className = 'h-8 w-auto' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.36 14.36C16.05 14.67 15.58 14.67 15.27 14.36L12 11.09L8.73 14.36C8.42 14.67 7.95 14.67 7.64 14.36C7.33 14.05 7.33 13.58 7.64 13.27L11.27 9.64C11.66 9.25 12.34 9.25 12.73 9.64L16.36 13.27C16.67 13.58 16.67 14.05 16.36 14.36Z"
      className="fill-primary-green"
    />
     <path 
      d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM11 16V12L8 15V17H16V15L13 12V16H11Z" 
      className="fill-primary-green opacity-50"
    />
  </svg>
);

export default LogoIcon;
