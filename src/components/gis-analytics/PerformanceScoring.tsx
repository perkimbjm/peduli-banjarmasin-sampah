
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface PerformanceScoringProps {
  userRole?: string | null;
}

const PerformanceScoring = ({ userRole }: PerformanceScoringProps) => {
  const performanceData = [
    {
      region: 'Banjarmasin Tengah',
      score: 85,
      population: 180000,
      facilities: 25,
      coverage: 92,
      status: 'good'
    },
    {
      region: 'Banjarmasin Selatan',
      score: 78,
      population: 220000,
      facilities: 22,
      coverage: 88,
      status: 'good'
    },
    {
      region: 'Banjarmasin Utara',
      score: 65,
      population: 195000,
      facilities: 15,
      coverage: 75,
      status: 'warning'
    },
    {
      region: 'Banjarmasin Timur',
      score: 72,
      population: 175000,
      facilities: 18,
      coverage: 82,
      status: 'good'
    },
    {
      region: 'Banjarmasin Barat',
      score: 58,
      population: 205000,
      facilities: 20,
      coverage: 68,
      status: 'critical'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'good': return 'Baik';
      case 'warning': return 'Perhatian';
      case 'critical': return 'Kritis';
      default: return 'Tidak Diketahui';
    }
  };

  const hasFullAccess = ['admin', 'leader', 'stakeholder'].includes(userRole || '');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skor Kinerja Regional</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {performanceData.map((region, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{region.region}</h3>
                <Badge className={getStatusColor(region.status)}>
                  {getStatusLabel(region.status)}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Skor Komposit</span>
                  <span className="font-medium">{region.score}/100</span>
                </div>
                <Progress value={region.score} className="h-2" />
              </div>

              {hasFullAccess && (
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Populasi</span>
                    <p className="font-medium">{region.population.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fasilitas</span>
                    <p className="font-medium">{region.facilities} unit</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cakupan</span>
                    <p className="font-medium">{region.coverage}%</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceScoring;
