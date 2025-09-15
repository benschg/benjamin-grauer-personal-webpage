// Create SVG flag components for better display
export const SwissFlag = () => (
  <svg width="100%" height="100%" viewBox="0 0 32 32" style={{ borderRadius: '2px' }}>
    <rect width="32" height="32" fill="#DC143C" />
    <rect x="13" y="6" width="6" height="20" fill="white" />
    <rect x="6" y="13" width="20" height="6" fill="white" />
  </svg>
);

export const BritishFlag = () => (
  <svg width="100%" height="100%" viewBox="0 0 60 30" style={{ borderRadius: '2px' }}>
    <rect width="60" height="30" fill="#012169" />
    <g stroke="white" strokeWidth="2">
      <path d="M0,0 L60,30 M60,0 L0,30" />
    </g>
    <g stroke="white" strokeWidth="6">
      <path d="M30,0 L30,30 M0,15 L60,15" />
    </g>
    <g stroke="#C8102E" strokeWidth="4">
      <path d="M30,0 L30,30 M0,15 L60,15" />
    </g>
    <g stroke="#C8102E" strokeWidth="2">
      <path d="M0,0 L60,30 M60,0 L0,30" />
    </g>
  </svg>
);

export const FrenchFlag = () => (
  <svg width="100%" height="100%" viewBox="0 0 90 60" style={{ borderRadius: '2px' }}>
    <rect width="30" height="60" fill="#0055A4" />
    <rect x="30" width="30" height="60" fill="white" />
    <rect x="60" width="30" height="60" fill="#EF4135" />
  </svg>
);
