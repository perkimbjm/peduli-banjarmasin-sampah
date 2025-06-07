
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, Users, MapPin } from "lucide-react";

const AnomalyDetection = () => {
  const anomalies = [
    {
      id: 1,
      type: 'overload',
      title: 'TPS Pasar Lama Overload',
      description: 'Volume sampah melebihi kapasitas normal 150%',
      severity: 'high',
      location: 'Banjarmasin Tengah',
      icon: TrendingUp,
    },
    {
      id: 2,
      type: 'underserved',
      title: 'Zona Tanpa Layanan',
      description: 'Kelurahan Sungai Jingah tidak memiliki TPS dalam radius 1km',
      severity: 'medium',
      location: 'Banjarmasin Utara',
      icon: Users,
    },
    {
      id: 3,
      type: 'cluster',
      title: 'Cluster TPS Liar',
      description: '5 TPS liar ditemukan dalam radius 500m dari TPS resmi',
      severity: 'high',
      location: 'Banjarmasin Selatan',
      icon: AlertTriangle,
    },
    {
      id: 4,
      type: 'route',
      title: 'Rute Tidak Efisien',
      description: 'Rute pengangkutan melewati jalan yang sama 3x dalam sehari',
      severity: 'low',
      location: 'Banjarmasin Barat',
      icon: MapPin,
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'high': return 'Tinggi';
      case 'medium': return 'Sedang';
      case 'low': return 'Rendah';
      default: return 'Tidak Diketahui';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Deteksi Anomali
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {anomalies.map((anomaly) => (
            <div key={anomaly.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <anomaly.icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">{anomaly.title}</h3>
                    <p className="text-sm text-muted-foreground">{anomaly.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {anomaly.location}
                    </div>
                  </div>
                </div>
                <Badge variant={getSeverityColor(anomaly.severity) as any}>
                  {getSeverityLabel(anomaly.severity)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnomalyDetection;
