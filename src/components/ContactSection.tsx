import { useState, useRef, useEffect } from 'react';
import { Github, Instagram, Mail, Send, Copy, Check, Facebook, X, ShieldAlert, Subtitles, Youtube, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import emailjs from '@emailjs/browser';
import { supabase } from '../supabase';
import { useLanguage } from '../context/LanguageContext';

// --- CẤU HÌNH EMAILJS ---
const SERVICE_ID = 'YOUR_SERVICE_ID';
const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

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
  const { toast } = useToast();
  
  // Dữ liệu mảng Danh sách Contact từ Supabase
  const [contacts, setContacts] = useState<any[]>([]);

  const [formData, setFormData] = useState({ user_name: '', user_email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaProblem, setCaptchaProblem] = useState({ a: 0, b: 0 });
  const [captchaInput, setCaptchaInput] = useState('');

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
    toast({ title: "Đã sao chép Email!", description: displayEmail });
    setTimeout(() => setCopied(false), 2000);
  };

  const generateCaptcha = () => {
    setCaptchaProblem({ a: Math.floor(Math.random() * 10) + 1, b: Math.floor(Math.random() * 10) + 1 });
    setCaptchaInput('');
  };

  const processSending = () => {
    setIsSubmitting(true);
    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current!, PUBLIC_KEY)
      .then(
        () => {
          toast({ title: "Gửi thành công!", description: "Cảm ơn bạn, mình sẽ phản hồi sớm." });
          setFormData({ user_name: '', user_email: '', message: '' });
          setSubmitCount(prev => prev + 1);
          setShowCaptcha(false);
        },
        (error) => {
          console.error(error);
          toast({ variant: "destructive", title: "Lỗi", description: "Gửi thất bại. Vui lòng thử lại." });
        }
      ).finally(() => setIsSubmitting(false));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.user_name || !formData.user_email || !formData.message) {
        toast({ variant: "destructive", title: "Thiếu thông tin", description: "Vui lòng điền đầy đủ." }); return;
    }
    if (submitCount === 0) processSending();
    else { generateCaptcha(); setShowCaptcha(true); }
  };

  const handleCaptchaSubmit = () => {
    if (parseInt(captchaInput) === captchaProblem.a + captchaProblem.b) processSending();
    else {
      toast({ variant: "destructive", title: "Sai kết quả", description: "Vui lòng tính lại." });
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
              <div><label className="text-sm font-mono text-muted-foreground mb-1 block">Tên / Name</label><Input type="text" name="user_name" value={formData.user_name} onChange={handleInputChange} required className="bg-muted border-border font-mono text-foreground" /></div>
              <div><label className="text-sm font-mono text-muted-foreground mb-1 block">Email</label><Input type="email" name="user_email" value={formData.user_email} onChange={handleInputChange} required className="bg-muted border-border font-mono text-foreground" /></div>
              <div><label className="text-sm font-mono text-muted-foreground mb-1 block">Tin nhắn / Message</label><Textarea name="message" value={formData.message} onChange={handleInputChange} required rows={6} className="bg-muted border-border font-mono resize-none text-foreground" /></div>
              <Button type="submit" className="w-full gap-2 font-mono bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                {isSubmitting ? <>Đang gửi...</> : <><Send className="w-4 h-4" /> {language === 'vi' ? 'Gửi tin nhắn' : 'Send a Message'}</>}
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
              <h3 className="text-2xl font-bold font-mono text-foreground">Kiểm tra bảo mật</h3>
              <p className="text-muted-foreground text-sm pt-2">Để tránh spam, vui lòng xác nhận bạn không phải là robot.</p>
              <div className="bg-muted p-4 rounded-md my-4"><p className="text-lg font-mono font-bold text-foreground">{captchaProblem.a} + {captchaProblem.b} = ?</p></div>
              <Input type="number" placeholder="Nhập kết quả" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} className="text-center font-mono text-lg text-foreground bg-muted border-border" autoFocus onKeyDown={(e) => e.key === 'Enter' && handleCaptchaSubmit()} />
              <Button className="w-full bg-primary hover:bg-primary/90 font-mono mt-4 text-foreground" onClick={handleCaptchaSubmit}>Xác thực & Gửi</Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ContactSection;