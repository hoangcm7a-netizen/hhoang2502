import { useState, useRef, useEffect } from 'react';
import { Github, Instagram, Mail, Send, Copy, Check, Facebook, X, ShieldAlert, Subtitles, Youtube, Link as LinkIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '../supabase';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';
import { useKonamiCode } from '../hooks/useKonamiCode';

const TikTokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 group-hover:media-accent transition-colors"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
);

// HÀM CHUYỂN ĐỔI CHỮ THÀNH ICON (Render tự động)
const DynamicIcon = ({ name }: { name: string }) => {
    switch(name?.toLowerCase()) {
        case 'github': return <Github className="w-6 h-6 text-foreground group-hover:code-accent transition-colors" />;
        case 'facebook': return <Facebook className="w-6 h-6 text-foreground group-hover:media-accent transition-colors" />;
        case 'instagram': return <Instagram className="w-6 h-6 text-foreground group-hover:media-accent transition-colors" />;
        case 'youtube': return <Youtube className="w-6 h-6 text-foreground group-hover:media-accent transition-colors" />;
        case 'subtitles': return <Subtitles className="w-6 h-6 text-foreground group-hover:media-accent transition-colors" />;
        case 'tiktok': return <div className="text-foreground"><TikTokIcon /></div>;
        case 'mail': return <Mail className="w-6 h-6 text-foreground group-hover:media-accent transition-colors" />;
        default: return <LinkIcon className="w-6 h-6 text-foreground group-hover:media-accent transition-colors" />;
    }
};

const ContactSection = () => {
  const { language } = useLanguage();
  const formRef = useRef<HTMLFormElement>(null);
  const [copied, setCopied] = useState(false);
  
  // Dữ liệu mảng Danh sách Contact từ Supabase
  const [contacts, setContacts] = useState<any[]>([]);

  const [formData, setFormData] = useState({ user_name: '', user_email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaProblem, setCaptchaProblem] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');

  const isKonamiActive = useKonamiCode();

  useEffect(() => {
    if (isKonamiActive) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4af626', '#ff5f56', '#ffbd2e', '#27c93f', '#a855f7']
      });
      toast.success("🎮 Konami Code Kích Hoạt!", {
        description: "Bạn đã tìm ra bí mật ẩn của trang web này!",
      });
    }
  }, [isKonamiActive]);

  useEffect(() => {
    const fetchContact = async () => {
      const { data } = await supabase.from('social_links').select('*').order('created_at', { ascending: true });
      if (data) setContacts(data);
    };
    fetchContact();
  }, []);

  // Lọc ra một email đại diện để hiển thị ở mục copy
  const emailContact = contacts.find(c => c.platform.toLowerCase() === 'email');
  const displayEmail = emailContact ? emailContact.display_text : 'hoangcm7a@gmail.com';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(displayEmail);
    setCopied(true);
    toast.success("Đã sao chép Email!", { description: displayEmail });
    setTimeout(() => setCopied(false), 2000);
  };

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaProblem(result);
    setCaptchaInput('');
  };

  const processSending = async () => {
    setIsSubmitting(true);
    
    const { error } = await supabase.from('messages').insert([
      { user_name: formData.user_name, user_email: formData.user_email, message: formData.message }
    ]);

    if (!error) {
      toast.success("Gửi thành công!", { description: "Cảm ơn bạn, tin nhắn đã được ghi nhận." });
      setFormData({ user_name: '', user_email: '', message: '' });
      setSubmitCount(prev => prev + 1);
      setShowCaptcha(false);
    } else {
      console.error(error);
      toast.error("Lỗi hệ thống", { description: "Không thể lưu tin nhắn. Vui lòng thử lại sau." });
    }
    
    setIsSubmitting(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.user_name || !formData.user_email || !formData.message) {
        toast.error("Thiếu thông tin", { description: "Vui lòng điền đầy đủ." }); return;
    }
    if (submitCount === 0) processSending();
    else { generateCaptcha(); setShowCaptcha(true); }
  };

  const handleCaptchaSubmit = () => {
    if (captchaInput.toUpperCase() === captchaProblem) processSending();
    else {
      toast.error("Mã không hợp lệ", { description: "Mã xác nhận chưa chính xác." });
      generateCaptcha();
    }
  };

  return (
    <section id="contact" className="min-h-screen py-20 bg-terminal-bg relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-2 font-mono text-foreground">
              {language === 'vi' ? 'KẾT NỐI VỚI TÔI' : 'CONNECT WITH ME'}
            </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="mb-6"><h3 className="text-xl font-bold font-mono code-accent">{language === 'vi' ? 'Gửi tin nhắn' : 'Send a Message'}</h3></div>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
  {/* Ô Tên */}
  <div>
    <label htmlFor="user_name" className="text-sm font-mono text-muted-foreground mb-1 block">
      {language === 'vi' ? 'Tên / Name' : 'Name'}
    </label>
    <Input id="user_name" type="text" name="user_name" value={formData.user_name} onChange={handleInputChange} required className="bg-muted border-border font-mono text-foreground" />
  </div>

  {/* Ô Email */}
  <div>
    <label htmlFor="user_email" className="text-sm font-mono text-muted-foreground mb-1 block">
      Email
    </label>
    <Input id="user_email" type="email" name="user_email" value={formData.user_email} onChange={handleInputChange} required className="bg-muted border-border font-mono text-foreground" />
  </div>

  {/* Ô Tin nhắn */}
  <div>
    <label htmlFor="message" className="text-sm font-mono text-muted-foreground mb-1 block">
      {language === 'vi' ? 'Tin nhắn / Message' : 'Message'}
    </label>
    <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} required rows={6} className="bg-muted border-border font-mono resize-none text-foreground" />
  </div>

  <Button type="submit" className="w-full gap-2 font-mono bg-primary hover:bg-primary/90" disabled={isSubmitting}>
    {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send className="w-4 h-4" /> {language === 'vi' ? 'Gửi Tin Nhắn' : 'Send Message'}</>}
  </Button>
