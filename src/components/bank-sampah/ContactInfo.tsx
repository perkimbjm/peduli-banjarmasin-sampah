
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Phone, Mail, Instagram, Clock, Recycle, User } from "lucide-react";

interface ContactInfoProps {
  manager: string;
  phoneNumber: string;
  email: string;
  instagram?: string;
  operationalHours: string;
  wasteTypes: string[];
}

export const ContactInfo = ({
  manager,
  phoneNumber,
  email,
  instagram,
  operationalHours,
  wasteTypes
}: ContactInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building className="h-5 w-5 mr-2" />
          Kontak & Informasi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center">
          <User className="h-5 w-5 mr-3 text-green-600" />
          <div>
            <p className="text-sm text-muted-foreground">Pengelola</p>
            <p className="font-semibold">{manager}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Phone className="h-5 w-5 mr-3 text-green-600" />
          <div>
            <p className="text-sm text-muted-foreground">Telepon</p>
            <p className="font-semibold">{phoneNumber}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Mail className="h-5 w-5 mr-3 text-green-600" />
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-semibold">{email}</p>
          </div>
        </div>
        {instagram && (
          <a 
            href={`https://instagram.com/${instagram.replace("@", "")}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            <Instagram className="h-4 w-4" /> {instagram}
          </a>
        )}
        <div className="flex items-center">
          <Clock className="h-5 w-5 mr-3 text-green-600" />
          <div>
            <p className="text-sm text-muted-foreground">Jam Operasional</p>
            <p className="font-semibold">{operationalHours}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Recycle className="h-5 w-5 mr-3 text-green-600" />
          <div>
            <p className="text-sm text-muted-foreground">Jenis Sampah</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {wasteTypes.map((type, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
