import { SVGProps } from 'react';

export default function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      {...props}
    >
      <rect width="64" height="64" rx="14" fill="#2563EB" />

      <rect x="18" y="20" width="28" height="18" rx="3" fill="none" stroke="white" strokeWidth="2" />

      <ellipse cx="32" cy="29" rx="7" ry="4" fill="white" />
    </svg>
  );
}
