import { Link } from 'react-router-dom';

export default function LearnovaLogo({ showText = true, size = 'md', className = '' }) {
  const iconSizes = {
    sm: 'w-7 h-7 p-1',
    md: 'w-9 h-9 p-1.5',
    lg: 'w-11 h-11 p-2',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link to="/" className={`inline-flex items-center gap-3 group focus:outline-none ${className}`}>

      <div
        className={`${iconSizes[size] || iconSizes.md} rounded-lg bg-[#FAF7F2] shadow-sm flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}
        title="Learnova"
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-accent-600"
        >

          <path
            d="M8 12C8 9.79 9.79 8 12 8H18V28H12C9.79 28 8 26.21 8 24V12Z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M32 12C32 9.79 30.21 8 28 8H22V28H28C30.21 28 32 26.21 32 24V12Z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 9V29"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <path
            d="M13 14H16M13 19H16M24 14H27M24 19H27"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M12 28C14.5 28 17 30 20 30C23 30 25.5 28 28 28"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showText && (
        <span
          className={`font-display font-bold tracking-tight text-white transition-colors duration-200 group-hover:text-accent-400 ${
            textSizes[size] || textSizes.md
          }`}
        >
          Learnova
        </span>
      )}
    </Link>
  );
}
