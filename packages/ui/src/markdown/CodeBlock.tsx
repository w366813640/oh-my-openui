import { Check, Copy } from '@oh/icons';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../theme';
import { cn } from '../utils';

export interface CodeBlockProps {
  code: string;
  language?: string;
  /** Show line numbers in the gutter. Default: true for >= 3 lines. */
  showLineNumbers?: boolean;
  /** Optional file name / artifact label rendered in the header. */
  filename?: string;
  /** Maximum visible height in px before scrolling. */
  maxHeight?: number;
  className?: string;
}

/**
 * Themed code block with language pill, copy-to-clipboard button, optional
 * line numbers, and Shiki-driven syntax highlighting.
 */
export function CodeBlock({
  code,
  language,
  showLineNumbers,
  filename,
  maxHeight = 480,
  className,
}: CodeBlockProps) {
  const { resolved } = useTheme();
  const [html, setHtml] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const lineCount = code.split('\n').length;
  const numbersOn = showLineNumbers ?? lineCount >= 3;
  const codeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { highlight } = await import('./highlighter');
      const r = await highlight(code.trimEnd(), language, resolved);
      if (!cancelled) setHtml(r.html);
    })();
    return () => {
      cancelled = true;
    };
  }, [code, language, resolved]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className={cn(
        'group/code my-3 rounded-[12px] border border-[var(--color-border)]',
        'bg-[var(--color-surface-raised)] shadow-[var(--shadow-xs)] overflow-hidden',
        className,
      )}
    >
      <header className="flex h-8 items-center justify-between gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface)] pl-3 pr-1.5">
        <div className="flex items-center gap-2 min-w-0">
          {language ? (
            <span className="text-[10.5px] uppercase tracking-[0.06em] font-mono text-[var(--color-text-muted)]">
              {language}
            </span>
          ) : null}
          {filename ? (
            <>
              {language ? <span className="text-[var(--color-text-subtle)]">·</span> : null}
              <span className="text-[12px] text-[var(--color-text-muted)] truncate">
                {filename}
              </span>
            </>
          ) : null}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            'inline-flex items-center gap-1 h-6 px-2 rounded-[6px] text-[11px]',
            'border border-transparent text-[var(--color-text-muted)] hover:border-[var(--color-border)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]',
            'transition-[background-color,border-color,color] duration-[120ms]',
          )}
          aria-label="Copy code"
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </header>

      <div
        ref={codeRef}
        className={cn('relative overflow-auto', numbersOn && 'with-line-numbers')}
        style={{ maxHeight }}
      >
        {html ? (
          <div
            className="shiki-wrap text-[12.5px] leading-[20px] font-mono"
            data-line-numbers={numbersOn ? 'true' : undefined}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki output is a sanitized HTML string we control.
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <pre className="text-[12.5px] leading-[20px] font-mono p-4 text-[var(--color-text-muted)]">
            {code.trimEnd()}
          </pre>
        )}
      </div>
    </div>
  );
}
