
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, MapPin } from "lucide-react";

interface DetailHeaderProps {
  name: string;
  logo: string;
  address: string;
  kelurahan: string;
  kecamatan: string;
  wasteTypes: string[];
}

export const DetailHeader = ({ 
  name, 
  logo, 
  address, 
  kelurahan, 
  kecamatan, 
  wasteTypes 
}: DetailHeaderProps) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-600 to-blue-600 text-white">
      <div className="absolute inset-0 opacity-20 bg-[url('/assets/bank-sampah.webp')] bg-cover bg-center" />
      <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-6 items-center">
        <Avatar className="h-24 w-24 md:h-32 md:w-32 rounded-xl bg-white p-1">
          <AvatarImage src={logo} alt={name} />
          <AvatarFallback className="bg-white text-green-700 text-xs font-bold p-2 rounded">
            {kelurahan}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold">{name}</h1>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {wasteTypes.map((type, index) => (
              <Badge key={index} variant="secondary" className="bg-white/20 hover:bg-white/30">
                {type}
              </Badge>
            ))}
          </div>
          <p className="flex items-center justify-center md:justify-start gap-1 text-sm md:text-base">
            <MapPin className="h-4 w-4" />
            {address}, Kel. {kelurahan}, Kec. {kecamatan}
          </p>
        </div>
      </div>
    </div>
  );
};
