import { User, Code, Film, Globe } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="min-h-screen py-20 bg-background">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12 font-mono text-accent">
          {'ABOUT ME - THÔNG TIN VỀ TÔI'}
        </h2>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-8 font-mono space-y-6">
            {/* Header */}
            <div className="border-b border-border pb-6">
              <h1 className="text-3xl font-bold mb-2">
                {'👋 Hello, I\'m Hhoang2502'}
              </h1>
              <div className="space-y-1">
                <p className="text-muted-foreground">
                  {'Một sinh viên CNTT năm 3 (20 tuổi) với niềm đam mê sáng tạo nội dung.'}
                </p>
                <p className="text-muted-foreground italic opacity-80">
                  {'A 3rd-year IT student (20 years old) with a passion for creative content.'}
                </p>
              </div>
            </div>

            {/* What I Do */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold code-accent">{'💡 What I Do:'}</h3>
              
              <div className="space-y-6 ml-4"> {/* Tăng khoảng cách giữa các mục */}
                
                {/* CODE */}
                <div className="flex items-start gap-3 group">
                  <Code className="w-5 h-5 mt-1 code-accent group-hover:glow-code transition-all" />
                  <div className="flex-1">
                    <p className="font-bold">Code:</p>
                    <p className="text-muted-foreground">
                      Lập trình web và phát triển ứng dụng với các công nghệ hiện đại.
                    </p>
                    <div className="border-t border-border/30 w-full my-1"></div>
                    <p className="text-muted-foreground italic opacity-80">
                      Developing web and desktop applications with modern technologies.
                    </p>
                  </div>
                </div>

                {/* EDIT */}
                <div className="flex items-start gap-3 group">
                  <Film className="w-5 h-5 mt-1 media-accent group-hover:glow-media transition-all" />
                  <div className="flex-1">
                    <p className="font-bold">Edit:</p>
                    <p className="text-muted-foreground">
                      Dựng video hài hước về Thể thao và Trò chơi hoặc video cảm xúc, giật giật cho phim ảnh.
                    </p>
                    <div className="border-t border-border/30 w-full my-1"></div>
                    <p className="text-muted-foreground italic opacity-80">
                      Creating funny memes for Sports/Gaming & high-energy, beat-synced movie edits.
                    </p>
                  </div>
                </div>

                {/* TRANSLATE */}
                <div className="flex items-start gap-3 group">
                  <Globe className="w-5 h-5 mt-1 text-accent group-hover:scale-110 transition-transform" />
                  <div className="flex-1">
                    <p className="font-bold">Translate:</p>
                    <p className="text-muted-foreground">
                      Dịch phim nước ngoài từ âm thanh và phụ đề sang phụ đề tiếng Việt.
                    </p>
                    <div className="border-t border-border/30 w-full my-1"></div>
                    <p className="text-muted-foreground italic opacity-80">
                      Transcribing & Subtitling foreign movie audio directly into Vietnamese.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Divider */}
            <div className="border-b border-border" />

            {/* Tech Stack */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold code-accent">{'🛠️ Tech Stack & Tools:'}</h3>
              
              <div className="space-y-3 ml-4">
                <div>
                  <p className="font-bold mb-2">* Dev:</p>
                  <div className="flex flex-wrap gap-2 ml-4">
                    {/* Bạn có thể sửa lại list này cho khớp với skills bên DevSection nếu muốn */}
                    {['C++', 'C#', 'Java', 'JavaScript', 'TypeScript', 'Python', 'React', 'Node.js'].map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-muted rounded text-sm code-accent border border-primary/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-bold mb-2">* Media:</p>
                  <div className="flex flex-wrap gap-2 ml-4">
                    {['CapCut', 'Adobe Premiere', 'After Effects', 'Adobe Photoshop'].map((tool) => (
                      <span
                        key={tool}
                        className="px-3 py-1 bg-muted rounded text-sm media-accent border border-secondary/20"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Image Placeholder */}
            <div className="pt-6 border-t border-border">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden border-2 border-border">
                  {/* Nếu bạn có ảnh thật, thay User icon bằng thẻ <img src="..." /> */}
                  <User className="w-12 h-12 text-background" />
                </div>
                <div>
                  <p className="font-bold text-lg">Hhoang2502</p>
                  <p className="text-muted-foreground">Developer • Content Creator • Movie Translator</p>
                  <p className="text-sm text-muted-foreground mt-1">Thanh Hóa, Vietnam</p>
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