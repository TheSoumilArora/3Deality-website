
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Capabilities } from '@/components/Capabilities';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Capabilities />
      <Footer />
    </div>
  );
};

export default Index;