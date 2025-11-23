import { useState, useRef } from 'react';
import { Github, Instagram, Mail, Send, Copy, Check, Facebook, X, ShieldAlert, Subtitles, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import emailjs from '@emailjs/browser';

// --- CẤU HÌNH EMAILJS ---
const SERVICE_ID = 'YOUR_SERVICE_ID';
const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

// Icon TikTok
const TikTokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 group-hover:media-accent transition-colors">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const ContactSection = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const email = 'hoangcm7a@gmail.com';

  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaProblem, setCaptchaProblem] = useState({ a: 0, b: 0 });
  const [captchaInput, setCaptchaInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    toast({
      title: "Đã sao chép Email / Email copied!",
      description: "hoangcm7a@gmail.com",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCaptchaProblem({ a, b });
    setCaptchaInput('');
  };

  const processSending = () => {
    setIsSubmitting(true);
    // Gửi email qua EmailJS
    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current!, PUBLIC_KEY)
      .then(
        () => {
          toast({
            title: "Gửi thành công! / Message sent!",
            description: "Cảm ơn bạn, mình sẽ phản hồi sớm. / Thank you, I'll get back to you soon.",
          });
          setFormData({ user_name: '', user_email: '', message: '' });
          setSubmitCount(prev => prev + 1);
          setShowCaptcha(false);
        },
        (error) => {
          console.error(error);
          toast({ variant: "destructive", title: "Lỗi / Error", description: "Gửi thất bại. Vui lòng thử lại. / Failed to send." });
        }
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.user_name || !formData.user_email || !formData.message) {
        toast({ variant: "destructive", title: "Thiếu thông tin / Missing info", description: "Vui lòng điền đầy đủ. / Please fill all fields." });
        return;
    }

    if (submitCount === 0) {
      processSending();
    } else {
      generateCaptcha();
      setShowCaptcha(true);
    }
  };

  const handleCaptchaSubmit = () => {
    if (parseInt(captchaInput) === captchaProblem.a + captchaProblem.b) {
      processSending();
    } else {
      toast({
        variant: "destructive",
        title: "Sai kết quả / Incorrect Answer",
        description: "Vui lòng tính lại. / Please try again.",
      });
      generateCaptcha();
    }
  };

  return (
    <section id="contact" className="min-h-screen py-20 bg-terminal-bg relative">
      <div className="container mx-auto px-6">
        {/* Song ngữ tiêu đề */}
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-2 font-mono">
            {'KẾT NỐI VỚI TÔI'}
            </h2>
            <h3 className="text-xl font-mono text-muted-foreground opacity-80">
            {'CONNECT WITH ME'}
            </h3>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="mb-6">
                <h3 className="text-xl font-bold font-mono code-accent">Gửi tin nhắn</h3>
                <p className="text-sm text-muted-foreground italic">Send a Message</p>
            </div>
            
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-mono text-muted-foreground mb-1 block">
                  {'Tên / Name'}
                </label>
                <Input
                  type="text"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên của bạn / Enter your name"
                  required
                  className="bg-muted border-border font-mono"
                />
              </div>

              <div>
                <label className="text-sm font-mono text-muted-foreground mb-1 block">
                  {'Email'}
                </label>
                <Input
                  type="email"
                  name="user_email"
                  value={formData.user_email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                  required
                  className="bg-muted border-border font-mono"
                />
              </div>

              <div>
                <label className="text-sm font-mono text-muted-foreground mb-1 block">
                  {'Tin nhắn / Message'}
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Nội dung tin nhắn... / Your message here..."
                  required
                  rows={6}
                  className="bg-muted border-border font-mono resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full gap-2 font-mono bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                    <>Đang gửi... / Sending...</>
                ) : (
                    <>
                        <Send className="w-4 h-4" /> Gửi Tin Nhắn / Send Message
                    </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info & Social Links */}
          <div className="space-y-8">
            {/* Email */}
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="mb-4">
                  <h3 className="text-xl font-bold font-mono code-accent">Liên hệ trực tiếp</h3>
                  <p className="text-sm text-muted-foreground italic">Direct Contact</p>
              </div>
              
              <div className="flex items-center gap-3 bg-muted p-4 rounded-lg">
                <Mail className="w-5 h-5 text-primary" />
                <code className="flex-1 font-mono text-sm">{email}</code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyEmail}
                  className="gap-2 font-mono"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="mb-4">
                  <h3 className="text-xl font-bold font-mono media-accent">Mạng xã hội</h3>
                  <p className="text-sm text-muted-foreground italic">Social Protocols</p>
              </div>
              
              <div className="space-y-3">
                <a href="https://github.com/hoangcm7a-netizen" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors group">
                  <Github className="w-6 h-6 group-hover:code-accent transition-colors" />
                  <div className="flex-1">
                    <p className="font-mono font-bold">GitHub</p>
                    <p className="text-sm text-muted-foreground font-mono">hoangcm7a</p>
                  </div>
                </a>

                <a href="https://www.tiktok.com/@hoanghuy_2005" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors group">
                  <TikTokIcon />
                  <div className="flex-1">
                    <p className="font-mono font-bold">TikTok</p>
                    <p className="text-sm text-muted-foreground font-mono">hoanghuy_2005</p>
                  </div>
                </a>

                <a href="https://www.instagram.com/hhoang2502/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors group">
                  <Instagram className="w-6 h-6 group-hover:media-accent transition-colors" />
                  <div className="flex-1">
                    <p className="font-mono font-bold">Instagram</p>
                    <p className="text-sm text-muted-foreground font-mono">hhoang2502</p>
                  </div>
                </a>
                
                <a href="https://www.facebook.com/hhoang2502" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors group">
                  <Facebook className="w-6 h-6 group-hover:media-accent transition-colors" />
                  <div className="flex-1">
                    <p className="font-mono font-bold">Facebook</p>
                    <p className="text-sm text-muted-foreground font-mono">Huy Hoàng</p>
                  </div>
                </a>

                <a href="https://sub-scene.com/u/42150" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors group">
                  <Subtitles className="w-6 h-6 group-hover:media-accent transition-colors" />
                  <div className="flex-1">
                    <p className="font-mono font-bold">Subscene</p>
                    <p className="text-sm text-muted-foreground font-mono">Hoangks2052</p>
                  </div>
                </a>
                <a href="https://www.youtube.com/@HHoang2502" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors group">
                  <Youtube className="w-6 h-6 group-hover:media-accent transition-colors" />
                  <div className="flex-1">
                    <p className="font-mono font-bold">Youtube</p>
                    <p className="text-sm text-muted-foreground font-mono">Ở đây có Phim</p>
                  </div>
                </a>
                <a href="https://www.youtube.com/@nguyenlinh-bd8uo" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors group">
                  <Youtube className="w-6 h-6 group-hover:media-accent transition-colors" />
                  <div className="flex-1">
                    <p className="font-mono font-bold">Youtube</p>
                    <p className="text-sm text-muted-foreground font-mono">Nguyễn Linh</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      {showCaptcha && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-card border border-border p-6 rounded-lg shadow-2xl max-w-md w-full mx-4 relative animate-in fade-in zoom-in duration-300">
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 hover:text-destructive"
              onClick={() => setShowCaptcha(false)}
            >
              <X className="w-5 h-5" />
            </Button>

            <div className="text-center space-y-2">
              <div className="flex justify-center text-yellow-500 mb-2">
                <ShieldAlert className="w-12 h-12" />
              </div>
              
              <h3 className="text-2xl font-bold font-mono">Kiểm tra bảo mật</h3>
              <h4 className="text-lg text-muted-foreground font-mono">Security Check</h4>
              
              <p className="text-muted-foreground text-sm pt-2">
                Để tránh spam, vui lòng xác nhận bạn không phải là robot.
              </p>
              <p className="text-muted-foreground text-sm italic opacity-80">
                Please confirm you are human to prevent spam.
              </p>

              <div className="bg-muted p-4 rounded-md my-4">
                <p className="text-lg font-mono font-bold">
                  {captchaProblem.a} + {captchaProblem.b} = ?
                </p>
              </div>

              <Input
                type="number"
                placeholder="Nhập kết quả / Enter result"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="text-center font-mono text-lg"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCaptchaSubmit()}
              />

              <Button 
                className="w-full bg-primary hover:bg-primary/90 font-mono mt-4"
                onClick={handleCaptchaSubmit}
              >
                Xác thực & Gửi / Verify & Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ContactSection;