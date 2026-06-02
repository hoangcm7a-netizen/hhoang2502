import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#252525] text-cyan-400 border border-gray-800 px-4 py-2.5 rounded-full font-mono text-xs shadow-2xl transition-all hover:scale-105 active:scale-95"
    >
      <Globe className="w-4 h-4 animate-spin-slow" />
      <span>{language === 'vi' ? 'VIỆT NAM (VI)' : 'ENGLISH (EN)'}</span>
    </button>
  );
};

export default LanguageToggle;