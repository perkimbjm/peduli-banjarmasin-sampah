import { useState, useMemo, useRef } from "react";
import { getKinerjaSampahData } from "@/data/getKinerjaSampahData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exportToCSV } from "@/utils/exportToCSV";
import { exportElementToPNG } from "@/utils/exportToPNG";
import { Sparkline } from "@/components/ui/sparkline";
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import MetricToggle from "./MetricToggle";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

const METRICS = [
  { key: "timbulan", label: "Timbulan Sampah (ton)", color: "#6366f1", type: "ton", group: "Volume" },
  { key: "pengurangan", label: "Pengurangan Sampah (ton)", color: "#22c55e", type: "ton", group: "Volume" },
  { key: "penanganan", label: "Penanganan Sampah (ton)", color: "#f59e42", type: "ton", group: "Volume" },
  { key: "terkelola", label: "Sampah Terkelola (ton)", color: "#0284c7", type: "ton", group: "Volume" },
  { key: "daurUlang", label: "Daur Ulang (ton)", color: "#a21caf", type: "ton", group: "Volume" },
  { key: "bahanBaku", label: "Bahan Baku (ton)", color: "#f43f5e", type: "ton", group: "Volume" },
  { key: "penguranganPersen", label: "Pengurangan (%)", color: "#16a34a", type: "percent", group: "Persentase" },
  { key: "penangananPersen", label: "Penanganan (%)", color: "#f59e42", type: "percent", group: "Persentase" },
  { key: "terkelolaPersen", label: "Sampah Terkelola (%)", color: "#0284c7", type: "percent", group: "Persentase" },
  { key: "recyclingRate", label: "Recycling Rate (%)", color: "#3b82f6", type: "percent", group: "Persentase" },
];

function formatValue(val: number, type: string) {
  if (type === "ton") return `${val.toLocaleString("id-ID", { maximumFractionDigits: 1 })} ton`;
  if (type === "percent") return `${val.toLocaleString("id-ID", { maximumFractionDigits: 1 })} %`;
  return val;
}

