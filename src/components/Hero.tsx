import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  const [lines, setLines] = useState<string[]>([]);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  
  // Thông số mặc định nếu DB chưa tải kịp
  const [typingSpeed, setTypingSpeed] = useState(40);
  const [lineSpacing, setLineSpacing] = useState(2.0);

  // 1. Lấy dữ liệu từ Supabase
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

  // 2. Logic Hiệu ứng gõ chữ (Đã sửa mượt mà cho từng dòng)
  useEffect(() => {
    if (lines.length === 0 || currentLineIndex >= lines.length) return;

    const currentText = lines[currentLineIndex];

    const timer = setTimeout(() => {
      setDisplayedLines(prev => {
        const newLines = [...prev];
        // Khởi tạo dòng mới nếu chưa có
        if (newLines[currentLineIndex] === undefined) {
            newLines[currentLineIndex] = '';
        }
        // Thêm từng ký tự vào dòng hiện tại
        newLines[currentLineIndex] = currentText.substring(0, currentCharIndex + 1);
        return newLines;
      });

      // Kiểm tra xem đã gõ hết dòng chưa
      if (currentCharIndex < currentText.length) {
        setCurrentCharIndex(prev => prev + 1);
      } else {
        // Đã gõ xong 1 dòng -> Đợi một chút rồi chuyển sang dòng tiếp theo
        setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }, 300); // Khoảng nghỉ giữa các dòng
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [lines, currentLineIndex, currentCharIndex, typingSpeed]);

  // 3. Hiệu ứng con trỏ nhấp nháy
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <section 
        id="hero" 
        className="min-h-screen flex flex-col items-center justify-center relative bg-[#111111]"
        // Nền lưới chấm bi giống trong ảnh 2
        style={{ backgroundImage: 'radial-gradient(#ffffff15 1px, transparent 1px)', backgroundSize: '24px 24px' }}
    >
      
      {/* Khung Terminal Windows */}
      <div className="w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl bg-[#1e1e1e] border border-gray-800 z-10 mx-4">
        
        {/* Thanh công cụ (Header) */}
        <div className="bg-[#2d2d2d] px-4 py-3 flex items-center relative">
          <div className="flex gap-2 absolute left-4">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <div className="flex-1 text-center text-xs md:text-sm text-gray-400 font-mono">
            greetings (lời chào)
          </div>
        </div>
        
        {/* Phần thân chứa chữ (Body) */}
        <div className="p-6 md:p-10 font-mono text-[#4af626] text-lg md:text-xl min-h-[300px]">
          {displayedLines.map((line, index) => (
            <div key={index} style={{ lineHeight: lineSpacing, minHeight: '1.5em' }}>
              {line}
              {/* Con trỏ hiển thị ở cuối dòng đang gõ */}
              {index === currentLineIndex && (
                <span className={`inline-block w-2.5 h-5 ml-1 bg-[#4af626] align-middle ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
              )}
            </div>
          ))}
          {/* Giữ con trỏ nhấp nháy ở cuối cùng khi đã gõ xong tất cả */}
          {currentLineIndex >= lines.length && lines.length > 0 && (
            <div style={{ lineHeight: lineSpacing, minHeight: '1.5em' }}>
               <span className={`inline-block w-2.5 h-5 ml-1 bg-[#4af626] align-middle ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
            </div>
          )}
        </div>
      </div>

      {/* Biểu tượng cuộn xuống (Scroll Down) */}
      <div className="absolute bottom-10 flex flex-col items-center animate-bounce text-gray-500 z-10">
        <span className="mb-2 font-mono text-sm">scroll down</span>
        <ChevronDown className="w-5 h-5" />
      </div>
      
    </section>
  );
};

export default Hero;