import React from 'react';

interface TimeDisplayProps {
  milliseconds: number;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ milliseconds }) => {
  // Ensure non-negative
  const ms = Math.max(0, milliseconds);
  
  const totalSeconds = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const format = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="text-center">
      <div className="text-6xl md:text-8xl font-mono font-bold tracking-tighter text-white tabular-nums">
        {hours > 0 && <span className="text-gray-400">{format(hours)}:</span>}
        <span>{format(minutes)}</span>
        <span className="animate-pulse text-gray-500">:</span>
        <span>{format(seconds)}</span>
      </div>
    </div>
  );
};

export default TimeDisplay;
