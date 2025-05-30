import React, { ReactNode } from 'react';

interface CheckboxGroupProps {
  children: ReactNode;
  className?: string;
}

export function CheckboxGroup({ children, className = '' }: CheckboxGroupProps) {
  return (
    <ul className={className}>
      {React.Children.map(children, (child, index) => (
        <li key={index} className="w-full border-gray-200 dark:border-gray-600">
          {child}
        </li>
      ))}
    </ul>
  );
}