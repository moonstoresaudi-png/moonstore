import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import Hero from '@/components/sections/Hero';
import TrustBadges from '@/components/sections/TrustBadges';
import Categories from '@/components/sections/Categories';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import DeliveryAnimation from '@/components/sections/DeliveryAnimation';
import TestimonialsMarquee from '@/components/sections/TestimonialsMarquee';
import Newsletter from '@/components/sections/Newsletter';
import OffersSection from '@/components/sections/OffersSection';
import PrepBanner from '@/components/sections/PrepBanner';

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <PrepBanner />
      <Navbar />
      <main>
        <Hero />
        <TrustBadges />
        <Categories />
        <FeaturedProducts />
        <OffersSection />
        <DeliveryAnimation />
        <TestimonialsMarquee />
        <Newsletter />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}