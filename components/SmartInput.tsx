import React, { useState, useEffect } from 'react';

interface SmartInputProps {
  currentLabel: string;
  onLabelChange: (label: string) => void;
  disabled: boolean;
}

const SmartInput: React.FC<SmartInputProps> = ({ currentLabel, onLabelChange, disabled }) => {
  const [input, setInput] = useState(currentLabel);

  useEffect(() => {
    setInput(currentLabel);
  }, [currentLabel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onLabelChange(input);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center bg-surface rounded-lg overflow-hidden border border-gray-700 focus-within:border-primary transition-colors">
            <span className="pl-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
            </span>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onBlur={() => onLabelChange(input)}
                disabled={disabled}
                placeholder="Name your task (e.g. Debugging)"
                className="w-full bg-transparent border-none text-white placeholder-gray-500 px-4 py-3 focus:outline-none focus:ring-0"
            />
        </div>
      </form>
    </div>
  );
};

export default SmartInput;