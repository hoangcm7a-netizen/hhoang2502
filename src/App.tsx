import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import DevSection from './components/DevSection';
import MediaSection from './components/MediaSection';
import ContactSection from './components/ContactSection';
import Admin from './components/Admin'; // Import trang Admin vừa tạo

// Tạo một Component chứa toàn bộ trang Portfolio của bạn
const Portfolio = () => (
  <main className="bg-background text-foreground min-h-screen font-sans selection:bg-primary/30">
    <Navigation />
    <Hero />
    <DevSection />
    <MediaSection />
    <AboutSection />
    <ContactSection />
  </main>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Đường dẫn mặc định: Hiển thị trang Portfolio */}
        <Route path="/" element={<Portfolio />} />
        
        {/* Đường dẫn /admin: Hiển thị trang đăng nhập */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;