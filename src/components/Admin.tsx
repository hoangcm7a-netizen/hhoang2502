import * as React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Loader2, Save, Plus, Trash2, Edit3, Film, Code2, MessageSquare, LogOut, Lock, User, Phone, Wrench, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Admin = () => {
    const [session, setSession] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'projects' | 'media' | 'tech' | 'contact' | 'seo'>('hero');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');

    // States lưu dữ liệu
    const [heroData, setHeroData] = useState<any>({ greetings: [], typing_speed: 40, line_spacing: 2.0 });
    const [aboutData, setAboutData] = useState<any>({ title: '', description_vi: '', description_en: '', profile_image_url: '', location: '', role_title: '' });
    const [seoData, setSeoData] = useState<any>({ title: '', description: '', keywords: '', og_image: '', site_url: '' });

    const [projects, setProjects] = useState<any[]>([]);
    const [editingProject, setEditingProject] = useState<any>(null);
    const [mediaItems, setMediaItems] = useState<any[]>([]);
    const [editingMedia, setEditingMedia] = useState<any>(null);
    const [techs, setTechs] = useState<any[]>([]);
    const [editingTech, setEditingTech] = useState<any>(null);
    const [contacts, setContacts] = useState<any[]>([]);
    const [editingContact, setEditingContact] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (session) fetchData();
    }, [activeTab, session?.user?.id]);

    const showMsg = (msg: string, type: 'success' | 'error' = 'success') => {
        setMessage(msg); setMessageType(type); setTimeout(() => setMessage(''), 4000);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'hero') {
                const { data } = await supabase.from('hero_settings').select('*').eq('id', 1).single();
                if (data) setHeroData(data);
            } else if (activeTab === 'about') {
                const { data } = await supabase.from('about_me').select('*').eq('id', 1).single();
                if (data) setAboutData(data);
            } else if (activeTab === 'seo') {
                const { data } = await supabase.from('seo_settings').select('*').eq('id', 1).single();
                if (data) setSeoData(data);
            } else if (activeTab === 'projects') {
                const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: true });
                setProjects(data || []);
            } else if (activeTab === 'media') {
                const { data } = await supabase.from('media_items').select('*').order('created_at', { ascending: true });
                setMediaItems(data || []);
            } else if (activeTab === 'tech') {
                const { data } = await supabase.from('tech_stack').select('*').order('category');
                setTechs(data || []);
            } else if (activeTab === 'contact') {
                const { data } = await supabase.from('social_links').select('*').order('created_at', { ascending: true });
                setContacts(data || []);
            }
        } catch (e) { showMsg('Lỗi tải dữ liệu!', 'error'); } finally { setLoading(false); }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'media' | 'about' | 'seo') => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLoading(true); showMsg('Đang tải ảnh...', 'success');
        const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
        const { error } = await supabase.storage.from('media_images').upload(fileName, file);
        if (error) { showMsg('Lỗi tải ảnh: ' + error.message, 'error'); } 
        else {
            const { data } = supabase.storage.from('media_images').getPublicUrl(fileName);
            if (type === 'media') setEditingMedia({ ...editingMedia, thumbnail_url: data.publicUrl });
            else if (type === 'about') setAboutData({ ...aboutData, profile_image_url: data.publicUrl });
            else if (type === 'seo') setSeoData({ ...seoData, og_image: data.publicUrl });
            showMsg('Tải ảnh thành công!');
        }
        setLoading(false);
    };

    // ĐÂY LÀ PHẦN KHAI BÁO CÁC HÀM LƯU BỊ THIẾU
    const handleSaveHero = async () => { setLoading(true); await supabase.from('hero_settings').update(heroData).eq('id', 1); showMsg('Đã lưu!'); setLoading(false); };
    const handleSaveAbout = async () => { setLoading(true); await supabase.from('about_me').update(aboutData).eq('id', 1); showMsg('Đã lưu!'); setLoading(false); };
    const handleSaveSeo = async () => { setLoading(true); await supabase.from('seo_settings').update(seoData).eq('id', 1); showMsg('Đã lưu SEO!'); setLoading(false); };

    const saveListItem = async (table: string, itemData: any, setEditingState: any) => {
        setLoading(true);
        if (itemData.id) await supabase.from(table).update(itemData).eq('id', itemData.id);
        else await supabase.from(table).insert([itemData]);
        setEditingState(null); fetchData(); showMsg('Đã lưu thành công!'); setLoading(false);
    };

    const handleSaveProject = (e: React.FormEvent) => {
        e.preventDefault();
        const projectData = { ...editingProject, technologies: typeof editingProject.technologies === 'string' ? editingProject.technologies.split(',').map((s:any) => s.trim()) : editingProject.technologies };
        saveListItem('projects', projectData, setEditingProject);
    };
    
    const handleSaveMedia = (e: React.FormEvent) => { e.preventDefault(); saveListItem('media_items', editingMedia, setEditingMedia); };
    const handleSaveTech = (e: React.FormEvent) => { e.preventDefault(); saveListItem('tech_stack', editingTech, setEditingTech); };
    
    // HÀM QUAN TRỌNG: Lưu liên hệ mạng xã hội
    const handleSaveContact = (e: React.FormEvent) => { e.preventDefault(); saveListItem('social_links', editingContact, setEditingContact); };

    const deleteItem = async (table: string, id: string) => { 
        if(window.confirm('Xóa mục này?')) { await supabase.from(table).delete().eq('id', id); fetchData(); showMsg('Đã xóa!'); } 
    };

    if (!session) return <LoginForm />;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-mono p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-[#111] p-6 rounded-lg border border-gray-800">
                    <div><h1 className="text-2xl font-bold text-cyan-400 flex items-center gap-2"><Lock className="w-6 h-6" /> ADMIN DASHBOARD</h1><p className="text-xs text-gray-500">{session.user.email}</p></div>
                    <Button variant="destructive" onClick={() => supabase.auth.signOut()}><LogOut className="w-4 h-4 mr-2" /> Đăng xuất</Button>
                </div>

                {message && <div className={`p-4 mb-4 rounded border ${messageType === 'error' ? 'bg-red-950/40 border-red-500 text-red-400' : 'bg-cyan-950/40 border-cyan-500 text-cyan-400'}`}>{message}</div>}

                <div className="flex gap-2 mb-6 overflow-x-auto border-b border-gray-800 pb-2">
                    <TabButton active={activeTab === 'hero'} onClick={() => setActiveTab('hero')} icon={<MessageSquare className="w-4 h-4"/>} label="Lời chào" />
                    <TabButton active={activeTab === 'about'} onClick={() => setActiveTab('about')} icon={<User className="w-4 h-4"/>} label="Cá nhân" />
                    <TabButton active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} icon={<Code2 className="w-4 h-4"/>} label="Dự án" />
                    <TabButton active={activeTab === 'media'} onClick={() => setActiveTab('media')} icon={<Film className="w-4 h-4"/>} label="Media" />
                    <TabButton active={activeTab === 'tech'} onClick={() => setActiveTab('tech')} icon={<Wrench className="w-4 h-4"/>} label="Tech" />
                    <TabButton active={activeTab === 'contact'} onClick={() => setActiveTab('contact')} icon={<Phone className="w-4 h-4"/>} label="Liên hệ" />
                    <TabButton active={activeTab === 'seo'} onClick={() => setActiveTab('seo')} icon={<Globe className="w-4 h-4"/>} label="SEO" />
                </div>

                <div className="bg-[#111] border border-gray-800 rounded-lg p-6 min-h-[500px]">
                    {/* TAB HERO */}
                    {activeTab === 'hero' && (
                        <div className="space-y-4 max-w-2xl">
                            <Input type="number" value={heroData.typing_speed} onChange={e => setHeroData({...heroData, typing_speed: parseInt(e.target.value)})} className="bg-[#1a1a1a]" placeholder="Tốc độ gõ" />
                            <Input type="number" step="0.1" value={heroData.line_spacing} onChange={e => setHeroData({...heroData, line_spacing: parseFloat(e.target.value)})} className="bg-[#1a1a1a]" placeholder="Giãn dòng" />
                            {heroData.greetings?.map((text: string, idx: number) => (
                                <Input key={idx} value={text} onChange={(e) => { const newG = [...heroData.greetings]; newG[idx] = e.target.value; setHeroData({...heroData, greetings: newG}); }} className="bg-[#1a1a1a]" />
                            ))}
                            <Button onClick={handleSaveHero} className="bg-cyan-600">Lưu</Button>
                        </div>
                    )}

                    {/* TAB ABOUT ME */}
                    {activeTab === 'about' && (
                        <div className="space-y-4 max-w-3xl">
                            <div className="flex gap-4 items-center">
                                <img src={aboutData.profile_image_url || '/placeholder.png'} className="w-20 h-20 rounded-full object-cover border border-cyan-500"/>
                                <div className="relative"><Button variant="outline" className="bg-[#1a1a1a]">Đổi ảnh</Button><input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'about')} className="absolute inset-0 opacity-0 cursor-pointer" /></div>
                            </div>
                            <Input value={aboutData.title || ''} onChange={e => setAboutData({...aboutData, title: e.target.value})} className="bg-[#1a1a1a]" placeholder="Tiêu đề" />
                            <Textarea value={aboutData.description_vi || ''} onChange={e => setAboutData({...aboutData, description_vi: e.target.value})} className="bg-[#1a1a1a]" rows={3} placeholder="Mô tả VN" />
                            <Textarea value={aboutData.description_en || ''} onChange={e => setAboutData({...aboutData, description_en: e.target.value})} className="bg-[#1a1a1a]" rows={3} placeholder="Mô tả EN" />
                            <div className="grid grid-cols-2 gap-4">
                                <Input value={aboutData.role_title || ''} onChange={e => setAboutData({...aboutData, role_title: e.target.value})} className="bg-[#1a1a1a]" placeholder="Chức danh" />
                                <Input value={aboutData.location || ''} onChange={e => setAboutData({...aboutData, location: e.target.value})} className="bg-[#1a1a1a]" placeholder="Địa điểm" />
                            </div>
                            <Button onClick={handleSaveAbout} className="bg-cyan-600">Lưu</Button>
                        </div>
                    )}

                    {/* TAB PROJECTS */}
                    {activeTab === 'projects' && (
                        <div>
                            {!editingProject ? (
                                <div className="space-y-4">
                                    <Button onClick={() => setEditingProject({ name: '', description_vi: '', description_en: '', technologies: '', github_url: '', demo_url: '', demo_label: 'Watch Video', problem_vi: '', problem_en: '', solution_vi: '', solution_en: '', images: [] })} className="bg-green-600"><Plus className="w-4 h-4 mr-2" /> Thêm</Button>
                                    <div className="grid gap-3">
                                        {projects.map(p => (
                                            <div key={p.id} className="p-4 bg-[#1a1a1a] rounded flex justify-between items-center border border-gray-800">
                                                <div><p className="font-bold text-white">{p.name}</p><p className="text-xs text-gray-500">{Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies}</p></div>
                                                <div className="flex gap-2"><Button size="icon" variant="ghost" onClick={() => setEditingProject(p)}><Edit3 className="w-4 h-4"/></Button><Button size="icon" variant="ghost" className="text-red-500" onClick={() => deleteItem('projects', p.id)}><Trash2 className="w-4 h-4"/></Button></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSaveProject} className="space-y-3 max-w-3xl">
                                    <Input placeholder="Tên" value={editingProject.name || ''} onChange={e => setEditingProject({...editingProject, name: e.target.value})} className="bg-[#1a1a1a]" required/>
                                    <Textarea placeholder="Mô tả ngắn VN" value={editingProject.description_vi || ''} onChange={e => setEditingProject({...editingProject, description_vi: e.target.value})} className="bg-[#1a1a1a]" rows={2} />
                                    <Textarea placeholder="Mô tả ngắn EN" value={editingProject.description_en || ''} onChange={e => setEditingProject({...editingProject, description_en: e.target.value})} className="bg-[#1a1a1a]" rows={2} />
                                    
                                    <div className="grid md:grid-cols-2 gap-3 border border-gray-800 p-4 rounded-lg bg-[#111]">
                                        <p className="md:col-span-2 font-bold text-cyan-400 text-sm">Chi tiết Case Study (Không bắt buộc)</p>
                                        <Textarea placeholder="Vấn đề VN" value={editingProject.problem_vi || ''} onChange={e => setEditingProject({...editingProject, problem_vi: e.target.value})} className="bg-[#1a1a1a]" rows={3} />
                                        <Textarea placeholder="Vấn đề EN" value={editingProject.problem_en || ''} onChange={e => setEditingProject({...editingProject, problem_en: e.target.value})} className="bg-[#1a1a1a]" rows={3} />
                                        <Textarea placeholder="Giải pháp VN" value={editingProject.solution_vi || ''} onChange={e => setEditingProject({...editingProject, solution_vi: e.target.value})} className="bg-[#1a1a1a]" rows={3} />
                                        <Textarea placeholder="Giải pháp EN" value={editingProject.solution_en || ''} onChange={e => setEditingProject({...editingProject, solution_en: e.target.value})} className="bg-[#1a1a1a]" rows={3} />
                                        <Input placeholder="Link ảnh Gallery (cách nhau dấu phẩy)" value={(editingProject.images || []).join(', ')} onChange={e => setEditingProject({...editingProject, images: e.target.value.split(',').map((s:string) => s.trim()).filter(Boolean)})} className="bg-[#1a1a1a] md:col-span-2" />
                                    </div>

                                    <Input placeholder="Công nghệ (cách nhau dấu phẩy)" value={Array.isArray(editingProject.technologies) ? editingProject.technologies.join(', ') : (editingProject.technologies || '')} onChange={e => setEditingProject({...editingProject, technologies: e.target.value})} className="bg-[#1a1a1a]" />
                                    <div className="grid md:grid-cols-3 gap-3">
                                        <Input placeholder="Link GitHub" value={editingProject.github_url || ''} onChange={e => setEditingProject({...editingProject, github_url: e.target.value})} className="bg-[#1a1a1a]" />
                                        <Input placeholder="Link Demo" value={editingProject.demo_url || ''} onChange={e => setEditingProject({...editingProject, demo_url: e.target.value})} className="bg-[#1a1a1a]" />
                                        <Input placeholder="Nhãn nút (Watch Video, Live Demo...)" value={editingProject.demo_label || ''} onChange={e => setEditingProject({...editingProject, demo_label: e.target.value})} className="bg-[#1a1a1a]" />
                                    </div>
                                    <div className="flex gap-2 pt-2"><Button type="submit" className="bg-green-600">Lưu Dự Án</Button><Button type="button" variant="outline" onClick={() => setEditingProject(null)}>Hủy</Button></div>
                                </form>
                            )}
                        </div>
                    )}

                    {/* TAB MEDIA */}
                    {activeTab === 'media' && (
                        <div>
                            {!editingMedia ? (
                                <div className="space-y-4">
                                    <Button onClick={() => setEditingMedia({ title: '', category: '', description: '', thumbnail_url: '', video_url: '', icon_name: 'Film' })} className="bg-pink-600"><Plus className="w-4 h-4 mr-2" /> Thêm</Button>
                                    <div className="grid gap-3">
                                        {mediaItems.map(m => (
                                            <div key={m.id} className="p-4 bg-[#1a1a1a] rounded flex justify-between items-center border border-gray-800">
                                                <div className="flex gap-4 items-center"><img src={m.thumbnail_url || '/placeholder.png'} className="w-12 h-12 object-cover rounded"/><div><p className="font-bold text-white">{m.title}</p><p className="text-xs text-gray-500">{m.category}</p></div></div>
                                                <div className="flex gap-2"><Button size="icon" variant="ghost" onClick={() => setEditingMedia(m)}><Edit3 className="w-4 h-4"/></Button><Button size="icon" variant="ghost" className="text-red-500" onClick={() => deleteItem('media_items', m.id)}><Trash2 className="w-4 h-4"/></Button></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSaveMedia} className="space-y-3 max-w-2xl">
                                    <Input placeholder="Tiêu đề" value={editingMedia.title || ''} onChange={e => setEditingMedia({...editingMedia, title: e.target.value})} className="bg-[#1a1a1a]" required/>
                                    <Input placeholder="Thể loại" value={editingMedia.category || ''} onChange={e => setEditingMedia({...editingMedia, category: e.target.value})} className="bg-[#1a1a1a]" />
                                    <Textarea placeholder="Mô tả" value={editingMedia.description || ''} onChange={e => setEditingMedia({...editingMedia, description: e.target.value})} className="bg-[#1a1a1a]" />
                                    <div className="flex gap-2 items-center">
                                        <Input placeholder="Link ảnh" value={editingMedia.thumbnail_url || ''} onChange={e => setEditingMedia({...editingMedia, thumbnail_url: e.target.value})} className="bg-[#1a1a1a] flex-1" />
                                        <div className="relative"><Button type="button" variant="outline" className="bg-[#1a1a1a]">Tải ảnh</Button><input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'media')} className="absolute inset-0 opacity-0 cursor-pointer" /></div>
                                    </div>
                                    <Input placeholder="Link Video" value={editingMedia.video_url || ''} onChange={e => setEditingMedia({...editingMedia, video_url: e.target.value})} className="bg-[#1a1a1a]" />
                                    <div className="flex gap-2"><Button type="submit" className="bg-pink-600">Lưu</Button><Button type="button" variant="outline" onClick={() => setEditingMedia(null)}>Hủy</Button></div>
                                </form>
                            )}
                        </div>
                    )}

                    {/* TAB TECH */}
                    {activeTab === 'tech' && (
                        <div>
                            {!editingTech ? (
                                <div className="space-y-4">
                                    <Button onClick={() => setEditingTech({ name: '', category: 'Dev' })} className="bg-purple-600"><Plus className="w-4 h-4 mr-2" /> Thêm Tech</Button>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {techs.map(t => (
                                            <div key={t.id} className="p-4 bg-[#1a1a1a] border border-gray-800 rounded flex justify-between items-center">
                                                <div><p className="font-bold text-white">{t.name}</p><p className="text-xs text-gray-500">{t.category}</p></div>
                                                <div className="flex gap-2"><Button size="icon" variant="ghost" onClick={() => setEditingTech(t)}><Edit3 className="w-4 h-4"/></Button><Button size="icon" variant="ghost" className="text-red-500" onClick={() => deleteItem('tech_stack', t.id)}><Trash2 className="w-4 h-4"/></Button></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSaveTech} className="space-y-3 max-w-sm">
                                    <Input value={editingTech.name || ''} onChange={e => setEditingTech({...editingTech, name: e.target.value})} className="bg-[#1a1a1a]" placeholder="Tên" required/>
                                    <Input value={editingTech.category || ''} onChange={e => setEditingTech({...editingTech, category: e.target.value})} className="bg-[#1a1a1a]" placeholder="Nhóm" required/>
                                    <div className="flex gap-2"><Button type="submit" className="bg-purple-600">Lưu</Button><Button type="button" variant="outline" onClick={() => setEditingTech(null)}>Hủy</Button></div>
                                </form>
                            )}
                        </div>
                    )}

                    {/* TAB CONTACT */}
                    {activeTab === 'contact' && (
                        <div>
                            {!editingContact ? (
                                <div className="space-y-4">
                                    <Button onClick={() => setEditingContact({ platform: '', display_text: '', url: '', icon_name: 'Link' })} className="bg-blue-600"><Plus className="w-4 h-4 mr-2" /> Thêm</Button>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {contacts.map(c => (
                                            <div key={c.id} className="p-4 bg-[#1a1a1a] border border-gray-800 rounded flex justify-between items-center">
                                                <div className="overflow-hidden pr-4"><p className="font-bold text-white text-sm">{c.platform} • {c.display_text}</p><p className="text-xs text-gray-500 truncate">{c.url}</p></div>
                                                <div className="flex gap-2 shrink-0"><Button size="icon" variant="ghost" onClick={() => setEditingContact(c)}><Edit3 className="w-4 h-4"/></Button><Button size="icon" variant="ghost" className="text-red-500" onClick={() => deleteItem('social_links', c.id)}><Trash2 className="w-4 h-4"/></Button></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSaveContact} className="space-y-3 max-w-lg">
                                    <Input value={editingContact.platform || ''} onChange={e => setEditingContact({...editingContact, platform: e.target.value})} className="bg-[#1a1a1a]" placeholder="Tên nền tảng" required/>
                                    <Input value={editingContact.display_text || ''} onChange={e => setEditingContact({...editingContact, display_text: e.target.value})} className="bg-[#1a1a1a]" placeholder="Chữ hiển thị" required/>
                                    <Input value={editingContact.url || ''} onChange={e => setEditingContact({...editingContact, url: e.target.value})} className="bg-[#1a1a1a]" placeholder="URL đích" required/>
                                    <Input value={editingContact.icon_name || ''} onChange={e => setEditingContact({...editingContact, icon_name: e.target.value})} className="bg-[#1a1a1a]" placeholder="Tên Icon" />
                                    <div className="flex gap-2"><Button type="submit" className="bg-blue-600">Lưu</Button><Button type="button" variant="outline" onClick={() => setEditingContact(null)}>Hủy</Button></div>
                                </form>
                            )}
                        </div>
                    )}

                    {/* TAB SEO */}
                    {activeTab === 'seo' && (
                        <div className="space-y-4 max-w-3xl">
                            <Input value={seoData.title || ''} onChange={e => setSeoData({...seoData, title: e.target.value})} className="bg-[#1a1a1a]" placeholder="Meta Title" />
                            <Textarea value={seoData.description || ''} onChange={e => setSeoData({...seoData, description: e.target.value})} className="bg-[#1a1a1a]" rows={3} placeholder="Meta Description" />
                            <Input value={seoData.keywords || ''} onChange={e => setSeoData({...seoData, keywords: e.target.value})} className="bg-[#1a1a1a]" placeholder="Keywords (cách nhau bằng dấu phẩy)" />
                            <Input value={seoData.site_url || ''} onChange={e => setSeoData({...seoData, site_url: e.target.value})} className="bg-[#1a1a1a]" placeholder="Site URL (https://...)" />
                            <div className="space-y-2">
                                {seoData.og_image && <img src={seoData.og_image} className="w-64 h-36 object-cover rounded border border-gray-700"/>}
                                <div className="flex gap-2 items-center">
                                    <Input value={seoData.og_image || ''} onChange={e => setSeoData({...seoData, og_image: e.target.value})} className="bg-[#1a1a1a] flex-1" placeholder="Link ảnh Open Graph" />
                                    <div className="relative"><Button type="button" variant="outline" className="bg-[#1a1a1a]">Tải ảnh</Button><input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'seo')} className="absolute inset-0 opacity-0 cursor-pointer" /></div>
                                </div>
                            </div>
                            <Button onClick={handleSaveSeo} className="bg-amber-600"><Save className="w-4 h-4 mr-2"/>Cập nhật SEO</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-3 rounded-t-lg transition-colors whitespace-nowrap text-sm ${active ? 'bg-[#111] border-t border-x border-gray-800 text-cyan-400 font-bold' : 'text-gray-500 hover:text-gray-300'}`}>{icon} {label}</button>
);

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await supabase.auth.signInWithPassword({ email, password });
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
            <form onSubmit={handleLogin} className="w-full max-w-sm p-8 bg-[#111] border border-gray-800 rounded-lg space-y-4">
                <h2 className="text-center font-bold text-cyan-400 mb-4">SYSTEM LOGIN</h2>
                <Input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} className="bg-[#1a1a1a]" required/>
                <Input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} className="bg-[#1a1a1a]" required/>
                <Button type="submit" className="w-full bg-cyan-600">ĐĂNG NHẬP</Button>
            </form>
        </div>
    );
};

export default Admin;