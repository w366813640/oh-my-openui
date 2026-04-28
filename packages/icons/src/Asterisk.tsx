import type { SVGProps } from 'react';

/**
 * The signature 8-point asterisk / starburst — used as the assistant identity mark
 * and as the loading / "thinking" spinner. Drawn from scratch to avoid copying
 * Anthropic's exact glyph; geometry is original (12 thin rays, slight petal taper).
 */
export interface AsteriskProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export function Asterisk({ size = 24, ...props }: AsteriskProps) {
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
      <title>Asterisk</title>
      <g>
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 360) / 12;
          return (
            <path
              key={i}
              d="M11.4 2.2 C11.6 1.0 12.4 1.0 12.6 2.2 L13.2 11 C13.25 11.6 12.7 12.0 12.0 12.0 C11.3 12.0 10.75 11.6 10.8 11 Z"
              transform={`rotate(${angle} 12 12)`}
            />
          );
        })}
      </g>
    </svg>
  );
}
