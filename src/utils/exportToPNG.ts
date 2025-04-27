// Utility to export a DOM element as PNG using html2canvas
// Requires html2canvas installed as a dependency
import html2canvas from "html2canvas";

export async function exportElementToPNG(element: HTMLElement, filename: string) {
  if (!element) return;
  const canvas = await html2canvas(element, { background: null });
  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}
