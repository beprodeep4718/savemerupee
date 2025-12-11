import { useState } from 'react';
import Header from '../components/home/Header';
import Hero from '../components/home/Hero';
import IdealStudent from '../components/home/IdealStudent';
import HowItWorks from '../components/home/HowItWorks';
import ReferralProgram from '../components/home/ReferralProgram';
import Features from '../components/home/Features';
import Pricing from '../components/home/Pricing';
import CallbackModal from '../components/home/CallbackModal';
import Footer from '../components/home/Footer';

function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-white">
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} onOpenModal={openModal} />
      <Hero />
      <IdealStudent />
      <Features />
      <HowItWorks />
      <ReferralProgram />
      <Pricing />
      <Footer />
      <CallbackModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default Home;
