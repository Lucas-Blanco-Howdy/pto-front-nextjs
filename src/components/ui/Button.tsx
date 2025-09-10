'use client';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button = ({ children, variant = 'primary', className = "", ...props }: ButtonProps) => (
  <button 
    className={`px-4 py-2 rounded-md font-medium transition-colors ${
      variant === 'primary' 
        ? 'bg-[#448880] hover:bg-[#448880] active:bg-[#448880] focus:bg-[#448880] text-white' 
        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
    } ${className}`}
    {...props}
  >
    {children}
  </button>
);
