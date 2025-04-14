
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ContactSection = () => {
  return (
    <section id="idea" className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Kirimkan Ide & Kolaborasi
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Kami terbuka untuk kolaborasi dan ide-ide segar. Bersama-sama, kita bisa menciptakan solusi pengelolaan sampah yang lebih baik untuk Banjarmasin.
            </p>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nama Lengkap
                  </label>
                  <input type="text" id="name" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-peduli-500 focus:border-peduli-500 dark:bg-gray-700 dark:text-white" placeholder="Masukkan nama lengkap Anda" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-peduli-500 focus:border-peduli-500 dark:bg-gray-700 dark:text-white" placeholder="Alamat email Anda" />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subjek
                </label>
                <input type="text" id="subject" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-peduli-500 focus:border-peduli-500 dark:bg-gray-700 dark:text-white" placeholder="Subjek pesan Anda" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pesan
                </label>
                <textarea id="message" rows={4} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-peduli-500 focus:border-peduli-500 dark:bg-gray-700 dark:text-white" placeholder="Uraikan ide atau kolaborasi yang Anda inginkan" />
              </div>
              <Button type="submit" className="btn-primary">
                Kirim Pesan
              </Button>
            </form>
          </div>
          <div className="bg-peduli-50 dark:bg-gray-700 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Pertanyaan Umum
            </h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">Bagaimana cara bergabung dengan PeduliSampah?</AccordionTrigger>
                <AccordionContent>
                  Anda dapat mendaftar secara gratis melalui halaman pendaftaran. Setelah mendaftar, Anda akan memiliki akses ke semua fitur sesuai dengan peran yang diberikan.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">Apa saja peran yang tersedia di PeduliSampah?</AccordionTrigger>
                <AccordionContent>
                  Terdapat 4 peran: Admin, Leader, Stakeholder, dan Volunteer. Masing-masing memiliki akses dan kemampuan yang berbeda dalam sistem.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">Bagaimana cara melaporkan pembuangan sampah ilegal?</AccordionTrigger>
                <AccordionContent>
                  Setelah login, Anda dapat mengakses fitur Pelaporan Masyarakat di dasbor. Di sana Anda dapat mengirimkan laporan lengkap dengan foto dan lokasi.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">Bagaimana data sampah dikumpulkan?</AccordionTrigger>
                <AccordionContent>
                  Data dikumpulkan melalui laporan masyarakat, pengukuran langsung dari TPS, dan integrasi dengan sistem pengelolaan sampah yang ada di Banjarmasin.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">Apakah aplikasi ini gratis?</AccordionTrigger>
                <AccordionContent>
                  Ya, PeduliSampah dapat diakses secara gratis oleh seluruh masyarakat Banjarmasin. Fitur-fitur dasar tersedia untuk semua pengguna yang terdaftar.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
