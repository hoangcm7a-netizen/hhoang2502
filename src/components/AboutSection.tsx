import { useState, useEffect } from 'react';
import { User, Code, Film, Globe, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';

const AboutSection = () => {
  const [data, setData] = useState<any>(null);
  const [techs, setTechs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const { data: aboutData } = await supabase.from('about_me').select('*').eq('id', 1).single();
        if (aboutData) setData(aboutData);
      } catch (error) {
        console.error('Lỗi lấy dữ liệu About:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAbout();
  }, []);

useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông tin About
        const { data: aboutData } = await supabase.from('about_me').select('*').eq('id', 1).single();
        if (aboutData) setData(aboutData);

        // Lấy danh sách Tech Stack
        const { data: techData } = await supabase.from('tech_stack').select('*');
        if (techData) setTechs(techData);
        
      } catch (error) {
        console.error('Lỗi lấy dữ liệu:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <section className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-accent" /></section>;

  return (
    <section id="about" className="min-h-screen py-20 bg-background">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12 font-mono text-accent">
          {'ABOUT ME - THÔNG TIN VỀ TÔI'}
        </h2>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-8 font-mono space-y-6">
            
            {/* Header được load từ DB */}
            <div className="border-b border-border pb-6">
              <h1 className="text-3xl font-bold mb-2 text-foreground">
                {data?.title}
              </h1>
              <div className="space-y-1">
                <p className="text-muted-foreground">
                  {data?.description_vi}
                </p>
                <p className="text-muted-foreground italic opacity-80">
                  {data?.description_en}
                </p>
              </div>
            </div>

            {/* What I Do */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold code-accent">{'💡 What I Do:'}</h3>
              <div className="space-y-6 ml-4">
                <div className="flex items-start gap-3 group">
                  <Code className="w-5 h-5 mt-1 code-accent group-hover:glow-code transition-all" />
                  <div className="flex-1">
                    <p className="font-bold text-foreground">Code:</p>
                    <p className="text-muted-foreground">Lập trình web và phát triển ứng dụng với các công nghệ hiện đại.</p>
                    <div className="border-t border-border/30 w-full my-1"></div>
                    <p className="text-muted-foreground italic opacity-80">Developing web and desktop applications with modern technologies.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 group">
                  <Film className="w-5 h-5 mt-1 media-accent group-hover:glow-media transition-all" />
                  <div className="flex-1">
                    <p className="font-bold text-foreground">Edit:</p>
                    <p className="text-muted-foreground">Dựng video hài hước về Thể thao và Trò chơi hoặc video cảm xúc, giật giật cho phim ảnh.</p>
                    <div className="border-t border-border/30 w-full my-1"></div>
                    <p className="text-muted-foreground italic opacity-80">Creating funny memes for Sports/Gaming & high-energy, beat-synced movie edits.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 group">
                  <Globe className="w-5 h-5 mt-1 text-accent group-hover:scale-110 transition-transform" />
                  <div className="flex-1">
                    <p className="font-bold text-foreground">Translate:</p>
                    <p className="text-muted-foreground">Dịch phim nước ngoài từ âm thanh và phụ đề sang phụ đề tiếng Việt.</p>
                    <div className="border-t border-border/30 w-full my-1"></div>
                    <p className="text-muted-foreground italic opacity-80">Transcribing & Subtitling foreign movie audio directly into Vietnamese.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-border" />

            {/* Tech Stack - Render Động */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold code-accent">{'🛠️ Tech Stack & Tools:'}</h3>
        <div className="space-y-3 ml-4">
            <div>
                <p className="font-bold mb-2 text-foreground">* Dev:</p>
                <div className="flex flex-wrap gap-2 ml-4">
                {techs.filter(t => t.category === 'Frontend' || t.category === 'Languages' || t.category === 'Dev').map((tech) => (
                    <span key={tech.id} className="px-3 py-1 bg-muted rounded text-sm code-accent border border-primary/20">{tech.name}</span>
                ))}
                </div>
            </div>
            <div>
                <p className="font-bold mb-2 text-foreground">* Tools & Media:</p>
                <div className="flex flex-wrap gap-2 ml-4">
                {techs.filter(t => t.category === 'Tools' || t.category === 'Media').map((tool) => (
                    <span key={tool.id} className="px-3 py-1 bg-muted rounded text-sm media-accent border border-secondary/20">{tool.name}</span>
                ))}
                </div>
            </div>
        </div>
      </div>

            {/* Ảnh đại diện & Thông tin load từ DB */}
            <div className="pt-6 border-t border-border">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden border-2 border-border">
                  {data?.profile_image_url ? (
                     <img src={data.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                     <User className="w-12 h-12 text-background" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-lg text-foreground">Hhoang2502</p>
                  <p className="text-muted-foreground">{data?.role_title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{data?.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;