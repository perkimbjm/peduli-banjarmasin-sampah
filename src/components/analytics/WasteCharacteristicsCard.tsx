
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Droplet, Thermometer, FileBarChart } from "lucide-react";

interface WasteCharacteristic {
  name: string;
  value: string;
  unit: string;
  description?: string;
}

interface WasteCharacteristicsCardProps {
  characteristics?: WasteCharacteristic[];
}

const defaultCharacteristics: WasteCharacteristic[] = [
  {
    name: 'Kelembaban',
    value: '65',
    unit: '%',
    description: 'Tingkat kelembaban sampah mempengaruhi proses degradasi'
  },
  {
    name: 'Densitas',
    value: '175',
    unit: 'kg/m³',
    description: 'Kepadatan sampah mempengaruhi transportasi dan pengolahan'
  },
  {
    name: 'Kalori',
    value: '2,350',
    unit: 'kkal/kg',
    description: 'Nilai kalor sampah penting untuk konversi energi'
  },
  {
    name: 'Tingkat Bahaya',
    value: 'Rendah',
    unit: '',
    description: 'Mayoritas sampah tidak berbahaya dan dapat diolah'
  }
];

const WasteCharacteristicsCard = ({ characteristics = defaultCharacteristics }: WasteCharacteristicsCardProps) => {
  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'kelembaban':
        return <Droplet className="h-5 w-5 text-blue-500" />;
      case 'tingkat bahaya':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'kalori':
        return <Thermometer className="h-5 w-5 text-red-500" />;
      default:
        return <FileBarChart className="h-5 w-5 text-green-500" />;
    }
  };

  const getBadgeColor = (name: string) => {
    switch (name.toLowerCase()) {
      case 'kelembaban':
        return 'bg-blue-100 text-blue-800';
      case 'tingkat bahaya':
        return 'bg-orange-100 text-orange-800';
      case 'kalori':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <FileBarChart className="mr-2 h-5 w-5" />
          Karakteristik Sampah
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {characteristics.map((characteristic, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 flex flex-col"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getIcon(characteristic.name)}
                  <span className="ml-2 font-medium">{characteristic.name}</span>
                </div>
                <Badge variant="outline" className={getBadgeColor(characteristic.name)}>
                  {characteristic.value} {characteristic.unit}
                </Badge>
              </div>
              {characteristic.description && (
                <p className="mt-2 text-sm text-gray-500">
                  {characteristic.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WasteCharacteristicsCard;
