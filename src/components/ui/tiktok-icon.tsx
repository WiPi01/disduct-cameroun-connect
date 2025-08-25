
import React from 'react';

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12.528 8.001v5.998c0 2.208-1.791 4-4 4s-4-1.792-4-4V2.003h4v10.002c0 .552.448 1 1 1s1-.448 1-1V8.001h4z" />
    <path d="M16.528 2.003v10.002c0 .552.448 1 1 1s1-.448 1-1V2.003h4v5.998c0 2.208-1.791 4-4 4s-4-1.792-4-4" />
  </svg>
);

export default TikTokIcon;
