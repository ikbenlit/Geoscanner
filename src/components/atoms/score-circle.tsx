"use client";

import { cn } from "@/lib/utils";

interface ScoreCircleProps {
  score: number;
  maxScore: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-24 h-24',
  md: 'w-32 h-32',
  lg: 'w-40 h-40'
};

const textSizeClasses = {
  sm: 'text-2xl',
  md: 'text-3xl',
  lg: 'text-4xl'
};

export function ScoreCircle({ score, maxScore, size = 'md' }: ScoreCircleProps) {
  const percentage = (score / maxScore) * 100;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = (score: number) => {
    if (score >= 80) return 'text-success-green';
    if (score >= 50) return 'text-warning-amber';
    return 'text-danger-red';
  };

  return (
    <div className={cn("relative", sizeClasses[size])}>
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Achtergrond cirkel */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted"
        />
        {/* Score cirkel */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          className={getColor(score)}
        />
      </svg>
      {/* Score tekst */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-bold", textSizeClasses[size], getColor(score))}>
          {Math.round(percentage)}
        </span>
        <span className="text-xs text-muted-foreground">/100</span>
      </div>
    </div>
  );
} 