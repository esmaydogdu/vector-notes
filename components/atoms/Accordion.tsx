'use client'
import React, { ReactNode, useState } from 'react';
import styles from '@/styles/components/accordion.module.scss';

interface AccordionItemProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const uniqueId = React.useId();
  const headingId = `accordion-heading-${uniqueId}`;
  const bodyId = `accordion-body-${uniqueId}`;

  return (
    <div className={styles['accordion-item']}>
      <h2 id={headingId} className={styles['accordion-heading']}>
        <button 
          type="button" 
          className={`${isOpen ? 'bg-gray-800' : ''} flex items-center justify-between w-full p-4 font-bold text-gray-400 border-gray-700 border hover:bg-gray-800`}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={bodyId}
        >
          <div>{title}</div>
          <svg 
            className={`w-3 h-3 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 10 6"
          >
            <path 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M9 5 5 1 1 5" 
            />
          </svg>
        </button>
      </h2>
      <div 
        id={bodyId} 
        className={`${isOpen ? '' : 'hidden'} ${styles['accordion-body']} border border-gray-700`}
        aria-labelledby={headingId}
      >
        <div className="p-5 border-gray-700 bg-gray-900">
          {children}
        </div>
      </div>
    </div>
  );
}

interface AccordionProps {
  children: ReactNode;
  flush?: boolean;
}

export function Accordion({ children }: AccordionProps) {
  return (
    <div className={styles['accordion-container']}
    >
      {children}
    </div>
  );
}
