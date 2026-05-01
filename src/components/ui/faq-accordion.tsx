'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { useReducedMotion } from 'motion/react';

export type FAQItem = {
  question: string;
  answer: string;
};

type FAQAccordionProps = {
  items: FAQItem[];
  className?: string;
};

export function FAQAccordion({ items, className = '' }: FAQAccordionProps) {
  const [open, setOpen] = useState<number | null>(null);
  const reduce = useReducedMotion();

  return (
    <dl className={['divide-y divide-border', className].join(' ')}>
      {items.map((item, i) => (
        <div key={i}>
          <dt>
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              aria-expanded={open === i}
              aria-controls={`faq-panel-${i}`}
              id={`faq-trigger-${i}`}
            >
              <span className="font-sans font-medium text-primary">{item.question}</span>
              <span className="shrink-0 text-accent" aria-hidden>
                {open === i ? (
                  <Minus className="h-5 w-5" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
              </span>
            </button>
          </dt>
          <dd id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-trigger-${i}`}>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  key="content"
                  initial={reduce ? {} : { height: 0, opacity: 0 }}
                  animate={reduce ? {} : { height: 'auto', opacity: 1 }}
                  exit={reduce ? {} : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 font-sans leading-relaxed text-muted">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </dd>
        </div>
      ))}
    </dl>
  );
}
