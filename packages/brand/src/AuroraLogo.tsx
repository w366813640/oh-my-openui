import type { SVGProps } from 'react';

/**
 * The default Aurora brand mark: a soft 8-petal sunburst with a slight inner
 * sparkle. Drawn entirely from primitive paths so it stays vector-clean at any
 * size and contains no third-party brand IP.
 */
export interface AuroraLogoProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export function AuroraLogo({ size = 24, ...props }: AuroraLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <title>Aurora</title>
      {/* outer 8 petals */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 360) / 8;
        return (
          <path
            key={i}
            d="M12 2 C12.7 2 13 4.5 13 7.5 C13 9.5 12.6 11 12 11 C11.4 11 11 9.5 11 7.5 C11 4.5 11.3 2 12 2 Z"
            transform={`rotate(${angle} 12 12)`}
            opacity={0.92}
          />
        );
      })}
      {/* inner 4 sparkle accents */}
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = i * 45 + 22.5;
        return (
          <path
            key={`sp-${i}`}
            d="M12 6.5 C12.4 6.5 12.6 7.6 12.6 8.6 C12.6 9.4 12.3 10 12 10 C11.7 10 11.4 9.4 11.4 8.6 C11.4 7.6 11.6 6.5 12 6.5 Z"
            transform={`rotate(${angle} 12 12)`}
            opacity={0.6}
          />
        );
      })}
    </svg>
  );
}
