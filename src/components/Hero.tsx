import { useState, useEffect, Suspense } from 'react';
import { supabase } from '../supabase';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import Spline from '@splinetool/react-spline';

const Hero = () => {
  const { language } = useLanguage();
  const [lines, setLines] = useState<string[]>([]);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [typingSpeed, setTypingSpeed] = useState(40);
  const [lineSpacing, setLineSpacing] = useState(2.0);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

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
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background">
      {/* Background with subtle dots */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(hsl(var(--primary) / 0.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      {/* Spline 3D Model in Background */}
      <motion.div style={{ y: y1 }} className="absolute inset-0 z-0 opacity-50 flex items-center justify-center pointer-events-none">
         <Suspense fallback={null}>
            <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
         </Suspense>
      </motion.div>

      <motion.div 
        style={{ y: y2 }}
        className="w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl bg-card border border-border z-10 mx-4 relative backdrop-blur-sm bg-opacity-80"
      >
        <div className="bg-muted px-4 py-3 flex items-center relative">
          <div className="flex gap-2 absolute left-4">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <div className="flex-1 text-center text-xs md:text-sm text-muted-foreground font-mono">
            {language === 'vi' ? 'lời chào (greetings)' : 'greetings (lời chào)'}
          </div>
        </div>
        <div className="p-6 md:p-10 font-mono text-primary text-lg md:text-xl min-h-[300px] glow-code">
          {displayedLines.map((line, index) => (
            <div key={index} style={{ lineHeight: lineSpacing, minHeight: '1.5em' }}>
              {line}
              {index === currentLineIndex && <span className={`inline-block w-2.5 h-5 ml-1 bg-primary align-middle ${showCursor ? 'opacity-100' : 'opacity-0'}`} />}
            </div>
          ))}
          {currentLineIndex >= lines.length && lines.length > 0 && (
            <div style={{ lineHeight: lineSpacing, minHeight: '1.5em' }}>
               <span className={`inline-block w-2.5 h-5 ml-1 bg-primary align-middle ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
            </div>
          )}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 flex flex-col items-center animate-bounce text-muted-foreground z-10"
      >
        <span className="mb-2 font-mono text-sm">{language === 'vi' ? 'cuộn xuống' : 'scroll down'}</span>
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </section>
  );
};

export default Hero;