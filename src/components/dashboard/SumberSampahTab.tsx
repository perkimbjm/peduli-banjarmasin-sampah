import { useMemo, useState, useRef } from "react";
import { getSumberSampahData, SumberSampahData } from "@/data/sumberSampah";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from "recharts";
import { exportToCSV } from "@/utils/exportToCSV";
import { exportElementToPNG } from "@/utils/exportToPNG";
import { Download } from "lucide-react";

const SUMBER_FIELDS = [
  { key: "Rumah Tangga", color: "#22c55e" },
  { key: "Perkantoran", color: "#6366f1" },
  { key: "Pasar", color: "#f59e42" },
  { key: "Perniagaan", color: "#0284c7" },
  { key: "Fasilitas Publik", color: "#a21caf" },
  { key: "Kawasan", color: "#f43f5e" },
  { key: "Lain", color: "#3b82f6" },
  { key: "Total", color: "#0ea5e9" },
];

export default function SumberSampahTab() {
  const data = useMemo(() => getSumberSampahData(), []);
  const tahunList = useMemo(() => Array.from(new Set(data.map(d => d.tahun))).sort(), [data]);
  const tahunMinDefault = tahunList[0];
  const tahunMaxDefault = tahunList[tahunList.length - 1];
  const [tahunMin, setTahunMin] = useState<number>(tahunMinDefault);
  const [tahunMax, setTahunMax] = useState<number>(tahunMaxDefault);
  const [selectedFields, setSelectedFields] = useState<string[]>(SUMBER_FIELDS.map(f => f.key));
  const chartRef = useRef<HTMLDivElement>(null);
  const chartBarRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => data.filter(d => d.tahun >= tahunMin && d.tahun <= tahunMax), [data, tahunMin, tahunMax]);

  const handleToggleField = (key: string) => {
    setSelectedFields(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const handleExportCSV = () => {
    const columns = ["tahun", ...SUMBER_FIELDS.map(f => f.key)];
    const headers = ["Tahun", ...SUMBER_FIELDS.map(f => f.key + " (ton)")];
    exportToCSV("sumber-sampah.csv", data.map(d => ({
      tahun: d.tahun,
      ...Object.fromEntries(SUMBER_FIELDS.map(f => [f.key, d[f.key]])),
    })), columns, headers);
  };
  const handleExportPNG = () => {
    if (chartRef.current) exportElementToPNG(chartRef.current, "sumber-sampah-chart.png");
  };
  const handleExportBarPNG = () => {
    if (chartBarRef.current) exportElementToPNG(chartBarRef.current, "sumber-sampah-bar-chart.png");
  };

  // Transform data untuk grouped bar per sumber
  const sumberKeys = SUMBER_FIELDS.filter(f => f.key !== "Total" && selectedFields.includes(f.key)).map(f => f.key);
  const tahunKeys = [];
  for (let t = tahunMin; t <= tahunMax; t++) tahunKeys.push(t);
  // dataGrouped: [{ sumber: "Rumah Tangga", 2020: 10250, 2021: ..., ... }, ...]
  const dataGrouped = sumberKeys.map(sumber => {
    const obj: Record<string, any> = { sumber };
    tahunKeys.forEach(tahun => {
      const found = data.find(d => d.tahun === tahun);
      obj[tahun] = found ? found[sumber] : 0;
    });
    return obj;
  });

  return (
    <div>
      {/* Filter */}
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
        <Button size="sm" variant="outline" onClick={handleExportCSV}><Download className="w-4 h-4 mr-1" />Download CSV</Button>
        <Button size="sm" variant="outline" onClick={handleExportPNG}>Export Chart as PNG</Button>
      </div>

      {/* Multi-line toggle */}
      <div className="flex flex-wrap gap-2 mb-2">
        {SUMBER_FIELDS.filter(f => f.key !== "Total").map(f => (
          <button
            key={f.key}
            type="button"
            className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors ${selectedFields.includes(f.key)
              ? `bg-[${f.color}] text-white shadow-md`
              : `border-[${f.color}] text-[${f.color}] bg-white dark:bg-gray-900 hover:bg-[${f.color}]/10`}`}
            style={{ borderColor: f.color, color: selectedFields.includes(f.key) ? '#fff' : f.color, background: selectedFields.includes(f.key) ? f.color : undefined }}
            onClick={() => handleToggleField(f.key)}
          >
            <span className="w-2 h-2 rounded-full inline-block mr-1" style={{ background: f.color }} />
            {f.key}
          </button>
        ))}
      </div>

      {/* Line Chart */}
      <div ref={chartRef} className="mb-8 bg-white dark:bg-gray-900 rounded-lg p-4 shadow">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data.filter(d => d.tahun >= tahunMin && d.tahun <= tahunMax)} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <XAxis dataKey="tahun" />
            <YAxis />
            <Tooltip content={({ active, payload, label }) => {
              if (!active || !payload) return null;
              return (
                <div className="rounded-lg border bg-white dark:bg-gray-900 px-3 py-2 text-xs shadow">
                  <div className="font-semibold mb-1">Tahun: {label}</div>
                  {payload.filter((item: { dataKey: string }) => selectedFields.includes(item.dataKey)).map((item: { dataKey: string, value: number }) => (
                    <div key={item.dataKey} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ background: SUMBER_FIELDS.find(f => f.key === item.dataKey)?.color }} />
                      <span>{item.dataKey}:</span>
                      <span className="font-mono">{Number(item.value).toLocaleString("id-ID", { maximumFractionDigits: 1 })} ton</span>
                    </div>
                  ))}
                </div>
              );
            }} />
            <Legend />
            {SUMBER_FIELDS.filter(f => selectedFields.includes(f.key)).map(f => (
              <Line
                key={f.key}
                type="monotone"
                dataKey={f.key}
                name={f.key}
                stroke={f.color}
                strokeWidth={2}
                dot
                isAnimationActive
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="mb-8 bg-white dark:bg-gray-900 rounded-lg p-4 shadow">
        <div className="flex justify-end mb-2">
          <Button size="sm" variant="outline" onClick={handleExportBarPNG}>
            <Download className="w-4 h-4 mr-1" />Export Chart as PNG
          </Button>
        </div>
        <div ref={chartBarRef}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={dataGrouped} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} barCategoryGap={tahunKeys.length === 1 ? 0 : 20} barGap={tahunKeys.length === 1 ? 0 : 20}>
              <XAxis dataKey="sumber" type="category" />
              <YAxis />
              <Tooltip
                cursor={{ fill: "rgba(59,130,246,0.08)" }}
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) return null;
                  // payload: semua bar tahun aktif di group sumber ini
                  return (
                    <div className="rounded-lg border bg-white dark:bg-gray-900 px-3 py-2 text-xs shadow">
                      <div className="font-semibold mb-1">Sumber: {label}</div>
                      {payload.filter(item => item.value !== undefined && item.dataKey).map((bar, idx) => (
                        <div key={bar.dataKey} className="flex items-center gap-2 mb-0.5">
                          <span className="w-2 h-2 rounded-full inline-block" style={{ background: ['#22c55e', '#6366f1', '#f59e42', '#0284c7'][idx % 4] }} />
                          <span>Tahun: {bar.dataKey}</span>
                          <span className="font-mono">{Number(bar.value).toLocaleString("id-ID", { maximumFractionDigits: 1 })} ton</span>
                        </div>
                      ))}
                    </div>
                  );
                }}
              />
              <Legend />
              {tahunKeys.map((tahun, idx) => (
                <Bar
                  key={tahun}
                  dataKey={tahun}
                  name={tahun.toString()}
                  fill={['#22c55e', '#6366f1', '#f59e42', '#0284c7'][idx % 4]}
                  radius={[6, 6, 6, 6]}
                  barSize={tahunKeys.length === 1 ? 72 : 32}
                  isAnimationActive
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tahun</TableHead>
              {SUMBER_FIELDS.map(f => (
                <TableHead key={f.key}>{f.key} (ton)</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((d, i) => (
              <TableRow key={i}>
                <TableCell className="text-center font-semibold">{d.tahun}</TableCell>
                {SUMBER_FIELDS.map(f => (
                  <TableCell key={f.key} className="text-right">{d[f.key as keyof SumberSampahData].toLocaleString("id-ID", { maximumFractionDigits: 1 })}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
