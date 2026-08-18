import React from "react";

export const OmSymbol: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg
    viewBox="0 0 100 100"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M47.8,36.2 C45.3,31.7 41.5,28.8 36.3,28.8 C28.7,28.8 22.4,35.2 22.4,43.2 C22.4,51.3 28.5,57.4 36.5,57.4 C39.2,57.4 41.8,56.6 44,55.1 C44.5,57.8 45.8,60.8 47.9,63.6 C43.8,67.6 37.8,70.1 31.2,70.1 C25.8,70.1 20.8,68.4 16.8,65.4 C15.8,64.7 14.5,64.9 13.8,65.9 C13.1,66.9 13.3,68.2 14.3,68.9 C19,72.5 24.8,74.5 31.2,74.5 C39,74.5 46.1,71.5 51.1,66.6 C53.9,69.5 58,71.2 62.4,71.2 C71.5,71.2 78.8,63.8 78.8,54.7 C78.8,47.4 74,41.2 67.4,39.1 C70.1,36.9 71.9,33.5 71.9,29.7 C71.9,23.3 66.7,18.1 60.3,18.1 C54.7,18.1 50,22.1 48.9,27.4 C48.7,28.6 49.5,29.7 50.7,29.9 C51.9,30.1 53,29.3 53.2,28.1 C54,24.4 56.9,22.1 60.3,22.1 C64.5,22.1 67.9,25.5 67.9,29.7 C67.9,33.9 64.5,37.3 60.3,37.3 C59.1,37.3 58.1,38.3 58.1,39.5 C58.1,40.7 59.1,41.7 60.3,41.7 C67.5,41.7 73.4,47.6 73.4,54.8 C73.4,62 67.5,67.9 60.3,67.9 C56.2,67.9 52.6,66 50.3,63 C52.2,59.8 53.3,55.9 53.3,51.8 C53.3,45.4 50.4,40.1 47.8,36.2 Z M36.5,53.4 C30.9,53.4 26.4,48.8 26.4,43.2 C26.4,37.6 30.9,33 36.5,33 C42.1,33 46.6,37.6 46.6,43.2 C46.6,48.8 42.1,53.4 36.5,53.4 Z M74.5,24.8 C79.6,24.8 84.4,22.5 87.7,18.6 C88.5,17.7 88.4,16.4 87.5,15.6 C86.6,14.8 85.3,14.9 84.5,15.8 C81.9,18.9 78.3,20.6 74.5,20.6 C70.7,20.6 67.1,18.9 64.5,15.8 C63.7,14.9 62.4,14.8 61.5,15.6 C60.6,16.4 60.5,17.7 61.3,18.6 C64.6,22.5 69.4,24.8 74.5,24.8 Z M74.5,13.2 C76.1,13.2 77.4,11.9 77.4,10.3 C77.4,8.7 76.1,7.4 74.5,7.4 C72.9,7.4 71.6,8.7 71.6,10.3 C71.6,11.9 72.9,13.2 74.5,13.2 Z" />
  </svg>
);

export const LotusIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg
    viewBox="0 0 100 100"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M50,22 C48,34 40,46 30,52 C35,62 44,68 50,70 C56,68 65,62 70,52 C60,46 52,34 50,22 Z" />
    <path d="M50,70 C38,70 26,62 18,52 C22,42 30,34 38,30 C34,42 38,58 50,70 Z" opacity="0.85" />
    <path d="M50,70 C62,70 74,62 82,52 C78,42 70,34 62,30 C66,42 62,58 50,70 Z" opacity="0.85" />
    <path d="M22,66 C14,60 8,50 6,40 C14,38 24,42 30,48 C24,54 22,60 22,66 Z" opacity="0.6" />
    <path d="M78,66 C86,60 92,50 94,40 C86,38 76,42 70,48 C76,54 78,60 78,66 Z" opacity="0.6" />
    <path d="M24,72 C32,77 42,79 50,79 C58,79 68,77 76,72 C70,76 58,80 50,80 C42,80 30,76 24,72 Z" />
  </svg>
);

export const TempleIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2v3M10 5h4M12 5l4 4H8l4-4z" />
    <path d="M4 11h16M5 11v9M19 11v9M9 11v9M15 11v9" />
    <path d="M2 20h20M7 15h2M15 15h2" />
  </svg>
);

export const DiyaIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2c0 2-1.5 3.5-1.5 5 0 1 .7 1.8 1.5 1.8s1.5-.8 1.5-1.8c0-1.5-1.5-3-1.5-5z" fill="#f59e0b" stroke="#d97706" />
    <path d="M4 14c0 4.4 3.6 7 8 7s8-2.6 8-7c0-2-3-3-8-3s-8 1-8 3z" />
    <path d="M3 14h18" />
  </svg>
);

export const TrishulIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2v20M12 2l-2 3h4l-2-3z" />
    <path d="M5 4v6c0 3.87 3.13 7 7 7s7-3.13 7-7V4" />
    <path d="M5 4l-1 2h2L5 4zM19 4l-1 2h2L19 4z" />
  </svg>
);

export const SwastikIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2v10m0 0v10m0-10H2m10 0h10M22 12v5M2 12V7M12 22h-5M12 2h5" />
    <circle cx="7" cy="7" r="0.8" fill="currentColor" />
    <circle cx="17" cy="7" r="0.8" fill="currentColor" />
    <circle cx="7" cy="17" r="0.8" fill="currentColor" />
    <circle cx="17" cy="17" r="0.8" fill="currentColor" />
  </svg>
);
