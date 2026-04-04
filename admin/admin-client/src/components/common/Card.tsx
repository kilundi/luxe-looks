import React from 'react';
import { cn } from '@/utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hoverable }) => {
  return (
    <div
      className={cn(
        'bg-dark-900 border border-dark-800 rounded-xl shadow-sm',
        hoverable && 'hover:border-primary-500/50 transition-colors',
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className }) => (
  <div className={cn('px-6 py-4 border-b border-dark-800', className)}>{children}</div>
);

export const CardTitle: React.FC<CardProps> = ({ children, className }) => (
  <h3 className={cn('text-lg font-semibold text-white', className)}>{children}</h3>
);

export const CardContent: React.FC<CardProps> = ({ children, className }) => (
  <div className={cn('p-6', className)}>{children}</div>
);
