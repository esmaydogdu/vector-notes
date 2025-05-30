"use client"
import { useState, useEffect, useRef } from "react";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
}

export function Dropdown({
  options,
  value,
  onChange,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-200 border-gray-700 border hover:bg-gray-800 bg-gray-900 rounded-md focus:outline-none"
      >
        {selectedOption?.label || "Select an option"}
        <svg 
          className={`w-3 h-3 ml-2 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-gray-900 border border-gray-700 shadow-lg focus:outline-none">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`${
                  option.value === value 
                    ? 'bg-gray-800 text-gray-200' 
                    : 'text-gray-400'
                } block w-full px-4 py-2 text-left text-sm hover:bg-gray-800 border-t border-gray-700 first:border-t-0`}
              >
                {option.label}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
