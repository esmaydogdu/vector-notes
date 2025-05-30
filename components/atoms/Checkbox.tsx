import React, { ReactNode } from 'react';

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: () => void;
  children?: ReactNode;
}

export function Checkbox({ id, checked, onChange, children }: CheckboxProps) {
  return (
    <div className="flex items-center ps-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 border border-gray-700 rounded-sm focus:ring-blue-500 focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-900 cursor-pointer 
  checked:bg-blue-500 checked:border-blue-500 
  appearance-none bg-gray-900 checked:appearance-auto"
      />
      {children && (
        <label 
          htmlFor={id} 
          className="ms-2 text-sm font-medium text-gray-900"
        >
          {children}
        </label>
      )}
    </div>
  );
}