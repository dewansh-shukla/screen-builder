'use client';

import React from 'react';
import { ChevronDown } from '@untitledui/icons';
import { cn } from '@/lib/utils';

interface AccordionProps {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  className?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

interface AccordionItemProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

interface AccordionTriggerProps {
  className?: string;
  children: React.ReactNode;
  value: string;
  isOpen: boolean;
  onToggle: (value: string) => void;
}

interface AccordionContentProps {
  className?: string;
  children: React.ReactNode;
  isOpen: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  className,
  children,
}) => {
  return <div className={cn('w-full', className)}>{children}</div>;
};

export const AccordionItem: React.FC<AccordionItemProps> = ({
  className,
  children,
}) => {
  return <div className={cn('w-full', className)}>{children}</div>;
};

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  className,
  children,
  value,
  isOpen,
  onToggle,
}) => {
  return (
    <button
      className={cn(
        'flex w-full items-center justify-between transition-all duration-200',
        className,
      )}
      onClick={() => onToggle(value)}
    >
      {children}
      <ChevronDown
        className={cn(
          'h-4 w-4 transition-transform duration-200',
          isOpen && 'rotate-180',
        )}
      />
    </button>
  );
};

export const AccordionContent: React.FC<AccordionContentProps> = ({
  className,
  children,
  isOpen,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={cn('overflow-hidden transition-all duration-200', className)}
    >
      {children}
    </div>
  );
};
