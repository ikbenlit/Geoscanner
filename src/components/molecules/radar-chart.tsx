"use client";

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { cn } from "@/lib/utils";

interface ModuleScore {
  name: string;
  score: number;
  maxScore: number;
}

interface RadarChartProps {
  modules: ModuleScore[];
  className?: string;
}

export function ModuleRadarChart({ modules, className }: RadarChartProps) {
  // Bereken percentages voor de chart
  const data = modules.map(module => ({
    name: module.name,
    score: (module.score / module.maxScore) * 100,
  }));

  return (
    <div className={cn("w-full h-[400px]", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis 
            dataKey="name" 
            tick={{ fill: "hsl(var(--foreground))" }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]}
            tick={{ fill: "hsl(var(--foreground))" }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
} 