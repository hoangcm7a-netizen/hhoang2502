import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentLine, setCurrentLine] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Mảng các dòng chữ muốn hiển thị
  const lines = [
    "> Xin Chào, Mình là Hhoang2502",
    "> Hello! I am Hhoang2502",
    "",
    "> Đây là toàn bộ thông tin về mình",
    "> Here is everything about me",
    "",
    "> Mình rất vui khi được mọi người đọc!",
    "> Thanks for stopping by!"
  ];

  useEffect(() => {
    // Nếu đã chạy hết các dòng thì dừng lại
    if (currentLine >= lines.length) return;

    const currentText = lines[currentLine];
    let charIndex = 0;

    const typingInterval = setInterval(() => {
      // === BẮT ĐẦU SỬA LỖI ===
      // Kiểm tra kỹ: chỉ chạy khi index nhỏ hơn độ dài chuỗi
      if (charIndex < currentText.length) {
        const charToAdd = currentText[charIndex];
        
        // Kiểm tra an toàn: Chỉ thêm nếu ký tự đó KHÔNG phải là undefined
        if (charToAdd !== undefined) {
          setDisplayText(prev => prev + charToAdd);
          charIndex++;
        }
      // === KẾT THÚC SỬA LỖI ===
      } else {
        // Khi viết xong một dòng
        clearInterval(typingInterval);
        setTimeout(() => {
          setDisplayText(prev => prev + '\n'); // Xuống dòng
          setCurrentLine(prev => prev + 1);    // Chuyển sang dòng tiếp theo
        }, 500); // Đợi 0.5s trước khi qua dòng mới
      }
    }, 20); // Tốc độ gõ 20ms

    return () => clearInterval(typingInterval);
  }, [currentLine]);

  // Hiệu ứng con trỏ nhấp nháy
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  const scrollToNext = () => {
    const devSection = document.getElementById('dev');
    if (devSection) {
      devSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(190,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(190,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Terminal window */}
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-2xl">
            {/* Terminal header */}
            <div className="bg-muted px-4 py-3 flex items-center gap-2 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <div className="w-3 h-3 rounded-full bg-accent" />
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="ml-4 text-sm text-muted-foreground font-mono">greetings (lời chào)</span>
            </div>
            
            {/* Terminal content */}
            <div className="p-8 min-h-[400px] font-mono text-lg">
              <pre className="terminal-text whitespace-pre-wrap">
                {displayText}
                {showCursor && <span className="inline-block w-3 h-6 bg-terminal-text ml-1 animate-blink" />}
              </pre>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="flex justify-center mt-16 animate-fade-in">
            <button
              onClick={scrollToNext}
              className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
            >
              <span className="text-sm font-mono">scroll down</span>
              <ChevronDown className="w-6 h-6 animate-bounce group-hover:code-accent" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;