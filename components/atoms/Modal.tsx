import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative w-full max-w-md mx-auto my-6 z-10">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-800 outline-none focus:outline-none">
          {/* Header */}
          <div className="flex items-baseline justify-between px-4 py-2 border-b border-gray-700 rounded-t">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-gray-400 hover:text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={onClose}
            >
              <span className="text-gray-400 h-6 w-6 text-2xl block">×</span>
            </button>
          </div>
          
          {/* Body */}
          <div className="relative p-6 flex-auto">
            {children}
          </div>
          
          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end p-4 border-t border-gray-700 rounded-b">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}