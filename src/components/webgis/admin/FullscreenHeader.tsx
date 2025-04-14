
import { Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FullscreenHeaderProps {
  setFullscreenMode: (value: boolean) => void;
}

const FullscreenHeader = ({ setFullscreenMode }: FullscreenHeaderProps) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-slate-900/90 backdrop-blur-sm p-4 border-b border-slate-700 flex justify-between items-center">
      <h3 className="font-semibold text-white flex items-center">
        <div className="mr-2 h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
        WebGIS Command Center (Mode Fullscreen)
      </h3>
      <Button
        variant="outline" 
        size="sm" 
        className="ml-auto bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
        onClick={() => setFullscreenMode(false)}
      >
        <Minimize2 className="h-4 w-4 mr-2" />
        Keluar Fullscreen
      </Button>
    </div>
  );
};

export default FullscreenHeader;