const KinerjaPengelolaanSampahTab = () => {
  const [selectedMetrics, setSelectedMetrics] = useState(["pengurangan", "penanganan", "terkelola"]);
  const [terkelolaMin, setTerkelolaMin] = useState(0);
  const chartRef = useRef<HTMLDivElement>(null);
  const data = useMemo(() => getKinerjaSampahData(), []);

  const tahunList = data.map((d) => d.tahun).sort((a, b) => a - b);
  const tahunMinDefault = tahunList[0];
  const tahunMaxDefault = tahunList[tahunList.length - 1];
  const [tahunMin, setTahunMin] = useState<number>(tahunMinDefault);
  const [tahunMax, setTahunMax] = useState<number>(tahunMaxDefault);

  const filtered = useMemo(() => {
    let d = data;
    d = d.filter((row) => row.tahun >= tahunMin && row.tahun <= tahunMax);
    if (terkelolaMin > 0) d = d.filter((row) => row.terkelolaPersen > terkelolaMin);
    return d;
  }, [data, tahunMin, tahunMax, terkelolaMin]);

  const sparkMetric = selectedMetrics[0] || "terkelola";
  const sparkData = data.map((d) => d[sparkMetric]);
  const sparkType = METRICS.find((m) => m.key === sparkMetric)?.type || "ton";
  const sparkColor = METRICS.find((m) => m.key === sparkMetric)?.color || "#0284c7";

  const handleExportCSV = () => {
    const columns = [
      "tahun","timbulan","pengurangan","penguranganPersen","penanganan","penangananPersen","terkelola","terkelolaPersen","daurUlang","bahanBaku","recyclingRate"
    ];
    const headers = [
      "Tahun","Timbulan Sampah (ton)","Pengurangan Sampah (ton)","Pengurangan Sampah (%)","Penanganan Sampah (ton)","Penanganan Sampah (%)","Sampah Terkelola (ton)","Sampah Terkelola (%)","Daur Ulang (ton)","Bahan Baku (ton)","Recycling Rate (%)"
    ];
    exportToCSV("kinerja-sampah.csv", filtered, columns, headers);
  };
  const handleExportPNG = () => {
    if (chartRef.current) exportElementToPNG(chartRef.current, "kinerja-sampah-chart.png");
  };
  const handleMetricToggle = (key: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <div>
          <label className="block text-xs font-medium mb-1">Tahun</label>
          <div className="flex flex-col min-w-[160px]">
            <div className="flex items-center gap-2 text-xs mb-1">
              <span>{tahunMin}</span>
              <span className="text-gray-400">s/d</span>
              <span>{tahunMax}</span>
            </div>
            <input
              type="range"
              min={tahunMinDefault}
              max={tahunMaxDefault}
              value={tahunMin}
              onChange={e => setTahunMin(Math.min(Number(e.target.value), tahunMax))}
              className="w-full accent-primary"
            />
            <input
              type="range"
              min={tahunMinDefault}
              max={tahunMaxDefault}
              value={tahunMax}
              onChange={e => setTahunMax(Math.max(Number(e.target.value), tahunMin))}
              className="w-full accent-primary mt-1"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Sampah Terkelola (%) &gt;</label>
          <Input
            type="number"
            min={0}
            max={100}
            step={1}
            value={terkelolaMin}
            onChange={(e) => setTerkelolaMin(Number(e.target.value))}
            className="w-20 h-7 px-2 py-1 text-xs"
          />
        </div>
        <Button size="sm" variant="outline" onClick={handleExportCSV}>Download CSV</Button>
        <Button size="sm" variant="outline" onClick={handleExportPNG}>Export Chart as PNG</Button>
      </div>

      {/* Metric Toggles */}
      <div className="flex flex-col gap-4 mb-2 items-stretch">
        <div className="w-full">
          <MetricToggle
            metrics={METRICS.filter(m => m.group === "Volume")}
            selectedMetrics={selectedMetrics}
            onToggle={handleMetricToggle}
            groupLabel="Volume (ton/tahun)"
          />
        </div>
        <div className="w-full mb-4">
          <MetricToggle
            metrics={METRICS.filter(m => m.group === "Persentase")}
            selectedMetrics={selectedMetrics}
            onToggle={handleMetricToggle}
            groupLabel="Persentase (%)"
          />
        </div>
      </div>

      {/* Sparkline */}
      <div className="mb-2 flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Tren {METRICS.find(m => m.key === sparkMetric)?.label}</span>
        <Sparkline data={sparkData} color={sparkColor} height={20} />
      </div>

      {/* Chart */}
      <div ref={chartRef} className="mb-8 bg-white dark:bg-gray-900 rounded-lg p-4 shadow">
        <ResponsiveContainer width="100%" height={320}>
          <RechartsLineChart data={filtered} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <XAxis dataKey="tahun" />
            <YAxis />
            <Tooltip content={({ active, payload, label }) => {
              if (!active || !payload) return null;
              return (
                <div className="rounded-lg border bg-white dark:bg-gray-900 px-3 py-2 text-xs shadow">
                  <div className="font-semibold mb-1">Tahun: {label}</div>
                  {payload.map((item: { dataKey: string; value: number }, idx: number) => {
                    const metric = METRICS.find(m => m.key === item.dataKey);
                    return (
                      <div key={item.dataKey} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ background: metric?.color }} />
                        <span>{metric?.label}:</span>
                        <span className="font-mono">{formatValue(item.value, metric?.type || "ton")}</span>
                      </div>
                    );
                  })}
                </div>
              );
            }} />
            <Legend />
            {METRICS.filter(m => selectedMetrics.includes(m.key)).map((m) => (
              <Line
                key={m.key}
                type="monotone"
                dataKey={m.key}
                name={m.label}
                stroke={m.color}
                strokeWidth={2}
                dot
                isAnimationActive
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tahun</TableHead>
              <TableHead>Timbulan Sampah<br/>(ton/tahun)</TableHead>
              <TableHead>Pengurangan Sampah<br/>(ton/tahun)</TableHead>
              <TableHead>Pengurangan Sampah (%)</TableHead>
              <TableHead>Penanganan Sampah<br/>(ton/tahun)</TableHead>
              <TableHead>Penanganan Sampah (%)</TableHead>
              <TableHead>Sampah Terkelola<br/>(ton/tahun)</TableHead>
              <TableHead>Sampah Terkelola (%)</TableHead>
              <TableHead>Daur Ulang<br/>(ton/tahun)</TableHead>
              <TableHead>Bahan Baku<br/>(ton/tahun)</TableHead>
              <TableHead>Recycling Rate (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((d) => (
              <TableRow key={d.tahun}>
                <TableCell className="text-center font-semibold">{d.tahun}</TableCell>
                <TableCell className="text-right">{d.timbulan.toLocaleString("id-ID", { maximumFractionDigits: 1 })}</TableCell>
                <TableCell className="text-right">{d.pengurangan.toLocaleString("id-ID", { maximumFractionDigits: 1 })}</TableCell>
                <TableCell>
                  <div className="flex flex-col items-end">
                    <span>{d.penguranganPersen.toLocaleString("id-ID", { maximumFractionDigits: 1 })} %</span>
                    <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
                      <div className="bg-green-500 h-full rounded-full transition-all duration-700" style={{ width: `${d.penguranganPersen}%` }} />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">{d.penanganan.toLocaleString("id-ID", { maximumFractionDigits: 1 })}</TableCell>
                <TableCell>
                  <div className="flex flex-col items-end">
                    <span>{d.penangananPersen.toLocaleString("id-ID", { maximumFractionDigits: 1 })} %</span>
                    <div className="w-24 h-3 bg-orange-400/40 dark:bg-orange-900/40 rounded-full overflow-hidden mt-1">
                      <div className="bg-orange-400 h-full rounded-full transition-all duration-700" style={{ width: `${d.penangananPersen}%` }} />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">{d.terkelola.toLocaleString("id-ID", { maximumFractionDigits: 1 })}</TableCell>
                <TableCell>
                  <div className="flex flex-col items-end">
                    <span>{d.terkelolaPersen.toLocaleString("id-ID", { maximumFractionDigits: 1 })} %</span>
                    <div className="w-24 h-3 bg-blue-400/40 dark:bg-blue-900/40 rounded-full overflow-hidden mt-1">
                      <div className="bg-blue-500 h-full rounded-full transition-all duration-700" style={{ width: `${d.terkelolaPersen}%` }} />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">{d.daurUlang.toLocaleString("id-ID", { maximumFractionDigits: 1 })}</TableCell>
                <TableCell className="text-right">{d.bahanBaku.toLocaleString("id-ID", { maximumFractionDigits: 1 })}</TableCell>
                <TableCell>
                  <div className="flex flex-col items-end">
                    <span>{d.recyclingRate.toLocaleString("id-ID", { maximumFractionDigits: 1 })} %</span>
                    <div className="w-24 h-3 bg-indigo-400/40 dark:bg-indigo-900/40 rounded-full overflow-hidden mt-1">
                      <div className="bg-indigo-500 h-full rounded-full transition-all duration-700" style={{ width: `${d.recyclingRate}%` }} />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default KinerjaPengelolaanSampahTab;