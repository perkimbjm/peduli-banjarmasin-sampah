
const ProhibitedActionsSection = () => {
  const prohibitedItems = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
      title: "Membuang sampah dalam kondisi tidak terpilah",
      desc: "Pastikan sampah sudah dipilah sesuai jenisnya sebelum dibuang",
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      title: "Membuang sampah dari pukul 06.00 - 20.00 WITA",
      desc: "Buanglah sampah pada waktu yang telah ditentukan",
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>,
      title: "Membakar sampah yang tidak sesuai",
      desc: "Pembakaran sampah harus sesuai dengan persyaratan pengelolaan",
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
      title: "Membuang sampah tidak pada tempatnya",
      desc: "Gunakan tempat sampah yang telah disediakan",
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
      title: "Membuang sampah tidak menggunakan kemasan yang terbungkus rapi",
      desc: "Pastikan sampah terbungkus rapi sebelum dibuang",
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
      title: "Mengais sampah di TPS",
      desc: "Dilarang mengais sampah di TPS yang disediakan Pemerintah Kota",
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
      title: "Membuang sampah di jalan-jalan",
      desc: "Dilarang membuang sampah di jalan, selokan, saluran air, dan badan air",
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
      title: "Membuat tempat penampungan sementara ilegal",
      desc: "Dilarang membuat TPS di lokasi yang tidak direkomendasikan",
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
      title: "Mengelola sampah tidak sesuai perizinan",
      desc: "Pengelolaan sampah harus sesuai dengan yang ditetapkan dalam perizinan",
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gradient-to-b dark:from-[#0f172a] dark:to-[#1e293b] relative">
      <div className="absolute inset-0 dark:bg-[url('/assets/stars.png')] dark:opacity-30 pointer-events-none"></div>
      <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-transparent dark:to-[#0f172a]/80 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Setiap Warga, <span className="text-red-600">DILARANG</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Demi menjaga kebersihan dan ketertiban kota Banjarmasin, setiap warga dilarang melakukan hal-hal berikut:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prohibitedItems.map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700 group hover:bg-red-50 dark:hover:bg-red-900/10"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 relative">
                  {item.icon}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-12 h-12 text-red-600/90 dark:text-red-500/90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2"/>
                      <line x1="4" y1="20" x2="20" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400">
                  {item.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 ml-16">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Pelanggaran terhadap larangan di atas dapat dikenakan sanksi sesuai dengan peraturan yang berlaku.
            <br />
            <span className="font-semibold text-red-600 dark:text-red-400">Mari bersama menjaga kebersihan kota Banjarmasin!</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProhibitedActionsSection;
