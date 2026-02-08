import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl ${className}`}>
      {/* Decorative gradient blob */}
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-aqua-500/10 blur-3xl pointer-events-none" />
      
      {title && (
        <div className="border-b border-white/5 px-6 py-4">
          <h3 className="text-lg font-semibold text-white tracking-wide">{title}</h3>
        </div>
      )}
      <div className="p-6 relative z-10">
        {children}
      </div>
    </div>
  );
};
