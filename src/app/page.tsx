import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import VisualProof from "@/components/VisualProof";
import Process from "@/components/Process";
import EligibilityForm from "@/components/EligibilityForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <VisualProof />
      <Process />
      <EligibilityForm />
      <Footer />
    </main>
  );
}
