import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${className}`}
    >
      <div className="p-6">{children}</div>
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 ${className}`}>
      {children}
    </div>
  )
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
    icon?: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '', icon, ...props }) => {
    return (
        <h2 {...props} className={`text-xl font-bold text-gray-800 dark:text-white flex items-center gap-3 ${className}`}>
            {icon}
            {children}
        </h2>
    )
}