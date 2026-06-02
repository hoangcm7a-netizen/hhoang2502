import { useState, useEffect } from 'react';
import { Play, Film, MonitorPlay, Gamepad2, X } from 'lucide-react';
import { supabase } from '../supabase';
import { useLanguage } from '../context/LanguageContext';

interface MediaItem { id: string; title: string; category: string; description: string; thumbnail_url: string; video_url: string; icon_name: string; }

const MediaSection = () => {
  const { language } = useLanguage();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      const { data } = await supabase.from('media_items').select('*').order('created_at', { ascending: true });
      if (data) setMediaItems(data);
    };
    fetchMedia();
  }, []);

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) return `https://www.youtube.com/embed/${match[2]}?autoplay=1`;
    return url;
  };

  const handlePlayClick = (url: string) => {
    if (url.includes('youtube') || url.includes('youtu.be')) setActiveVideo(getEmbedUrl(url)); 
    else window.open(url, '_blank');
  };

  return (
    <section id="media" className="min-h-screen py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-4 font-mono text-pink-500 glow-text drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">
            {language === 'vi' ? 'MEDIA - SẢN PHẨM SÁNG TẠO' : 'MEDIA - CREATIVE WORKS'}
          </h2>
          <p className="text-muted-foreground font-mono">
            {language === 'vi' ? 'Các video edit nổi bật trên TikTok & Social Media' : 'Featured video edits on TikTok & Social Media'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((item) => (
            <div key={item.id} className="group bg-card border border-border rounded-xl overflow-hidden hover:border-pink-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.1)] flex flex-col">
              <div className="relative aspect-video overflow-hidden cursor-pointer bg-black/50" onClick={() => handlePlayClick(item.video_url)}>
                <img src={item.thumbnail_url || '/placeholder.png'} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-pink-500/90 flex items-center justify-center text-white transform scale-50 group-hover:scale-100 transition-all duration-300"><Play className="w-8 h-8 ml-1" /></div>
                </div>
                <div className="absolute top-4 left-4"><span className="px-3 py-1 bg-black/70 backdrop-blur-sm text-pink-400 text-xs font-mono rounded border border-pink-500/30">{item.category}</span></div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-2 bg-pink-500/10 rounded-lg text-pink-500 shrink-0">
                    {item.icon_name === 'MonitorPlay' ? <MonitorPlay className="w-5 h-5" /> : item.icon_name === 'Gamepad2' ? <Gamepad2 className="w-5 h-5" /> : <Film className="w-5 h-5" />}
                  </div>
                  <div><h3 className="text-xl font-bold group-hover:text-pink-400 transition-colors">{item.title}</h3></div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">{item.description}</p>
                <div className="mt-6 h-1 w-0 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden border border-gray-800 shadow-2xl animate-fade-in">
                <button onClick={() => setActiveVideo(null)} className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-red-600 text-white rounded-full transition-colors"><X className="w-6 h-6" /></button>
                <iframe src={activeVideo} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
        </div>
      )}
    </section>
  );
};

export default MediaSection;