import React from 'react';
import clsx from 'clsx';

export const Badge = ({
  text,
  variant = 'default',
  className = ''
}) => {
  const baseStyle = 'inline-flex items-center text-[11px] font-heading font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-pill shadow-sm';
  
  const variants = {
    default: 'bg-primary text-white',
    hot: 'bg-red-500 text-white animate-pulse',
    new: 'bg-blue-600 text-white',
    sold: 'bg-gray-500 text-white',
    rent: 'bg-emerald-700 text-white',
    sale: 'bg-primary text-white'
  };

  return (
    <span className={clsx(baseStyle, variants[variant], className)}>
      {text}
    </span>
  );
};

export default Badge;
