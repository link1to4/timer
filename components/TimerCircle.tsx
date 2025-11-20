import React from 'react';
import { TimerStatus } from '../types';

interface TimerCircleProps {
  milliseconds: number;
  status: TimerStatus;
}

const TimerCircle: React.FC<TimerCircleProps> = ({ milliseconds, status }) => {
  const radius = 120;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  // Stopwatch visual: Fill up every 60 seconds
  const msInMinute = 60000;
  const progress = (milliseconds % msInMinute) / msInMinute;
  const strokeDashoffset = circumference - progress * circumference;

  // Pulse color when running
  const strokeColor = status === TimerStatus.RUNNING ? 'stroke-primary' : 'stroke-gray-600';

  return (
    <div className="relative flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90 drop-shadow-2xl"
      >
        {/* Background Ring */}
        <circle
          className="stroke-surface"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Seconds Progress Ring */}
        <circle
          className={`${strokeColor} transition-all duration-100 ease-linear`}
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
    </div>
  );
};

export default TimerCircle;