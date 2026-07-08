import React from 'react';

interface LogoProps {
  className?: string;
  iconClassName?: string;
}

export const ShoeLogoIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 120 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="goldLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFEAA7" />
          <stop offset="30%" stopColor="#F9D05F" />
          <stop offset="50%" stopColor="#E1A11A" />
          <stop offset="75%" stopColor="#B87E0C" />
          <stop offset="100%" stopColor="#AA7100" />
        </linearGradient>
      </defs>

      {/* 1. Droplets (Water drops above the shoe laces) */}
      {/* Large hollow droplet */}
      <path 
        d="M50 28 C50 23, 54 18, 54 18 C54 18, 58 23, 58 28 C58 31.3, 55.3 34, 52 34 C48.7 34, 46 31.3, 46 28 C46 27.5, 46.5 27, 47 27 C47.5 27, 48 27.5, 48 28 C48 30.2, 49.8 32, 52 32 C54.2 32, 56 30.2, 56 28 C56 25, 54 21, 54 21 C54 21, 52 25, 52 28 C52 28.5, 51.5 29, 51 29 C50.5 29, 50 28.5, 50 28 Z" 
        fill="url(#goldLogoGradient)" 
      />
      {/* Small droplet above-right */}
      <path 
        d="M60 17.5 C60 15, 62.5 12, 62.5 12 C62.5 12, 65 15, 65 17.5 C65 19.4, 63.4 21, 61.5 21 C59.6 21, 58 19.4, 58 17.5 Z" 
        fill="url(#goldLogoGradient)" 
      />

      {/* 2. Soap Bubbles & Suds (Top-right / heel area) */}
      {/* Floating Bubbles */}
      <circle cx="85" cy="27" r="3.5" stroke="url(#goldLogoGradient)" strokeWidth="1.8" fill="none" />
      <circle cx="94" cy="23" r="2.5" stroke="url(#goldLogoGradient)" strokeWidth="1.8" fill="none" />
      
      {/* Fluffy Suds / Foam Outline */}
      <path 
        d="M84 37 C82 35, 82 31, 85 29.5 C88 28, 92 30, 93 33 C95 32, 98 33, 98 36 C98 39, 95 40, 93 40 C91 43, 86 42, 84 39" 
        stroke="url(#goldLogoGradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        fill="none" 
      />

      {/* 3. The Shoe (Minimalist contour line art matching the logo) */}
      {/* Outer upper contour & collar */}
      <path 
        d="M38 37 C38 31, 41 29, 44 29 C47 29, 49 32, 52 32 C55 32, 58 29, 62 29 C65 29, 70 32, 73 35 C78 39, 87 41, 95 44 C98 45, 99 48, 97 51 C94 54, 88 56, 80 57 C72 58, 62 58, 55 54 C50 51, 46 48, 41 48" 
        stroke="url(#goldLogoGradient)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none" 
      />

      {/* Heel curve & counter */}
      <path 
        d="M38 37 C34 38, 32 42, 32 48 C32 54, 37 57, 43 57 C48 57, 52 54, 53 50" 
        stroke="url(#goldLogoGradient)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none" 
      />

      {/* Inner shoe design wave / curve */}
      <path 
        d="M48 50 C55 52, 65 52, 72 54 C80 56.5, 87 56.5, 92 53" 
        stroke="url(#goldLogoGradient)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none" 
      />

      {/* Floating dual sole / bottom curve */}
      <path 
        d="M32 59 C32 63, 40 64, 48 64 C51 64, 54 62, 54 60 C54 59, 48 59, 44 59 M55 60 C65 62, 75 62, 85 60" 
        stroke="url(#goldLogoGradient)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none" 
      />

      {/* Shoelaces / Diagonal parallel stripes */}
      <line x1="61" y1="33" x2="65" y2="37" stroke="url(#goldLogoGradient)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="66" y1="37.5" x2="70" y2="41.5" stroke="url(#goldLogoGradient)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="71" y1="42" x2="75" y2="46" stroke="url(#goldLogoGradient)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="76" y1="46.5" x2="80" y2="50.5" stroke="url(#goldLogoGradient)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
};

export const ShoeLogoFull: React.FC<LogoProps> = ({ className = "flex flex-col items-center", iconClassName = "w-28 h-28" }) => {
  return (
    <div className={className}>
      {/* Large beautiful SVG Icon */}
      <ShoeLogoIcon className={iconClassName} />
      
      {/* "SHOES" in broad modern sans-serif */}
      <span className="font-sans text-[2.4rem] leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#FFEAA7] via-[#F9D05F] to-[#AA7100] font-black tracking-[0.22em] uppercase text-center mt-2 pl-4">
        SHOES
      </span>
      
      {/* "LAVANDERÍA" in medium clean tracking-wide sans-serif */}
      <span className="font-sans text-[1.15rem] leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#FFEAA7] via-[#F9D05F] to-[#AA7100] font-bold tracking-[0.24em] uppercase text-center mt-1 pl-3">
        LAVANDERÍA
      </span>
    </div>
  );
};
