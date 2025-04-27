import { kinerjaPengelolaanSampah } from "@/data/kinerjaPengelolaanSampah";

export function getKinerjaSampahData() {
  return kinerjaPengelolaanSampah.map((d) => {
    const penguranganPersen = d.timbulan > 0 ? (d.pengurangan / d.timbulan) * 100 : 0;
    const penangananPersen = d.timbulan > 0 ? (d.penanganan / d.timbulan) * 100 : 0;
    const terkelola = d.pengurangan + d.penanganan;
    const terkelolaPersen = d.timbulan > 0 ? (terkelola / d.timbulan) * 100 : 0;
    const recyclingRate = d.timbulan > 0 ? ((d.daurUlang + d.bahanBaku) / d.timbulan) * 100 : 0;
    return {
      ...d,
      penguranganPersen,
      penangananPersen,
      terkelola,
      terkelolaPersen,
      recyclingRate,
    };
  });
}
