import React from 'react';

interface FeatureIconProps {
  iconName: string;
}

export const FeatureIcon: React.FC<FeatureIconProps> = ({ iconName }) => {
  switch (iconName) {
    case 'Shield':
      return (
        <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 100 100">
          <defs>
            <mask id="shieldCheckMask">
              {/* Keep everything inside the white mask */}
              <rect x="0" y="0" width="100" height="100" fill="white" />
              {/* Cut out the checkmark as black stroke */}
              <path 
                d="M 36,49 L 46,59 L 66,37" 
                stroke="black" 
                strokeWidth="8.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                fill="none" 
              />
            </mask>
          </defs>
          {/* Outer Shield Border */}
          <path 
            d="M 50,13 C 66,13 80,16 84,22 C 84,47 78,73 50,90 C 22,73 16,47 16,22 C 20,16 34,13 50,13 Z" 
            stroke="currentColor" 
            strokeWidth="4" 
            fill="none" 
          />
          {/* Inner Shield Body with Checkmark Cutout */}
          <path 
            d="M 50,22 C 62,22 72,25 75,30 C 75,48 70,66 50,78 C 30,66 25,48 25,30 C 28,25 38,22 50,22 Z" 
            fill="currentColor" 
            mask="url(#shieldCheckMask)" 
          />
        </svg>
      );
    case 'UserCheck':
      return (
        <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 100 100">
          <path d="M38,62 L62,62" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M50,62 L50,82" stroke="currentColor" strokeWidth="3" />
          <path d="M42,82 L58,82" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <circle cx="30" cy="44" r="6" fill="currentColor" />
          <path d="M30,50 C30,55 24,56 24,66 L36,66 C36,60 36,54 30,50" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M20,58 L20,78 C20,82 32,82 32,78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="70" cy="44" r="6" fill="currentColor" />
          <path d="M70,50 C70,55 76,56 76,66 L64,66 C64,60 64,54 70,50" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M80,58 L80,78 C80,82 68,82 68,78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M30,32 C30,24 48,24 48,32 C48,35 44,37 41,39 L38,43 L38,39 C34,39 30,36 30,32 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="36" cy="32" r="1.5" fill="currentColor" />
          <circle cx="39" cy="32" r="1.5" fill="currentColor" />
          <circle cx="42" cy="32" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'Truck':
      return (
        <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 100 100">
          <line x1="15" y1="35" x2="35" y2="35" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="10" y1="45" x2="30" y2="45" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="18" y1="55" x2="28" y2="55" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="40" cy="72" r="8" stroke="currentColor" strokeWidth="3" fill="none" />
          <circle cx="80" cy="72" r="8" stroke="currentColor" strokeWidth="3" fill="none" />
          <path d="M40,72 L50,72 L64,72 L76,55" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M80,72 L76,55 L74,48" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M70,48 L78,48" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <rect x="25" y="40" width="22" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="3" />
          <line x1="25" y1="50" x2="47" y2="50" stroke="currentColor" strokeWidth="1.5" />
          <path d="M48,60 L54,42 L66,45 L62,60 Z" fill="currentColor" stroke="currentColor" strokeWidth="1" />
          <path d="M60,45 L74,48" stroke="currentColor" stroke-width="2.5" strokeLinecap="round" />
          <circle cx="60" cy="33" r="6" fill="currentColor" />
          <path d="M63,31 L67,34 L63,37" stroke="currentColor" strokeWidth="1" fill="currentColor" />
        </svg>
      );
    case 'Award':
      return (
        <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 100 100">
          <defs>
            <mask id="premiumTextMask">
              <rect x="0" y="0" width="100" height="100" fill="white" />
              <text 
                x="50" 
                y="55.5" 
                fontFamily="'Inter', sans-serif" 
                fontWeight="900" 
                fontSize="10" 
                letterSpacing="1" 
                textAnchor="middle" 
                fill="black"
              >PREMIUM</text>
            </mask>
          </defs>
          
          {/* Ribbon Back/Ends */}
          <path d="M 6,48 L 16,40 L 16,64 L 6,56 L 11,52 Z" fill="currentColor" />
          <path d="M 94,48 L 84,40 L 84,64 L 94,56 L 89,52 Z" fill="currentColor" />
          
          {/* Outer Badge Ring */}
          <circle cx="50" cy="50" r="41" stroke="currentColor" strokeWidth="2.2" fill="none" />
          {/* Stitched Line */}
          <circle cx="50" cy="50" r="37" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" fill="none" />
          {/* Inner Solid Badge Ring */}
          <circle cx="50" cy="50" r="33" stroke="currentColor" strokeWidth="2" fill="none" />
          
          {/* Center Ribbons */}
          <rect x="12" y="43" width="76" height="18" fill="currentColor" rx="1.5" mask="url(#premiumTextMask)" />
          
          {/* Top Stars */}
          {/* Center larger star */}
          <polygon points="50,15 52.5,20 58,20.5 54,24.5 55.5,30 50,27 44.5,30 46,24.5 42,20.5 47.5,20" fill="currentColor" />
          {/* Left star */}
          <polygon points="38,18 39.5,21.5 43,21.8 40.2,24.5 41.2,28.2 38,26.2 34.8,28.2 35.8,24.5 33,21.8 36.5,21.5" fill="currentColor" />
          {/* Right star */}
          <polygon points="62,18 63.5,21.5 67,21.8 64.2,24.5 65.2,28.2 62,26.2 58.8,28.2 59.8,24.5 57,21.8 60.5,21.5" fill="currentColor" />
          
          {/* 100% Text */}
          <text 
            x="50" 
            y="39" 
            fontFamily="'Inter', sans-serif" 
            fontWeight="950" 
            fontSize="10.5" 
            textAnchor="middle" 
            fill="currentColor"
          >100%</text>
          
          {/* GUARANTEED Text */}
          <text 
            x="50" 
            y="71" 
            fontFamily="'Inter', sans-serif" 
            fontWeight="800" 
            fontSize="5.8" 
            letterSpacing="1.2" 
            textAnchor="middle" 
            fill="currentColor"
          >GUARANTEED</text>
          
          {/* Bottom Star & Dots */}
          <polygon points="50,75 51.5,78 54.5,78.2 52,80.5 53,83.5 50,82 47,83.5 48,80.5 45.5,78.2 48.5,78" fill="currentColor" />
          <circle cx="42" cy="79.5" r="1" fill="currentColor" />
          <circle cx="58" cy="79.5" r="1" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      );
  }
};
