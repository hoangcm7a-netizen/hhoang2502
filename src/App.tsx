import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from './supabase';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import DevSection from './components/DevSection';
import MediaSection from './components/MediaSection';
import ContactSection from './components/ContactSection';
import Admin from './components/Admin';
import LanguageToggle from './components/LanguageToggle';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import CommandMenu from './components/CommandMenu';
import { Toaster } from '@/components/ui/sonner';

const GA_MEASUREMENT_ID = 'G-PZNPT564W4'; // THAY MÃ GOOGLE CỦA BẠN VÀO ĐÂY SAU

const Portfolio = () => (
  <main className="bg-background text-foreground min-h-screen font-sans selection:bg-primary/30 relative">
    <Preloader />
    <CustomCursor />
    <CommandMenu />
    <LanguageToggle />
    <Navigation />
    <Hero />
    <DevSection />
    <MediaSection />
    <AboutSection />
    <ContactSection />
  </main>
);

function App() {
  const [seo, setSeo] = useState<any>(null);

  useEffect(() => {
    // 1. Tải SEO từ Supabase Database
    const fetchSEO = async () => {
      const { data } = await supabase.from('seo_settings').select('*').eq('id', 1).single();
      if (data) setSeo(data);
    };
    fetchSEO();
  }, []);

  return (
    <>
      {/* Khung thẻ Meta nhúng vào mã nguồn HTML */}
      {seo && (
        <Helmet>
          <title>{seo.title}</title>
          <meta name="description" content={seo.description} />
          <meta name="keywords" content={seo.keywords} />
          
          <meta property="og:type" content="website" />
          <meta property="og:title" content={seo.title} />
          <meta property="og:description" content={seo.description} />
          <meta property="og:image" content={seo.og_image} />
          <meta property="og:url" content={seo.site_url} />
          
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seo.title} />
          <meta name="twitter:description" content={seo.description} />
          <meta name="twitter:image" content={seo.og_image} />
        </Helmet>
      )}

      {/* Điều hướng trang web */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" richColors />
    </>
  );
}

export default App;