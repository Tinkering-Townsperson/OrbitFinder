import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseStyles = "px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 inline-flex items-center justify-center gap-2 tracking-wide active:scale-95 outline-none";
  
  const variants = {
    primary: "bg-[#cf7cc2] text-white shadow-lg",
    secondary: "bg-white/5 backdrop-blur-md border border-white/20 text-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
