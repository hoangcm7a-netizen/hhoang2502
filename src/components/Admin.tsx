import * as React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Loader2, Save, Plus, Trash2, Edit3, Film, Code2, MessageSquare, LogOut, Lock, User, Phone, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Admin = () => {
    const [session, setSession] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'projects' | 'media' | 'hero' | 'about' | 'contact' | 'tech'>('hero');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');

    // --- STATES DỮ LIỆU ĐƠN (HERO, ABOUT) ---
    const [heroData, setHeroData] = useState<any>({ greetings: [], typing_speed: 40, line_spacing: 2.0 });
    const [aboutData, setAboutData] = useState<any>({ title: '', description_vi: '', description_en: '', profile_image_url: '', location: '', role_title: '' });

    // --- STATES DANH SÁCH (CRUD) ---
    const [projects, setProjects] = useState<any[]>([]);
    const [editingProject, setEditingProject] = useState<any>(null);
    
    const [mediaItems, setMediaItems] = useState<any[]>([]);
    const [editingMedia, setEditingMedia] = useState<any>(null);
    
    const [techs, setTechs] = useState<any[]>([]);
    const [editingTech, setEditingTech] = useState<any>(null);
    
    const [contacts, setContacts] = useState<any[]>([]);
    const [editingContact, setEditingContact] = useState<any>(null);

    // --- HIỆU ỨNG ĐĂNG NHẬP & FETCH DỮ LIỆU ---
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
                const { data } = await supabase.from('social_links').select('*').order('created_at');
                setContacts(data || []);
            }
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    // --- HÀM TẢI ẢNH CHUNG ---
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'media' | 'about') => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLoading(true); showMsg('Đang tải ảnh...', 'success');
        const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
        const { error } = await supabase.storage.from('media_images').upload(fileName, file);
        if (error) { showMsg('Lỗi tải ảnh: ' + error.message, 'error'); } 
        else {
            const { data } = supabase.storage.from('media_images').getPublicUrl(fileName);
            if (type === 'media') setEditingMedia({ ...editingMedia, thumbnail_url: data.publicUrl });
            else setAboutData({ ...aboutData, profile_image_url: data.publicUrl });
            showMsg('Tải ảnh thành công!');
        }
        setLoading(false);
    };

    // --- CÁC HÀM LƯU DỮ LIỆU ĐƠN ---
    const handleSaveHero = async () => { setLoading(true); await supabase.from('hero_settings').update(heroData).eq('id', 1); showMsg('Đã lưu Lời chào!'); setLoading(false); };
    const handleSaveAbout = async () => { setLoading(true); await supabase.from('about_me').update(aboutData).eq('id', 1); showMsg('Đã lưu Cá nhân!'); setLoading(false); };

    // --- CÁC HÀM LƯU DANH SÁCH (CRUD) ---
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
    const handleSaveContact = (e: React.FormEvent) => { e.preventDefault(); saveListItem('social_links', editingContact, setEditingContact); };

    // Hàm Xóa chung
    const deleteItem = async (table: string, id: string) => { 
        if(window.confirm('Bạn có chắc muốn xóa mục này?')) { 
            await supabase.from(table).delete().eq('id', id); fetchData(); showMsg('Đã xóa thành công!');
        } 
    };

    if (!session) return <LoginForm />;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-mono p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-[#111] p-6 rounded-lg border border-gray-800">
                    <div>
                        <h1 className="text-2xl font-bold text-cyan-400 flex items-center gap-2"><Lock className="w-6 h-6" /> ADMIN DASHBOARD</h1>
                        <p className="text-xs text-gray-500 mt-1">Logged in as: {session.user.email}</p>
                    </div>
                    <Button variant="destructive" onClick={() => supabase.auth.signOut()}><LogOut className="w-4 h-4 mr-2" /> Đăng xuất</Button>
                </div>

                <div className="h-[68px] mb-4">
                    {message && (
                        <div className={`p-4 rounded border flex justify-between ${messageType === 'error' ? 'bg-red-950/40 border-red-500 text-red-400' : 'bg-cyan-950/40 border-cyan-500 text-cyan-400'}`}>
                            {message} <button onClick={() => setMessage('')}>✕</button>
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto border-b border-gray-800 pb-2">
                    <TabButton active={activeTab === 'hero'} onClick={() => setActiveTab('hero')} icon={<MessageSquare className="w-4 h-4"/>} label="Lời chào" />
                    <TabButton active={activeTab === 'about'} onClick={() => setActiveTab('about')} icon={<User className="w-4 h-4"/>} label="Cá nhân" />
                    <TabButton active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} icon={<Code2 className="w-4 h-4"/>} label="Dự án" />
                    <TabButton active={activeTab === 'media'} onClick={() => setActiveTab('media')} icon={<Film className="w-4 h-4"/>} label="Media" />
                    <TabButton active={activeTab === 'tech'} onClick={() => setActiveTab('tech')} icon={<Wrench className="w-4 h-4"/>} label="Tech" />
                    <TabButton active={activeTab === 'contact'} onClick={() => setActiveTab('contact')} icon={<Phone className="w-4 h-4"/>} label="Liên hệ" />
                </div>

                {/* Content Area */}
                <div className="bg-[#111] border border-gray-800 rounded-lg p-6 min-h-[500px]">
                    
                    {/* TAB LỜI CHÀO */}
                    {activeTab === 'hero' && (
                        <div className="space-y-6 max-w-2xl">
                            <h3 className="text-xl text-cyan-400 mb-4"># Cấu hình Hero</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-sm text-gray-500">Tốc độ gõ (ms)</label><Input type="number" value={heroData.typing_speed} onChange={e => setHeroData({...heroData, typing_speed: parseInt(e.target.value)})} className="bg-[#1a1a1a]" /></div>
                                <div><label className="text-sm text-gray-500">Độ giãn dòng</label><Input type="number" step="0.1" value={heroData.line_spacing} onChange={e => setHeroData({...heroData, line_spacing: parseFloat(e.target.value)})} className="bg-[#1a1a1a]" /></div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-500">Nội dung Lời chào</label>
                                {heroData.greetings?.map((text: string, idx: number) => (
                                    <Input key={idx} value={text} onChange={(e) => { const newG = [...heroData.greetings]; newG[idx] = e.target.value; setHeroData({...heroData, greetings: newG}); }} className="bg-[#1a1a1a]" />
                                ))}
                            </div>
                            <Button onClick={handleSaveHero} disabled={loading} className="bg-cyan-600">Lưu thay đổi</Button>
                        </div>
                    )}

                    {/* TAB CÁ NHÂN */}
                    {activeTab === 'about' && (
                        <div className="space-y-4 max-w-3xl">
                            <h3 className="text-xl text-cyan-400 mb-4"># Giới thiệu bản thân</h3>
                            <div className="flex gap-4 mb-4 items-center">
                                <img src={aboutData.profile_image_url || '/placeholder.png'} className="w-20 h-20 rounded-full object-cover border-2 border-cyan-500" alt="Avatar"/>
                                <div className="relative"><Button variant="outline" className="bg-[#1a1a1a]">Tải ảnh lên</Button><input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'about')} className="absolute inset-0 opacity-0 cursor-pointer" /></div>
                            </div>
                            <div><label className="text-xs text-gray-500">Tiêu đề</label><Input value={aboutData.title || ''} onChange={e => setAboutData({...aboutData, title: e.target.value})} className="bg-[#1a1a1a]" /></div>
                            <div><label className="text-xs text-gray-500">Tiếng Việt</label><Textarea value={aboutData.description_vi || ''} onChange={e => setAboutData({...aboutData, description_vi: e.target.value})} className="bg-[#1a1a1a]" rows={3} /></div>
                            <div><label className="text-xs text-gray-500">Tiếng Anh</label><Textarea value={aboutData.description_en || ''} onChange={e => setAboutData({...aboutData, description_en: e.target.value})} className="bg-[#1a1a1a]" rows={3} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-xs text-gray-500">Chức danh</label><Input value={aboutData.role_title || ''} onChange={e => setAboutData({...aboutData, role_title: e.target.value})} className="bg-[#1a1a1a]" /></div>
                                <div><label className="text-xs text-gray-500">Địa điểm</label><Input value={aboutData.location || ''} onChange={e => setAboutData({...aboutData, location: e.target.value})} className="bg-[#1a1a1a]" /></div>
                            </div>
                            <Button onClick={handleSaveAbout} disabled={loading} className="bg-cyan-600 mt-2">Lưu Thông Tin</Button>
                        </div>
                    )}

                    {/* TAB DỰ ÁN */}
                    {activeTab === 'projects' && (
                        <div>
                            {!editingProject ? (
                                <div className="space-y-4">
                                    <Button onClick={() => setEditingProject({ name: '', description_vi: '', description_en: '', technologies: '', github_url: '', demo_url: '', demo_label: 'Watch Video' })} className="bg-green-600"><Plus className="w-4 h-4 mr-2" /> Thêm Dự án</Button>
                                    <div className="grid gap-3">
                                        {projects.map(p => (
                                            <div key={p.id} className="p-4 bg-[#1a1a1a] rounded flex justify-between items-center border border-gray-800">
                                                <div><p className="font-bold text-white">{p.name}</p><p className="text-xs text-gray-500">{p.technologies?.join(', ')}</p></div>
                                                <div className="flex gap-2"><Button size="icon" variant="ghost" onClick={() => setEditingProject(p)}><Edit3 className="w-4 h-4"/></Button><Button size="icon" variant="ghost" className="text-red-500" onClick={() => deleteItem('projects', p.id)}><Trash2 className="w-4 h-4"/></Button></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSaveProject} className="space-y-3 max-w-2xl">
                                    <h3 className="text-xl text-green-400 mb-4">{editingProject.id ? 'Sửa dự án' : 'Thêm dự án mới'}</h3>
                                    <Input placeholder="Tên dự án" value={editingProject.name || ''} onChange={e => setEditingProject({...editingProject, name: e.target.value})} className="bg-[#1a1a1a]" required/>
                                    <Textarea placeholder="Mô tả Tiếng Việt" value={editingProject.description_vi || ''} onChange={e => setEditingProject({...editingProject, description_vi: e.target.value})} className="bg-[#1a1a1a]" />
                                    <Textarea placeholder="Mô tả Tiếng Anh" value={editingProject.description_en || ''} onChange={e => setEditingProject({...editingProject, description_en: e.target.value})} className="bg-[#1a1a1a]" />
                                    <Input placeholder="Công nghệ (VD: React, Node.js)" value={editingProject.technologies || ''} onChange={e => setEditingProject({...editingProject, technologies: e.target.value})} className="bg-[#1a1a1a]" />
                                    <Input placeholder="Link GitHub" value={editingProject.github_url || ''} onChange={e => setEditingProject({...editingProject, github_url: e.target.value})} className="bg-[#1a1a1a]" />
                                    <Input placeholder="Link Demo/Video" value={editingProject.demo_url || ''} onChange={e => setEditingProject({...editingProject, demo_url: e.target.value})} className="bg-[#1a1a1a]" />
                                    <div className="flex gap-2 mt-4"><Button type="submit" disabled={loading} className="bg-green-600">Lưu</Button><Button type="button" variant="outline" onClick={() => setEditingProject(null)}>Hủy</Button></div>
                                </form>
                            )}
                        </div>
                    )}

                    {/* TAB MEDIA */}
                    {activeTab === 'media' && (
                        <div>
                            {!editingMedia ? (
                                <div className="space-y-4">
                                    <Button onClick={() => setEditingMedia({ title: '', category: '', description: '', thumbnail_url: '', video_url: '', icon_name: 'Film' })} className="bg-pink-600"><Plus className="w-4 h-4 mr-2" /> Thêm Media</Button>
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
                                    <h3 className="text-xl text-pink-400 mb-4">{editingMedia.id ? 'Sửa Media' : 'Thêm Media mới'}</h3>
                                    <Input placeholder="Tiêu đề" value={editingMedia.title || ''} onChange={e => setEditingMedia({...editingMedia, title: e.target.value})} className="bg-[#1a1a1a]" required/>
                                    <Input placeholder="Thể loại" value={editingMedia.category || ''} onChange={e => setEditingMedia({...editingMedia, category: e.target.value})} className="bg-[#1a1a1a]" />
                                    <Textarea placeholder="Mô tả" value={editingMedia.description || ''} onChange={e => setEditingMedia({...editingMedia, description: e.target.value})} className="bg-[#1a1a1a]" />
                                    <div className="flex gap-2 items-center">
                                        <Input placeholder="Link Thumbnail" value={editingMedia.thumbnail_url || ''} onChange={e => setEditingMedia({...editingMedia, thumbnail_url: e.target.value})} className="bg-[#1a1a1a] flex-1" />
                                        <div className="relative"><Button type="button" variant="outline" className="bg-[#1a1a1a]">Tải ảnh</Button><input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'media')} className="absolute inset-0 opacity-0 cursor-pointer" /></div>
                                    </div>
                                    <Input placeholder="Link Video (Youtube/TikTok)" value={editingMedia.video_url || ''} onChange={e => setEditingMedia({...editingMedia, video_url: e.target.value})} className="bg-[#1a1a1a]" />
                                    <div className="flex gap-2 mt-4"><Button type="submit" disabled={loading} className="bg-pink-600">Lưu</Button><Button type="button" variant="outline" onClick={() => setEditingMedia(null)}>Hủy</Button></div>
                                </form>
                            )}
                        </div>
                    )}

                    {/* TAB TECH STACK */}
                    {activeTab === 'tech' && (
                        <div>
                            {!editingTech ? (
                                <div className="space-y-4">
                                    <Button onClick={() => setEditingTech({ name: '', category: 'Dev', icon_name: 'Code' })} className="bg-purple-600"><Plus className="w-4 h-4 mr-2" /> Thêm Công Nghệ</Button>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {techs.map(t => (
                                            <div key={t.id} className="p-4 bg-[#1a1a1a] border border-gray-800 rounded flex justify-between items-center">
                                                <div><p className="font-bold text-white">{t.name}</p><p className="text-xs text-gray-500">{t.category}</p></div>
                                                <div className="flex gap-2">
                                                    <Button size="icon" variant="ghost" onClick={() => setEditingTech(t)}><Edit3 className="w-4 h-4"/></Button>
                                                    <Button size="icon" variant="ghost" className="text-red-500" onClick={() => deleteItem('tech_stack', t.id)}><Trash2 className="w-4 h-4"/></Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSaveTech} className="space-y-3 max-w-sm">
                                    <h3 className="text-xl text-purple-400 mb-4">{editingTech.id ? 'Sửa Tech' : 'Thêm Tech mới'}</h3>
                                    <div><label className="text-xs text-gray-500">Tên (VD: React, Figma)</label><Input value={editingTech.name || ''} onChange={e => setEditingTech({...editingTech, name: e.target.value})} className="bg-[#1a1a1a]" required/></div>
                                    <div><label className="text-xs text-gray-500">Nhóm (Dev / Media / Tools)</label><Input value={editingTech.category || ''} onChange={e => setEditingTech({...editingTech, category: e.target.value})} className="bg-[#1a1a1a]" /></div>
                                    <div className="flex gap-2 mt-4"><Button type="submit" disabled={loading} className="bg-purple-600">Lưu</Button><Button type="button" variant="outline" onClick={() => setEditingTech(null)}>Hủy</Button></div>
                                </form>
                            )}
                        </div>
                    )}

                    {/* TAB CONTACT (LIÊN HỆ ĐỘNG) */}
                    {activeTab === 'contact' && (
                        <div>
                            {!editingContact ? (
                                <div className="space-y-4">
                                    <Button onClick={() => setEditingContact({ platform: '', display_text: '', url: '', icon_name: 'Link' })} className="bg-blue-600"><Plus className="w-4 h-4 mr-2" /> Thêm Liên Hệ Mạng Xã Hội</Button>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {contacts.map(c => (
                                            <div key={c.id} className="p-4 bg-[#1a1a1a] border border-gray-800 rounded flex justify-between items-center">
                                                <div className="overflow-hidden pr-4">
                                                    <p className="font-bold text-white text-sm">{c.platform} • {c.display_text}</p>
                                                    <p className="text-xs text-gray-500 truncate">{c.url}</p>
                                                </div>
                                                <div className="flex gap-2 shrink-0">
                                                    <Button size="icon" variant="ghost" onClick={() => setEditingContact(c)}><Edit3 className="w-4 h-4"/></Button>
                                                    <Button size="icon" variant="ghost" className="text-red-500" onClick={() => deleteItem('social_links', c.id)}><Trash2 className="w-4 h-4"/></Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSaveContact} className="space-y-3 max-w-lg">
                                    <h3 className="text-xl text-blue-400 mb-4">{editingContact.id ? 'Sửa Liên Hệ' : 'Thêm Liên Hệ mới'}</h3>
                                    <div><label className="text-xs text-gray-500">Nền tảng (VD: Facebook, Email)</label><Input value={editingContact.platform || ''} onChange={e => setEditingContact({...editingContact, platform: e.target.value})} className="bg-[#1a1a1a]" required/></div>
                                    <div><label className="text-xs text-gray-500">Chữ hiển thị (VD: hoangcm7a, Huy Hoàng)</label><Input value={editingContact.display_text || ''} onChange={e => setEditingContact({...editingContact, display_text: e.target.value})} className="bg-[#1a1a1a]" required/></div>
                                    <div><label className="text-xs text-gray-500">Link URL hoặc Mailto:</label><Input value={editingContact.url || ''} onChange={e => setEditingContact({...editingContact, url: e.target.value})} className="bg-[#1a1a1a]" required/></div>
                                    <div><label className="text-xs text-gray-500">Tên Icon (Facebook, Github, Tiktok, Instagram, Youtube, Subtitles, Mail)</label><Input value={editingContact.icon_name || ''} onChange={e => setEditingContact({...editingContact, icon_name: e.target.value})} className="bg-[#1a1a1a]" /></div>
                                    <div className="flex gap-2 mt-4"><Button type="submit" disabled={loading} className="bg-blue-600">Lưu</Button><Button type="button" variant="outline" onClick={() => setEditingContact(null)}>Hủy</Button></div>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Component UI Phụ
const TabButton = ({ active, onClick, icon, label }: any) => (
    <button onClick={onClick} className={`flex items-center gap-2 px-6 py-3 rounded-t-lg transition-colors whitespace-nowrap ${active ? 'bg-[#111] border-t border-x border-gray-800 text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}>
        {icon} {label}
    </button>
);

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError('Sai email hoặc mật khẩu!');
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
            <div className="w-full max-w-md p-8 bg-[#111] border border-gray-800 rounded-lg shadow-2xl space-y-6">
                <div className="text-center">
                    <div className="inline-block p-3 bg-cyan-500/10 rounded-full mb-4"><Code2 className="w-8 h-8 text-cyan-400" /></div>
                    <h2 className="text-2xl font-bold text-white font-mono tracking-widest">SYSTEM ACCESS</h2>
                </div>
                {error && <p className="bg-red-500/10 text-red-500 p-3 rounded text-sm text-center border border-red-500/50">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <Input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} className="bg-[#1a1a1a] text-white" />
                    <Input type="password" placeholder="Mật khẩu" onChange={e => setPassword(e.target.value)} className="bg-[#1a1a1a] text-white" />
                    <Button type="submit" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-700 py-6">{loading ? <Loader2 className="animate-spin" /> : 'XÁC NHẬN'}</Button>
                </form>
            </div>
        </div>
    );
};

export default Admin;