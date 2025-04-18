import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MapButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  tooltip: string;
  active?: boolean;
}

const MapButton = ({ icon: Icon, onClick, tooltip, active = false }: MapButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
        active && "bg-gray-100 dark:bg-gray-700"
      )}
      title={tooltip}
    >
      <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
    </button>
  );
};

export default MapButton; 