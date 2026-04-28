import { motion } from 'framer-motion';
import { Children, type ReactNode, isValidElement } from 'react';
import { cn } from '../utils';

/**
 * Vertical-center wrapper for the empty/welcome layout: greeting + composer +
 * quick chips. Used both on the home/new chat page and project home.
 *
 * Children are wrapped in a Framer Motion stagger container so each slot
 * (greeting, composer, chips) settles in sequence — matching Claude's calm
 * reveal cadence.
 */
export function WelcomeStage({
  children,
  className,
  topOffset = 96,
}: {
  children: ReactNode;
  className?: string;
  /** Pixels of padding-top relative to the viewport. */
  topOffset?: number;
}) {
  const items = Children.toArray(children).filter((c) => c !== null && c !== undefined);

  return (
    <div
      className={cn('flex flex-col items-center w-full', className)}
      style={{ paddingTop: topOffset, paddingBottom: 64 }}
    >
      <motion.div
        className="w-full max-w-[680px] flex flex-col items-stretch gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.08, delayChildren: 0.04 },
          },
        }}
      >
        {items.map((child, idx) => (
          <motion.div
            key={isValidElement(child) && child.key ? child.key : `stage-${idx}`}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.32, ease: [0.2, 0, 0, 1] },
              },
            }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
