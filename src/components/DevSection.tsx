import { useState, useEffect } from 'react';
import { Code2, Folder, FileCode, Github, ExternalLink, Globe, PlayCircle, Loader2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '../supabase';
import { useLanguage } from '../context/LanguageContext';

interface Project { id: string; name: string; description_vi: string; description_en: string; technologies: string[]; github_url: string; demo_url: string; demo_label: string; problem_vi?: string; problem_en?: string; solution_vi?: string; solution_en?: string; images?: string[]; }

const DevSection = () => {
  const { language } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [techs, setTechs] = useState<any[]>([]); // Thêm state lưu kỹ năng từ DB
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<'projects' | 'skills'>('projects');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Tải ĐỒNG THỜI dữ liệu Dự án và Kỹ năng (Tech Stack)
        const [projRes, techRes] = await Promise.all([
          supabase.from('projects').select('*').order('created_at', { ascending: true }),
          supabase.from('tech_stack').select('*').order('category')
        ]);

        if (projRes.data && projRes.data.length > 0) { 
            setProjects(projRes.data); 
            setSelectedFile(projRes.data[0].id); 
        }
        if (techRes.data) {
            setTechs(techRes.data);
        }
      } catch (error) { 
          console.error(error); 
      } finally { 
          setIsLoading(false); 
      }
    };
    fetchData();
  }, []);

  const selectedProject = projects.find(p => p.id === selectedFile);

  // 1. Tự động gom nhóm Kỹ năng dựa trên Category bạn nhập trong Admin
  const groupedTechs = techs.reduce((acc, curr) => {
    const cat = curr.category || 'Khác';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(curr);
    return acc;
  }, {} as Record<string, any[]>);

  // Lấy ra danh sách tên các Nhóm (Ví dụ: Dev, Media, Programming, Human Languages)
  const skillCategories = Object.keys(groupedTechs);

  // 2. Logic hiển thị tên file trên thanh tiêu đề Terminal
  const getFileNameDisplay = () => {
    if (isLoading) return 'loading.js';
    // Nếu đang chọn Dự án
    if (selectedProject) return `${selectedProject.name.toLowerCase().replace(/\s+/g, '_')}.js`;
    // Nếu đang chọn Kỹ năng (Bắt đầu bằng chữ skill_)
    if (selectedFile.startsWith('skill_')) {
        const catName = selectedFile.replace('skill_', '');
        return `${catName.toLowerCase().replace(/\s+/g, '_')}.md`;
    }
    return 'unknown.md';
  };

  return (
    <section id="dev" className="min-h-screen py-20 bg-background">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12 font-mono code-accent glow-code">
          {language === 'vi' ? 'DEV - DỰ ÁN NỔI BẬT' : 'DEV - FEATURED PROJECTS'}
        </h2>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* SIDEBAR BÊN TRÁI */}
          <div className="lg:col-span-1 bg-card border border-border rounded-lg p-4 h-fit">
            <div className="flex items-center gap-2 mb-4 text-muted-foreground">
              <Code2 className="w-4 h-4" />
              <span className="text-sm font-mono">Hhoang2502</span>
            </div>

            <div className="space-y-2">
              {/* TAB PROJECTS */}
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

              {/* TAB SKILLS (TỰ ĐỘNG LẤY TỪ ADMIN) */}
              <button onClick={() => { 
                  setSelectedTab('skills'); 
                  if (skillCategories.length > 0) setSelectedFile(`skill_${skillCategories[0]}`); 
                }} 
                className={`flex items-center gap-2 text-sm font-mono hover:text-primary transition-colors w-full text-left ${selectedTab === 'skills' ? 'text-primary' : ''}`}>
                <Folder className="w-4 h-4" /> <span>{language === 'vi' ? 'kỹ năng (skills)/' : 'skills/'}</span>
              </button>
              
              {selectedTab === 'skills' && (
                <div className="ml-6 space-y-1">
                  {/* Tự động render file .md theo số lượng category trong Database */}
                  {skillCategories.map(category => (
                      <button key={category} onClick={() => setSelectedFile(`skill_${category}`)} className={`flex items-center gap-2 text-sm font-mono hover:text-primary transition-colors w-full text-left ${selectedFile === `skill_${category}` ? 'text-primary' : 'text-muted-foreground'}`}>
                        {category.toLowerCase().includes('human') || category.toLowerCase().includes('ngôn ngữ') ? <Globe className="w-3 h-3" /> : <FileCode className="w-3 h-3" />}
                        <span className="truncate">{category}</span>
                      </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* NỘI DUNG BÊN PHẢI */}
          <div className="lg:col-span-3 bg-card border border-border rounded-lg overflow-hidden flex flex-col">
            <div className="bg-muted border-b border-border px-4 py-2 flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-background rounded text-sm font-mono">
                {selectedFile.includes('human') ? <Globe className="w-3 h-3 code-accent" /> : <FileCode className="w-3 h-3 code-accent" />}
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
                  <div className="flex flex-wrap gap-4 pt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="gap-2 font-mono bg-accent hover:bg-accent/90 text-accent-foreground">
                          <BookOpen className="w-4 h-4" /> 
                          {language === 'vi' ? 'Xem Chi Tiết (Case Study)' : 'View Case Study'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-card border-border">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold font-mono code-accent">{selectedProject.name}</DialogTitle>
                          <DialogDescription>
                            {language === 'vi' ? selectedProject.description_vi : selectedProject.description_en}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-6">
                          {selectedProject.images && selectedProject.images.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {selectedProject.images.map((img, idx) => (
                                <img key={idx} src={img} alt={`${selectedProject.name} screenshot ${idx + 1}`} className="rounded-lg border border-border w-full h-auto object-cover" />
                              ))}
                            </div>
                          )}
                          
                          {(selectedProject.problem_vi || selectedProject.problem_en) && (
                            <div>
                              <h4 className="text-lg font-bold font-mono mb-2 text-primary">{language === 'vi' ? 'Vấn Đề' : 'The Problem'}</h4>
                              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{language === 'vi' ? selectedProject.problem_vi : selectedProject.problem_en}</p>
                            </div>
                          )}

                          {(selectedProject.solution_vi || selectedProject.solution_en) && (
                            <div>
                              <h4 className="text-lg font-bold font-mono mb-2 text-primary">{language === 'vi' ? 'Giải Pháp' : 'The Solution'}</h4>
                              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{language === 'vi' ? selectedProject.solution_vi : selectedProject.solution_en}</p>
                            </div>
                          )}

                          <div className="flex gap-4 pt-4 border-t border-border">
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
                      </DialogContent>
                    </Dialog>

                    {selectedProject.github_url && selectedProject.github_url !== '#' && (
                      <a href={selectedProject.github_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="gap-2 font-mono"><Github className="w-4 h-4" /> GitHub</Button>
                      </a>
                    )}
                    {selectedProject.demo_url && selectedProject.demo_url !== '#' && (
                      <a href={selectedProject.demo_url} target="_blank" rel="noopener noreferrer">
                        <Button className={`gap-2 font-mono ${selectedProject.demo_url.includes('youtube') ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}>
                          {selectedProject.demo_url.includes('youtube') ? <PlayCircle className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                          {selectedProject.demo_label || (language === 'vi' ? 'Xem Demo' : 'Live Demo')}
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              ) : null}

              {/* RENDER ĐỘNG DANH SÁCH SKILLS (Thay thế hoàn toàn hardcode) */}
              {selectedFile.startsWith('skill_') && (
                <div className="animate-fade-in font-mono">
                  <h3 className="text-xl font-bold mb-4 code-accent">
                    # {selectedFile.replace('skill_', '')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {/* Tìm và in ra tất cả các kỹ năng thuộc nhóm (category) đang được click */}
                    {groupedTechs[selectedFile.replace('skill_', '')]?.map((tech) => (
                        <span key={tech.id} className="px-3 py-1 bg-muted rounded text-sm code-accent border border-primary/20 hover:scale-105 transition-transform cursor-default shadow-sm">
                            {tech.name}
                        </span>
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