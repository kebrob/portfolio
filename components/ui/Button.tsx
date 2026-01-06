import Link from 'next/link';

interface ButtonProps {
  href?: string;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'outline';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function Button({ 
  href, 
  type = 'button',
  variant = 'primary', 
  children, 
  onClick,
  disabled = false,
  className = ''
}: ButtonProps) {
  const baseStyles = 'px-8 py-3 rounded-lg font-medium transition-all inline-block text-center';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
  };
  
  const styles = `${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={styles}
    >
      {children}
    </button>
  );
}
