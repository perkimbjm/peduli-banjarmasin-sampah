
import { Link } from "react-router-dom";
import { 
  AlertTriangle, 
  Trash2, 
  ShieldAlert,
  Truck, 
  Wind, 
  Biohazard 
} from "lucide-react";

const EmergencySituationSection = () => {
  const emergencyIssues = [
    {
      icon: <AlertTriangle className="h-8 w-8 text-yellow-500" />,
      title: "Belum Beroperasi Normal",
      desc: "TPA Basirih belum beroperasi secara normal, kuota TPA Regional terbatas.",
      bg: "bg-white/10 backdrop-blur-sm",
    },
    {
      icon: <Trash2 className="h-8 w-8 text-green-400" />,
      title: "Timbunan Sampah",
      desc: "Timbunan sampah semakin banyak di berbagai titik di kota.",
      bg: "bg-white/10 backdrop-blur-sm",
    },
    {
      icon: <ShieldAlert className="h-8 w-8 text-gray-300" />,
      title: "Kota Tidak Nyaman",
      desc: "Pemandangan kota menjadi kotor dan tidak nyaman untuk ditinggali.",
      bg: "bg-white/10 backdrop-blur-sm",
    },
    {
      icon: <Truck className="h-8 w-8 text-blue-400" />,
      title: "Pengangkutan Terbatas",
      desc: "Pengangkutan sampah masih sangat terbatas, memerlukan upaya ekstra",
      bg: "bg-white/10 backdrop-blur-sm",
    },
    {
      icon: <Wind className="h-8 w-8 text-orange-400" />,
      title: "Bau Tak Sedap",
      desc: "Bau tak sedap menyebar, mengganggu kesehatan masyarakat.",
      bg: "bg-white/10 backdrop-blur-sm",
    },
    {
      icon: <Biohazard className="h-8 w-8 text-rose-400" />,
      title: "Risiko Penyakit",
      desc: "Risiko penyakit meningkat akibat pencemaran lingkungan yang terjadi.",
      bg: "bg-white/10 backdrop-blur-sm",
    },
  ];

  return (
    <section className="py-20 relative bg-fixed bg-cover bg-center before:content-[''] before:absolute before:inset-0 before:bg-black/80" style={{ backgroundImage: 'url(/assets/tpa.jpeg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Banjarmasin Darurat Sampah
          </h2>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Sampah menumpuk, bau, dan berisiko bagi kesehatan kita! Berikut adalah berbagai dampak yang terjadi.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {emergencyIssues.map((item, i) => (
            <div
              key={i}
              className={`${item.bg} rounded-xl shadow-md p-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg group border border-white/20`}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black/30 flex-shrink-0">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                {item.title}
              </h3>
              <p className="text-gray-200">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Saatnya Bersama Jaga Lingkungan!
          </h3>
          <p className="text-xl text-gray-200 max-w-xl mx-auto mb-6">
            Penutupan TPA Basirih bukan hanya masalah pemerintah—ini adalah panggilan untuk kita semua. Mari ambil peran aktif dalam memilah sampah, mengurangi limbah, dan menjaga kebersihan kota.
          </p>
          <Link
            to="/edukasi"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 mx-3 rounded-xl shadow-md transition-all duration-300"
          >
            Pelajari Cara Mengelola Sampah
          </Link>
          <a
            href="#idea"
            className="inline-block bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-3 px-6 mx-3 rounded-xl shadow-md transition-all duration-300 border border-white/20"
          >
            Sumbang Ide dan Kolaborasi
          </a>
        </div>
      </div>
    </section>
  );
};

export default EmergencySituationSection;
