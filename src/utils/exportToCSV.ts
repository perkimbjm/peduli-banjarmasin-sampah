// Utility to export array of objects as CSV string and trigger download
export function exportToCSV(filename: string, rows: Record<string, unknown>[], columns: string[], headers: string[]) {
  if (!rows.length) return;
  const csvRows = [
    headers.join(","),
    ...rows.map(row =>
      columns.map(col => {
        let val = row[col];
        if (typeof val === "number") val = val.toLocaleString("id-ID");
        if (typeof val === "string" && val.includes(",")) val = `"${val}"`;
        return val;
      }).join(",")
    )
  ];
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
