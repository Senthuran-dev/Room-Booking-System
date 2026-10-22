import React from 'react';
import logoImg from '../../assets/logo.png';

/**
 * StayEase Brand Logo Component
 * Loads and renders the official logo.png image asset.
 */
export const LogoIcon = ({ size = 36, className = '' }) => {
  return (
    <img 
      src={logoImg} 
      alt="StayEase Logo" 
      width={size} 
      height={size} 
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`flex-shrink-0 object-contain transition-transform duration-200 hover:scale-105 ${className}`} 
    />
  );
};

const Logo = ({ 
  size = 36, 
  showText = true, 
  variant = 'dark', // 'dark' (navy text for light backgrounds) or 'light' (white text for dark backgrounds)
  textClassName = '',
  className = ''
}) => {
  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoIcon size={size} />
      {showText && (
        <span 
          className={`font-bold tracking-tight text-xl transition-colors ${
            isLight ? 'text-white' : 'text-primary'
          } ${textClassName}`}
        >
          Stay<span className="text-accent">Ease</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
