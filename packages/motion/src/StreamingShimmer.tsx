import { Asterisk } from '@oh/icons';
import type { ReactNode } from 'react';

export interface StreamingShimmerProps {
  /** Override the leading icon. */
  icon?: ReactNode;
  /** Width pattern of the skeleton lines. */
  lines?: number;
  /** Tailwind classes for sizing. */
  className?: string;
  /** Show the leading asterisk identity glyph. */
  showAvatar?: boolean;
}

/**
 * "Thinking" / streaming placeholder — spinning asterisk + 2-3 shimmering lines
 * to fill the assistant message slot before tokens arrive.
 */
export function StreamingShimmer({
  icon,
  lines = 3,
  className,
  showAvatar = true,
}: StreamingShimmerProps) {
  return (
    <div className={className} role="status" aria-label="Generating response">
      {showAvatar ? (
        <div className="flex items-center gap-2 mb-3 text-[var(--color-asterisk)]">
          {icon ?? <Asterisk size={16} className="animate-[spin-asterisk_1.4s_linear_infinite]" />}
          <span className="text-[12px] text-[var(--color-text-muted)]">Thinking…</span>
        </div>
      ) : null}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => {
          const widthPct = 100 - i * 12;
          return (
            <div
              key={`line-${widthPct}`}
              className="h-3.5 rounded-md"
              style={{
                width: `${widthPct}%`,
                backgroundImage:
                  'linear-gradient(90deg, var(--color-surface-muted) 0%, var(--color-surface-sunken) 50%, var(--color-surface-muted) 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s linear infinite',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
