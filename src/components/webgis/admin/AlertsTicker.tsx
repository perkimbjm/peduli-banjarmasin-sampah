
interface Alert {
  id: number;
  type: string;
  message: string;
  time: string;
}

interface AlertsTickerProps {
  alerts: Alert[];
}

const AlertsTicker = ({ alerts }: AlertsTickerProps) => {
  return (
    <div className="bg-slate-800 border-t border-slate-700 py-1 px-4 flex items-center overflow-hidden">
      <div className="overflow-hidden whitespace-nowrap animate-marquee">
        {alerts.map((alert) => (
          <span key={alert.id} className="mx-4 text-sm">
            <span className="text-slate-400">{alert.time}</span> • {alert.message}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AlertsTicker;
