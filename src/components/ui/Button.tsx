'use client';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button = ({ children, variant = 'primary', className = "", ...props }: ButtonProps) => (
  <button 
    className={`px-4 py-2 rounded-md font-medium transition-colors ${
      variant === 'primary' 
        ? 'bg-[#8B8BD7] hover:bg-[#7979c7] text-white' 
        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
    } ${className}`}
    {...props}
  >
    {children}
  </button>
);
