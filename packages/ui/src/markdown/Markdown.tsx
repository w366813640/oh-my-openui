import { type ComponentProps, memo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '../utils';
import { CodeBlock } from './CodeBlock';

export interface MarkdownProps {
  children: string;
  className?: string;
  /** Override or extend the default component renderers. */
  components?: Partial<Components>;
}

const baseComponents: Components = {
  h1: (props) => (
    <h1
      className="font-serif text-[26px] leading-[1.2] font-semibold mt-7 mb-3.5 first:mt-0"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="font-serif text-[21px] leading-[1.25] font-semibold mt-6 mb-2.5 first:mt-0"
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="text-[16.5px] leading-snug font-semibold mt-5 mb-2 first:mt-0" {...props} />
  ),
  h4: (props) => (
    <h4
      className="text-[14px] font-semibold uppercase tracking-[0.04em] text-[var(--color-text-muted)] mt-5 mb-1.5"
      {...props}
    />
  ),
  p: (props) => <p className="my-2.5 first:mt-0 last:mb-0 leading-[24px]" {...props} />,
  a: ({ href, ...props }) => (
    <a
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noreferrer noopener' : undefined}
      className={cn(
        'relative inline-block text-[var(--color-accent)] underline-offset-[3px] decoration-[1.5px]',
        'decoration-[var(--color-accent)]/35 hover:decoration-[var(--color-accent)]',
        'transition-[text-decoration-color] duration-[160ms]',
      )}
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className="my-2.5 ml-5 list-disc space-y-1 marker:text-[var(--color-text-subtle)]"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="my-2.5 ml-5 list-decimal space-y-1 marker:text-[var(--color-text-subtle)]"
      {...props}
    />
  ),
  li: (props) => <li className="leading-[22px] pl-0.5" {...props} />,
  blockquote: (props) => (
    <blockquote
      className={cn(
        'my-4 pl-4 py-1 relative italic',
        'text-[var(--color-text-muted)]',
        'before:content-[""] before:absolute before:left-0 before:top-1 before:bottom-1',
        'before:w-[2.5px] before:rounded-full before:bg-[var(--color-accent)]/55',
      )}
      {...props}
    />
  ),
  hr: () => (
    <hr className="my-6 border-0 h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
  ),
  table: (props) => (
    <div className="my-3 overflow-x-auto rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <table className="w-full text-[13px] border-collapse" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-[var(--color-surface-muted)] text-left" {...props} />,
  th: (props) => (
    <th
      className="px-3 py-2 font-semibold text-[var(--color-text)] border-b border-[var(--color-border)]"
      {...props}
    />
  ),
  td: (props) => (
    <td className="px-3 py-2 border-b border-[var(--color-border)] last:border-b-0" {...props} />
  ),
  strong: (props) => <strong className="font-semibold text-[var(--color-text)]" {...props} />,
  em: (props) => <em className="italic" {...props} />,
  code: (props: ComponentProps<'code'> & { node?: unknown }) => {
    const { className, children, ...rest } = props;
    const match = /language-([\w-]+)/.exec(className ?? '');
    const isInline = !className?.includes('language-');
    if (isInline) {
      return (
        <code
          className="px-1 py-0.5 mx-0.5 rounded-[4px] bg-[var(--color-surface-muted)] text-[12.5px] font-mono text-[var(--color-text)]"
          {...rest}
        >
          {children}
        </code>
      );
    }
    return <CodeBlock code={String(children).replace(/\n$/, '')} language={match?.[1]} />;
  },
  pre: ({ children }) => <>{children}</>,
};

export const Markdown = memo(function Markdown({ children, className, components }: MarkdownProps) {
  return (
    <div
      className={cn('markdown-body text-[16px] leading-[25px] text-[var(--color-text)]', className)}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ ...baseComponents, ...components }}>
        {children}
      </ReactMarkdown>
    </div>
  );
});
