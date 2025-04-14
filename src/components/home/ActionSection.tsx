
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ActionSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-green-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] relative">
      <div className="absolute inset-0 dark:bg-[url('/assets/stars.png')] dark:opacity-30 pointer-events-none"></div>
      <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-transparent dark:to-[#0f172a]/80 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Aksi Nyata Yang Bisa Kita Lakukan
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Mari berpartisipasi aktif dalam pengelolaan sampah dengan melakukan aksi-aksi nyata berikut:
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center space-x-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-bold">1</span>
                <h3 className="text-xl font-semibold text-left">Melakukan Aksi 3R (Reduce, Reuse, Recycle)</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pt-2 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                  <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">Reduce</h4>
                  <p className="text-gray-600 dark:text-gray-300">Mengurangi penggunaan barang yang berpotensi menjadi sampah</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                  <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Reuse</h4>
                  <p className="text-gray-600 dark:text-gray-300">Menggunakan kembali barang yang masih bisa dipakai</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                  <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">Recycle</h4>
                  <p className="text-gray-600 dark:text-gray-300">Mendaur ulang sampah menjadi barang yang bernilai</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center space-x-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-bold">2</span>
                <h3 className="text-xl font-semibold text-left">Pilah Sampah dari Sumber</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pt-2 pb-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6">
                <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="font-medium">Mencampur sampah dapat menyebabkan bau dan membuat sampah sulit didaur ulang!</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                  <div className="aspect-square relative mb-4 overflow-hidden rounded-lg">
                    <img 
                      src="/assets/organik.png" 
                      alt="Sampah Organik" 
                      loading="lazy"
                      className="object-cover w-full h-full transform transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">Sampah Organik</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Sisa makanan, sayuran, buah, dan sebagainya yang mudah basi atau membusuk</p>
                  <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/40 rounded-lg">
                    <p className="text-sm font-medium text-green-800 dark:text-green-300">Simpan di ember tertutup</p>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl">
                  <div className="aspect-square relative mb-4 overflow-hidden rounded-lg">
                    <img 
                      src="/assets/anorganik.png" 
                      alt="Sampah Anorganik"
                      loading="lazy" 
                      className="object-cover w-full h-full transform transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <h4 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2">Sampah Anorganik</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Plastik, kaca, kertas, kardus, logam, dan sebagainya</p>
                  <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Bersihkan, keringkan, simpan dalam kantong putih/warna</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                  <div className="aspect-square relative mb-4 overflow-hidden rounded-lg">
                    <img 
                      src="/assets/residu.png" 
                      alt="Sampah Residu"
                      loading="lazy" 
                      className="object-cover w-full h-full transform transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Sampah Residu</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Popok, pembalut, tisu, puntung rokok, pembalut, dan sebagainya yang tidak bisa diolah lagi</p>
                  <div className="mt-4 p-3 bg-gray-200 dark:bg-gray-600 rounded-lg">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-300">Simpan dalam kantong hitam</p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center space-x-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-bold">3</span>
                <h3 className="text-xl font-semibold text-left">Olah Sampah di Tempat</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pt-2 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative group">
                  <div className="aspect-square relative mb-4 overflow-hidden rounded-xl">
                    <img 
                      src="/assets/komposter.jpg" 
                      alt="Komposter"
                      loading="lazy" 
                      className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-green-600/20 group-hover:bg-green-600/30 transition-colors duration-300"></div>
                  </div>
                  <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">Sampah Organik</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Olah dengan drum komposter, bata terawang, takakura</p>
                </div>

                <div className="relative group">
                  <div className="aspect-square relative mb-4 overflow-hidden rounded-xl">
                    <img 
                      src="/assets/bank-sampah.jpg" 
                      alt="Bank Sampah"
                      loading="lazy" 
                      className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-blue-600/20 group-hover:bg-blue-600/30 transition-colors duration-300"></div>
                  </div>
                  <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Sampah Anorganik</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Serahkan ke Bank Sampah terdekat</p>
                </div>

                <div className="relative group">
                  <div className="aspect-square relative mb-4 overflow-hidden rounded-xl">
                    <img 
                      src="/assets/tps.jpg" 
                      alt="TPS"
                      loading="lazy" 
                      className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gray-600/20 group-hover:bg-gray-600/30 transition-colors duration-300"></div>
                  </div>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Sampah Residu</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Serahkan ke "Paman Gerobak" atau TPS terdekat</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Dengan melakukan aksi nyata ini, kita berkontribusi dalam menciptakan Banjarmasin yang lebih bersih dan berkelanjutan.
            <br />
            <span className="font-semibold text-green-600 dark:text-green-400">Setiap aksi kecil kita memiliki dampak besar!</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ActionSection;
