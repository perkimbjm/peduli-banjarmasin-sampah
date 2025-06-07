
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, AlertTriangle, Building2, Recycle, Users, Target } from "lucide-react";
import { usePersampahanData } from "@/contexts/PersampahanDataContext";

interface AnalyticsSummaryCardsProps {
  userRole?: string | null;
}

const AnalyticsSummaryCards = ({ userRole }: AnalyticsSummaryCardsProps) => {
  const { stats, loading } = usePersampahanData();
  
  // Mock additional analytics data
  const analyticsData = {
    serviceCoverage: 87.5, // percentage
    underservedZones: 12,
    illegalTPS: 8, // This would come from reports data
    averageDistance: 450, // meters to nearest facility
  };

  const hasFullAccess = ['admin', 'leader', 'stakeholder'].includes(userRole || '');

  const cards = [
    {
      title: "Total TPS Aktif",
      value: loading ? "..." : stats.totalTPS.toString(),
      icon: MapPin,
      description: "Tempat Penampungan Sementara",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "TPS 3R",
      value: loading ? "..." : stats.totalTPS3R.toString(),
      icon: Recycle,
      description: "Reduce, Reuse, Recycle",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Bank Sampah",
      value: loading ? "..." : stats.totalBankSampah.toString(),
      icon: Building2,
      description: `${stats.kelurahanBankSampah} kelurahan terlayani`,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Cakupan Layanan",
      value: `${analyticsData.serviceCoverage}%`,
      icon: Target,
      description: "Populasi terlayani",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    },
  ];

  // Add sensitive data for full access users
  if (hasFullAccess) {
    cards.push(
      {
        title: "TPS Liar",
        value: analyticsData.illegalTPS.toString(),
        icon: AlertTriangle,
        description: "Memerlukan tindakan",
        color: "text-red-600",
        bgColor: "bg-red-50 dark:bg-red-900/20",
      },
      {
        title: "Zona Kurang Layanan",
        value: analyticsData.underservedZones.toString(),
        icon: Users,
        description: `>500m dari fasilitas`,
        color: "text-orange-600",
        bgColor: "bg-orange-50 dark:bg-orange-900/20",
      }
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AnalyticsSummaryCards;
