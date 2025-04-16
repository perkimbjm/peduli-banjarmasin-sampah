
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import EmergencySituationSection from "@/components/home/EmergencySituationSection";
import ActionSection from "@/components/home/ActionSection";
import ProhibitedActionsSection from "@/components/home/ProhibitedActionsSection";
import ReportingContactsSection from "@/components/home/ReportingContactsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import ContactSection from "@/components/home/ContactSection";
import BankSampahSearch from "@/components/home/BankSampahSearch";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <HeroSection />
      <BankSampahSearch />
      <EmergencySituationSection />
      <ActionSection />
      <ProhibitedActionsSection />
      <ReportingContactsSection />
      <FeaturesSection />
      <ContactSection />
      
      <Footer />
    </div>
  );
};

export default Index;