</form>
          </div>

          {/* Contact Info & Social Links */}
          <div className="space-y-8">
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="mb-4"><h3 className="text-xl font-bold font-mono code-accent">{language === 'vi' ? 'Liên hệ trực tiếp' : 'Direct Contact'}</h3></div>
              <div className="flex items-center gap-3 bg-muted p-4 rounded-lg">
                <Mail className="w-5 h-5 text-primary" />
                <code className="flex-1 font-mono text-sm text-foreground">{displayEmail}</code>
                <Button size="sm" variant="outline" onClick={handleCopyEmail} className="gap-2 font-mono border-gray-700 bg-[#1a1a1a] text-foreground">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-8">
              <div className="mb-4"><h3 className="text-xl font-bold font-mono media-accent">{language === 'vi' ? 'Mạng xã hội' : 'Social Media'}</h3><p className="text-sm text-muted-foreground italic">{language === 'vi' ? 'Các giao thức xã hội' : 'Social Protocols'}</p></div>
              <div className="space-y-3">
                {/* RENDER DYNAMIC MẢNG SOCIAL LINKS */}
                {contacts.filter(c => c.platform.toLowerCase() !== 'email').map(contact => (
                    <a key={contact.id} href={contact.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors group">
                        <DynamicIcon name={contact.icon_name} />
                        <div className="flex-1">
                            <p className="font-mono font-bold text-foreground">{contact.platform}</p>
                            <p className="text-sm text-muted-foreground font-mono">{contact.display_text}</p>
                        </div>
                    </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Captcha Popup Giữ Nguyên */}
      {showCaptcha && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-card border border-border p-6 rounded-lg shadow-2xl max-w-md w-full mx-4 relative animate-in fade-in zoom-in duration-300">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 hover:text-destructive" onClick={() => setShowCaptcha(false)}><X className="w-5 h-5 text-foreground" /></Button>
            <div className="text-center space-y-2">
              <div className="flex justify-center text-yellow-500 mb-2"><ShieldAlert className="w-12 h-12" /></div>
              <h3 className="text-2xl font-bold font-mono text-foreground">Xác nhận Anti-Spam</h3>
              <p className="text-muted-foreground text-sm pt-2">Hệ thống phát hiện có nhiều yêu cầu gửi. Hãy xác nhận mã CAPTCHA để tiếp tục.</p>
              <div className="bg-muted p-4 rounded-md my-4"><p className="text-3xl tracking-[0.5em] font-mono font-bold text-primary">{captchaProblem}</p></div>
              <Input type="text" placeholder="Nhập mã 4 ký tự" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())} maxLength={4} className="text-center uppercase font-mono text-lg text-foreground bg-muted border-border" autoFocus onKeyDown={(e) => e.key === 'Enter' && handleCaptchaSubmit()} />
              <Button className="w-full bg-primary hover:bg-primary/90 font-mono mt-4 text-foreground" onClick={handleCaptchaSubmit}>Xác thực & Gửi</Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ContactSection;