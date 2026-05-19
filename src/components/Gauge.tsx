import { TrendingDown, TrendingUp } from 'lucide-react';

interface GaugeProps {
  value: number;
  color?: string;
  showLabels?: boolean;
  min?: string;
  max?: string;
}

export default function Gauge({ value, color = "#ef4d23", showLabels, min, max }: GaugeProps) {
  const totalTicks = 40;
  const activeTicks = Math.round((value / 100) * totalTicks);

  return (
    <div className="flex flex-col items-center w-full max-w-[260px] mx-auto" id="gauge-container">
      <svg viewBox="0 0 200 120" className="w-full h-auto">
        {Array.from({ length: totalTicks }).map((_, i) => {
          const angle = Math.PI + (i / (totalTicks - 1)) * Math.PI;
          const r = 80;
          const x1 = 100 + (r - 10) * Math.cos(angle);
          const y1 = 100 + (r - 10) * Math.sin(angle);
          const x2 = 100 + r * Math.cos(angle);
          const y2 = 100 + r * Math.sin(angle);
          
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i < activeTicks ? color : "#d4d4d8"}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          );
        })}
        <text x="100" y="105" textAnchor="middle" fontSize="22" fontWeight="600" className="fill-neutral-900">
          {value}%
        </text>
      </svg>
      {showLabels && (
        <div className="flex w-full justify-between mt-1 px-4 text-[11px] text-neutral-500 font-medium">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}
