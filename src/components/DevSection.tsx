import { useState } from 'react';
import { Code2, Folder, FileCode, Github, ExternalLink, Globe, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Project {
  id: string;
  name: string;
  // Thay đổi: Tách description thành 2 ngôn ngữ
  descriptionVi: string; 
  descriptionEn: string;
  technologies: string[];
  github?: string;
  demo?: string;
  demoLabel?: string;
}

const projects: Project[] = [
  {
    id: 'project1',
    name: 'Quản lý phòng Gym',
    descriptionVi: 'Trang Web quản lý phòng Gym, tích hợp nhận diện khuôn mặt real-time để điểm danh, lưu trữ thông tin khách hàng,...',
    descriptionEn: 'A gym management website featuring real-time facial recognition for member check-ins and customer information storage.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'C#','.NET','Face Recognition API'],
    github: 'https://github.com/hoangcm7a-netizen/QLPG',
    demo: 'https://www.youtube.com/watch?v=m0YKMeq72v8',
    demoLabel: 'Watch Video'
  },
  {
    id: 'project2',
    name: 'Quản lý quán net',
    descriptionVi: 'Thiết kế giao diện ứng dụng XAML, quản lý dữ liệu quán net: thêm, sửa, xóa, nạp tiền, order. Chưa thiết lập được tương tác giữa máy chủ và người dùng.',
    descriptionEn: 'Developed a XAML (WPF) UI for internet cafe management, handling data operations (CRUD), account top-ups, and service ordering. Client-server interaction is pending implementation.',
    technologies: ['C#', 'WPF', 'XAML'],
    github: 'https://github.com/hoangcm7a-netizen/QLNet',
    demo: 'https://www.youtube.com/watch?v=kZw70h0lBkI',
    demoLabel: 'Watch Video'
  },
  {
    id: 'project3',
    name: 'An tâm tuổi vàng',
    descriptionVi: 'Trang web giới thiệu về dự án An Tâm Tuổi Vàng, chưa có chức năng gửi tin nhắn gmail đến người dùng.',
    descriptionEn: 'An informational website for the An Tam Tuoi Vang project. The Gmail messaging feature for users is not yet implemented.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'shadcn-ui', 'Vite'],
    github: 'https://github.com/hoangcm7a-netizen/santam-tuoivang-care',
    demo: 'https://antamtuoivang.netlify.app/',
    demoLabel: 'Live Demo'
  }
];

const skills = {
  programminglanguages: ['C#', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'XAML'],
  humanlanguages: ['Vietnamese (First Language)', 'English (Intermediate)', 'Japanese (Beginner)', 'Chinese (Beginner)', 'Korean (Beginner)'],
  frameworks: ['React', 'WPF', '.NET', 'Tailwind CSS', 'shadcn-ui', 'Vite']
};

const DevSection = () => {
  const [selectedFile, setSelectedFile] = useState<string>('project1');
  const [selectedTab, setSelectedTab] = useState<'projects' | 'skills'>('projects');
  const selectedProject = projects.find(p => p.id === selectedFile);

  const handleSelectSkill = (skillId: string) => {
    setSelectedFile(skillId);
  };

  // Hàm tạo tên file hiển thị trên Tab Bar
  const getFileNameDisplay = () => {
    if (selectedProject) return `${selectedProject.name.toLowerCase().replace(/\s+/g, '_')}.js`;
    switch (selectedFile) {
      case 'prog_lang': return 'programming_languages.md';
      case 'human_lang': return 'human_languages.md';
      case 'frameworks': return 'frameworks_tools.md';
      default: return 'unknown.md';
    }
  };

  return (
    <section id="dev" className="min-h-screen py-20 bg-background">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12 font-mono code-accent glow-code">
          {'DEV - DỰ ÁN ĐÃ LÀM'}
        </h2>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* === SIDEBAR (BÊN TRÁI) === */}
          <div className="lg:col-span-1 bg-card border border-border rounded-lg p-4 h-fit">
            <div className="flex items-center gap-2 mb-4 text-muted-foreground">
              <Code2 className="w-4 h-4" />
              <span className="text-sm font-mono">Hhoang2502</span>
            </div>

            <div className="space-y-2">
              {/* Folder Project */}
              <button
                onClick={() => {
                   setSelectedTab('projects');
                   setSelectedFile('project1'); 
                }}
                className={`flex items-center gap-2 text-sm font-mono hover:text-primary transition-colors w-full text-left ${selectedTab === 'projects' ? 'text-primary' : ''}`}
              >
                <Folder className="w-4 h-4" />
                <span>project (dự án)/</span>
              </button>
              
              {selectedTab === 'projects' && (
                <div className="ml-6 space-y-1">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => setSelectedFile(project.id)}
                      className={`flex items-center gap-2 text-sm font-mono hover:text-primary transition-colors w-full text-left ${
                        selectedFile === project.id ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      <FileCode className="w-3 h-3" />
                      <span>{project.name.toLowerCase().replace(/\s+/g, '_')}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Folder Skills */}
              <button
                onClick={() => {
                  setSelectedTab('skills');
                  setSelectedFile('prog_lang');
                }}
                className={`flex items-center gap-2 text-sm font-mono hover:text-primary transition-colors w-full text-left ${selectedTab === 'skills' ? 'text-primary' : ''}`}
              >
                <Folder className="w-4 h-4" />
                <span>skills (kỹ năng)/</span>
              </button>
              
              {selectedTab === 'skills' && (
                <div className="ml-6 space-y-1">
                  <button
                    onClick={() => handleSelectSkill('prog_lang')}
                    className={`flex items-center gap-2 text-sm font-mono hover:text-primary transition-colors w-full text-left ${selectedFile === 'prog_lang' ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    <FileCode className="w-3 h-3" />
                    <span>Programming Languages - Ngôn ngữ lập trình</span>
                  </button>
                  <button
                    onClick={() => handleSelectSkill('human_lang')}
                    className={`flex items-center gap-2 text-sm font-mono hover:text-primary transition-colors w-full text-left ${selectedFile === 'human_lang' ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    <Globe className="w-3 h-3" />
                    <span>Human Languages - Ngôn ngữ giao tiếp</span>
                  </button>
                  <button
                    onClick={() => handleSelectSkill('frameworks')}
                    className={`flex items-center gap-2 text-sm font-mono hover:text-primary transition-colors w-full text-left ${selectedFile === 'frameworks' ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    <FileCode className="w-3 h-3" />
                    <span>Frameworks & Tools - Công cụ</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* === CONTENT (BÊN PHẢI) === */}
          <div className="lg:col-span-3 bg-card border border-border rounded-lg overflow-hidden flex flex-col">
            {/* Tab Bar */}
            <div className="bg-muted border-b border-border px-4 py-2 flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-background rounded text-sm font-mono">
                {selectedFile === 'human_lang' ? <Globe className="w-3 h-3 code-accent" /> : <FileCode className="w-3 h-3 code-accent" />}
                <span>{getFileNameDisplay()}</span>
              </div>
            </div>

            {/* Main View Area */}
            <div className="p-8 flex-1 min-h-[300px]">
              {/* TRƯỜNG HỢP 1: Hiển thị Project */}
              {selectedProject && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">{selectedProject.name}</h3>
                    
                    {/* === PHẦN HIỂN THỊ MÔ TẢ SONG NGỮ === */}
                    <div className="space-y-4 text-muted-foreground">
                      {/* Tiếng Việt */}
                      <p className="leading-relaxed">
                        {selectedProject.descriptionVi}
                      </p>
                      
                      {/* Đường kẻ ngăn cách */}
                      <div className="border-t border-border/50 w-full my-2"></div>
                      
                      {/* Tiếng Anh (In nghiêng nhẹ để phân biệt) */}
                      <p className="leading-relaxed italic opacity-80">
                        {selectedProject.descriptionEn}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-mono text-muted-foreground mb-2">{'TECHNOLOGIES'}</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-muted rounded text-sm font-mono code-accent border border-primary/20">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    {selectedProject.github && selectedProject.github !== '#' && (
                      <a href={selectedProject.github} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="gap-2 font-mono"><Github className="w-4 h-4" /> GitHub</Button>
                      </a>
                    )}
                    
                    {selectedProject.demo && selectedProject.demo !== '#' && (
                      <a href={selectedProject.demo} target="_blank" rel="noopener noreferrer">
                        <Button className={`gap-2 font-mono ${
                            selectedProject.demo.includes('youtube') 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'bg-primary hover:bg-primary/90' 
                        }`}>
                          {selectedProject.demo.includes('youtube') ? <PlayCircle className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                          {selectedProject.demoLabel || 'Live Demo'}
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* TRƯỜNG HỢP 2: Hiển thị Skills */}
              {selectedFile === 'prog_lang' && (
                <div className="animate-fade-in font-mono">
                  <h3 className="text-xl font-bold mb-4 code-accent">{'# Programming Languages - Ngôn ngữ lập trình'}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.programminglanguages.map((lang) => (
                      <span key={lang} className="px-3 py-1 bg-muted rounded text-sm">{lang}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedFile === 'human_lang' && (
                <div className="animate-fade-in font-mono">
                  <h3 className="text-xl font-bold mb-4 code-accent">{'# Human Languages - Ngôn ngữ giao tiếp'}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.humanlanguages.map((lang) => (
                      <span key={lang} className="px-3 py-1 bg-muted rounded text-sm">{lang}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedFile === 'frameworks' && (
                <div className="animate-fade-in font-mono">
                  <h3 className="text-xl font-bold mb-4 code-accent">{'# Frameworks & Tools - Công cụ'}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.frameworks.map((framework) => (
                      <span key={framework} className="px-3 py-1 bg-muted rounded text-sm">{framework}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DevSection;