import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language } = useLanguage(); // Gọi ngôn ngữ

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Đổi menu theo ngôn ngữ
  const navLinks = language === 'vi' ? [
    { name: '|  DỰ ÁN', href: '#dev' },
    { name: '|  MEDIA', href: '#media' },
    { name: '|  CÁ NHÂN', href: '#about' },
    { name: '|  LIÊN HỆ', href: '#contact' },
  ] : [
    { name: '|  DEV', href: '#dev' },
    { name: '|  MEDIA', href: '#media' },
    { name: '|  ABOUT ME', href: '#about' },
    { name: '|  CONTACT', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-border' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="text-xl font-bold font-mono code-accent hover:opacity-80 transition-opacity">
          HHoang2502 {language === 'vi' ? 'Hồ Sơ' : 'Portfolio'}
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors">
              {link.name}
            </a>
          ))}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors">
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;