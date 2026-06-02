import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
  const { language } = useLanguage();
  const [lines, setLines] = useState<string[]>([]);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [typingSpeed, setTypingSpeed] = useState(40);
  const [lineSpacing, setLineSpacing] = useState(2.0);

  useEffect(() => {
    const fetchHero = async () => {
      const { data } = await supabase.from('hero_settings').select('*').eq('id', 1).single();
      if (data && data.greetings) {
        setLines(data.greetings);
        if (data.typing_speed) setTypingSpeed(data.typing_speed);
        if (data.line_spacing) setLineSpacing(data.line_spacing);
      }
    };
    fetchHero();
  }, []);

  useEffect(() => {
    if (lines.length === 0 || currentLineIndex >= lines.length) return;
    const currentText = lines[currentLineIndex];
    const timer = setTimeout(() => {
      setDisplayedLines(prev => {
        const newLines = [...prev];
        if (newLines[currentLineIndex] === undefined) newLines[currentLineIndex] = '';
        newLines[currentLineIndex] = currentText.substring(0, currentCharIndex + 1);
        return newLines;
      });
      if (currentCharIndex < currentText.length) {
        setCurrentCharIndex(prev => prev + 1);
      } else {
        setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }, 300);
      }
    }, typingSpeed);
    return () => clearTimeout(timer);
  }, [lines, currentLineIndex, currentCharIndex, typingSpeed]);

  useEffect(() => {
    const cursorInterval = setInterval(() => setShowCursor(prev => !prev), 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center relative bg-[#111111]" style={{ backgroundImage: 'radial-gradient(#ffffff15 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      <div className="w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl bg-[#1e1e1e] border border-gray-800 z-10 mx-4">
        <div className="bg-[#2d2d2d] px-4 py-3 flex items-center relative">
          <div className="flex gap-2 absolute left-4">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <div className="flex-1 text-center text-xs md:text-sm text-gray-400 font-mono">
            {language === 'vi' ? 'lời chào (greetings)' : 'greetings (lời chào)'}
          </div>
        </div>
        <div className="p-6 md:p-10 font-mono text-[#4af626] text-lg md:text-xl min-h-[300px]">
          {displayedLines.map((line, index) => (
            <div key={index} style={{ lineHeight: lineSpacing, minHeight: '1.5em' }}>
              {line}
              {index === currentLineIndex && <span className={`inline-block w-2.5 h-5 ml-1 bg-[#4af626] align-middle ${showCursor ? 'opacity-100' : 'opacity-0'}`} />}
            </div>
          ))}
          {currentLineIndex >= lines.length && lines.length > 0 && (
            <div style={{ lineHeight: lineSpacing, minHeight: '1.5em' }}>
               <span className={`inline-block w-2.5 h-5 ml-1 bg-[#4af626] align-middle ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-10 flex flex-col items-center animate-bounce text-gray-500 z-10">
        <span className="mb-2 font-mono text-sm">{language === 'vi' ? 'cuộn xuống' : 'scroll down'}</span>
        <ChevronDown className="w-5 h-5" />
      </div>
    </section>
  );
};

export default Hero;