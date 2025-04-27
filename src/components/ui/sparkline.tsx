import React from "react";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  min?: number;
  max?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 120,
  height = 24,
  color = "#22c55e",
  strokeWidth = 2,
  min,
  max,
}) => {
  if (!data.length) return null;
  const _min = min !== undefined ? min : Math.min(...data);
  const _max = max !== undefined ? max : Math.max(...data);
  const y = (val: number) =>
    height - ((val - _min) / (_max - _min || 1)) * (height - strokeWidth);
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${y(v)}`).join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        points={points}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};
