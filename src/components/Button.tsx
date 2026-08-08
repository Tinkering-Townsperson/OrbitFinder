import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseStyles = "px-8 py-3.5 rounded-full font-bold text-base tracking-wide transition-all duration-200 inline-flex items-center justify-center gap-2 active:scale-95 outline-none select-none";
  
  const variants = {
    primary: "bg-[#cf7cc2] text-white shadow-lg hover:opacity-90",
    secondary: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20",
    ghost: "bg-transparent text-white/70 hover:text-white hover:bg-white/10"
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
