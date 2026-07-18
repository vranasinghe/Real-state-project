import React from 'react';
import clsx from 'clsx';

export const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  className = '',
  disabled = false,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-heading font-bold text-sm tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-btn py-2.5 px-6 shadow-sm';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover active:scale-[0.98]',
    secondary: 'bg-primary-light text-primary hover:bg-primary/20 active:scale-[0.98]',
    outline: 'border border-primary text-primary bg-transparent hover:bg-primary-light active:scale-[0.98]',
    dark: 'bg-darkGreen text-white hover:bg-opacity-95 active:scale-[0.98]',
    white: 'bg-white text-textDark hover:bg-gray-100 active:scale-[0.98]'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(baseStyle, variants[variant], className, disabled && 'opacity-55 cursor-not-allowed')}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
