import { useState, useEffect } from 'react';
import { Code2, Folder, FileCode, Github, ExternalLink, Globe, PlayCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '../supabase';
import { useLanguage } from '../context/LanguageContext';

interface Project { id: string; name: string; description_vi: string; description_en: string; technologies: string[]; github_url: string; demo_url: string; demo_label: string; }

const skills = {
  programminglanguages: ['C#', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'XAML'],
  humanlanguages: ['Vietnamese (First Language)', 'English (Intermediate)', 'Japanese (Beginner)', 'Chinese (Beginner)', 'Korean (Beginner)'],
  frameworks: ['React', 'WPF', '.NET', 'Tailwind CSS', 'shadcn-ui', 'Vite']
};

const DevSection = () => {
  const { language } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<'projects' | 'skills'>('projects');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: true });
        if (data && data.length > 0) { setProjects(data); setSelectedFile(data[0].id); }
      } catch (error) { console.error(error); } finally { setIsLoading(false); }
    };
    fetchProjects();
  }, []);

  const selectedProject = projects.find(p => p.id === selectedFile);
  const handleSelectSkill = (skillId: string) => setSelectedFile(skillId);

  const getFileNameDisplay = () => {
    if (isLoading) return 'loading.js';
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
          {language === 'vi' ? 'DEV - DỰ ÁN NỔI BẬT' : 'DEV - FEATURED PROJECTS'}
        </h2>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 bg-card border border-border rounded-lg p-4 h-fit">
            <div className="flex items-center gap-2 mb-4 text-muted-foreground">
              <Code2 className="w-4 h-4" />
              <span className="text-sm font-mono">Hhoang2502</span>
            </div>

            <div className="space-y-2">
              <button onClick={() => { setSelectedTab('projects'); if (projects.length > 0) setSelectedFile(projects[0].id); }} className={`flex items-center gap-2 text-sm font-mono hover:text-primary transition-colors w-full text-left ${selectedTab === 'projects' ? 'text-primary' : ''}`}>
                <Folder className="w-4 h-4" /> <span>{language === 'vi' ? 'dự án (projects)/' : 'projects/'}</span>
              </button>
              
              {selectedTab === 'projects' && (
                <div className="ml-6 space-y-1">
                  {isLoading ? (
                    <span className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> {language === 'vi' ? 'Đang tải...' : 'Loading...'}</span>
                  ) : (
                    projects.map((project) => (
                      <button key={project.id} onClick={() => setSelectedFile(project.id)} className={`flex items-center gap-2 text-sm font-mono hover:text-primary transition-colors w-full text-left ${selectedFile === project.id ? 'text-primary' : 'text-muted-foreground'}`}>
                        <FileCode className="w-3 h-3" /> <span className="truncate">{project.name.toLowerCase().replace(/\s+/g, '_')}</span>
                      </button>
                    ))
                  )}
                </div>
              )}

              <button onClick={() => { setSelectedTab('skills'); setSelectedFile('prog_lang'); }} className={`flex items-center gap-2 text-sm font-mono hover:text-primary transition-colors w-full text-left ${selectedTab === 'skills' ? 'text-primary' : ''}`}>
                <Folder className="w-4 h-4" /> <span>{language === 'vi' ? 'kỹ năng (skills)/' : 'skills/'}</span>
              </button>
              
              {selectedTab === 'skills' && (
                <div className="ml-6 space-y-1">
                  <button onClick={() => handleSelectSkill('prog_lang')} className={`flex items-center gap-2 text-sm font-mono hover:text-primary transition-colors w-full text-left ${selectedFile === 'prog_lang' ? 'text-primary' : 'text-muted-foreground'}`}>
                    <FileCode className="w-3 h-3" /> <span>Programming Languages</span>
                  </button>
                  <button onClick={() => handleSelectSkill('human_lang')} className={`flex items-center gap-2 text-sm font-mono hover:text-primary transition-colors w-full text-left ${selectedFile === 'human_lang' ? 'text-primary' : 'text-muted-foreground'}`}>
                    <Globe className="w-3 h-3" /> <span>Human Languages</span>
                  </button>
                  <button onClick={() => handleSelectSkill('frameworks')} className={`flex items-center gap-2 text-sm font-mono hover:text-primary transition-colors w-full text-left ${selectedFile === 'frameworks' ? 'text-primary' : 'text-muted-foreground'}`}>
                    <FileCode className="w-3 h-3" /> <span>Frameworks & Tools</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3 bg-card border border-border rounded-lg overflow-hidden flex flex-col">
            <div className="bg-muted border-b border-border px-4 py-2 flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-background rounded text-sm font-mono">
                {selectedFile === 'human_lang' ? <Globe className="w-3 h-3 code-accent" /> : <FileCode className="w-3 h-3 code-accent" />}
                <span>{getFileNameDisplay()}</span>
              </div>
            </div>

            <div className="p-8 flex-1 min-h-[300px]">
              {isLoading && selectedTab === 'projects' ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
                   <Loader2 className="w-8 h-8 animate-spin text-primary" />
                   <p className="font-mono">{language === 'vi' ? 'Đang lấy dữ liệu từ Server...' : 'Fetching data from Server...'}</p>
                </div>
              ) : selectedProject && selectedTab === 'projects' ? (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">{selectedProject.name}</h3>
                    <div className="space-y-4 text-muted-foreground">
                      {/* Đã đồng bộ hiển thị mô tả dự án theo ngôn ngữ chọn */}
                      <p className="leading-relaxed">{language === 'vi' ? selectedProject.description_vi : selectedProject.description_en}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-mono text-muted-foreground mb-2">{'TECHNOLOGIES'}</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies && selectedProject.technologies.map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-muted rounded text-sm font-mono code-accent border border-primary/20">{tech}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    {selectedProject.github_url && selectedProject.github_url !== '#' && (
                      <a href={selectedProject.github_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="gap-2 font-mono"><Github className="w-4 h-4" /> GitHub</Button>
                      </a>
                    )}
                    {selectedProject.demo_url && selectedProject.demo_url !== '#' && (
                      <a href={selectedProject.demo_url} target="_blank" rel="noopener noreferrer">
                        <Button className={`gap-2 font-mono ${selectedProject.demo_url.includes('youtube') ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary/90'}`}>
                          {selectedProject.demo_url.includes('youtube') ? <PlayCircle className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                          {selectedProject.demo_label || (language === 'vi' ? 'Xem Demo' : 'Live Demo')}
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              ) : null}

              {/* Skills */}
              {selectedFile === 'prog_lang' && (
                <div className="animate-fade-in font-mono">
                  <h3 className="text-xl font-bold mb-4 code-accent">{'# Programming Languages'}</h3>
                  <div className="flex flex-wrap gap-2">{skills.programminglanguages.map((lang) => <span key={lang} className="px-3 py-1 bg-muted rounded text-sm">{lang}</span>)}</div>
                </div>
              )}
              {selectedFile === 'human_lang' && (
                <div className="animate-fade-in font-mono">
                  <h3 className="text-xl font-bold mb-4 code-accent">{'# Human Languages'}</h3>
                  <div className="flex flex-wrap gap-2">{skills.humanlanguages.map((lang) => <span key={lang} className="px-3 py-1 bg-muted rounded text-sm">{lang}</span>)}</div>
                </div>
              )}
              {selectedFile === 'frameworks' && (
                <div className="animate-fade-in font-mono">
                  <h3 className="text-xl font-bold mb-4 code-accent">{'# Frameworks & Tools'}</h3>
                  <div className="flex flex-wrap gap-2">{skills.frameworks.map((framework) => <span key={framework} className="px-3 py-1 bg-muted rounded text-sm">{framework}</span>)}</div>
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