import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import DevSection from '@/components/DevSection';
import MediaSection from '@/components/MediaSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <DevSection />
      <MediaSection />
      <AboutSection />
      <ContactSection />
      
      {/* Footer */}
      <footer className="bg-background border-t border-border py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground font-mono text-sm">
            {'© 2025 Hhoang2502. Built with React + TypeScript + Tailwind CSS'}
          </p>
          <p className="text-muted-foreground font-mono text-xs mt-2">
            {'Trang web cá nhân hhoang2502'}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
