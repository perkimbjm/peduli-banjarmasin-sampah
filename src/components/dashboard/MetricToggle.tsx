import React from "react";

interface MetricToggleProps {
  metrics: Array<{
    key: string;
    label: string;
    color: string;
  }>;
  selectedMetrics: string[];
  onToggle: (key: string) => void;
  groupLabel?: string;
  pillClassName?: string;
}

const MetricToggle: React.FC<MetricToggleProps> = ({
  metrics,
  selectedMetrics,
  onToggle,
  groupLabel,
  pillClassName = "",
}) => (
  <div>
    {groupLabel && (
      <div className="font-semibold text-xs mb-2 text-gray-700 dark:text-gray-200">{groupLabel}</div>
    )}
    <div className="flex flex-wrap xl:flex-nowrap gap-3 md:gap-4 lg:gap-4 xl:gap-6 overflow-x-auto xl:overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-1 -mx-2 px-2 xl:mx-0 xl:px-0"
         style={{ WebkitOverflowScrolling: 'touch' }}>
      {metrics.map((m) => (
        <button
          key={m.key}
          type="button"
          className={`flex items-center gap-3 px-3 md:px-4 py-1 rounded-full border text-xs md:text-sm font-medium transition-colors ${pillClassName} ` +
            (selectedMetrics.includes(m.key)
              ? `bg-[${m.color}] text-white shadow-md`
              : `border-[${m.color}] text-[${m.color}] bg-white dark:bg-gray-900 hover:bg-[${m.color}]/10`)
          }
          style={{ borderColor: m.color, color: selectedMetrics.includes(m.key) ? '#fff' : m.color, background: selectedMetrics.includes(m.key) ? m.color : undefined }}
          onClick={() => onToggle(m.key)}
        >
          <span className="w-2 h-2 rounded-full inline-block mr-1" style={{ background: m.color }} />
          {m.label}
        </button>
      ))}
    </div>
  </div>
);

export default MetricToggle;