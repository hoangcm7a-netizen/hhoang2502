import { useState } from 'react';
import { Play, Film, MonitorPlay, Gamepad2, Newspaper, Youtube } from 'lucide-react';

interface MediaItem {
  id: number;
  title: string;
  category: string;
  description: string;
  thumbnail: string; 
  videoUrl: string;
  icon: any;
}

const mediaItems: MediaItem[] = [
  {
    id: 1,
    title: "Bóng chuyền Highlights",
    category: "Sports / Meme",
    description: "Những pha bóng hài hước và meme giải trí trên sân bóng.",
    thumbnail: "/bongchuyen.png",
    videoUrl: "https://www.tiktok.com/@hoanghuy_2005/video/7513411513151982866?is_from_webapp=1&sender_device=pc&web_id=7567769378817672724",
    icon: MonitorPlay
  },
  {
    id: 2,
    title: "Gaming Funny Moments",
    category: "Gaming / Entertainment",
    description: "Tổng hợp khoảnh khắc 'troll' game và giải trí vui nhộn.",
    thumbnail: "/game.png",
    videoUrl: "https://www.tiktok.com/@hoanghuy_2005/video/7536007141023419656?is_from_webapp=1&sender_device=pc&web_id=7567769378817672724",
    icon: Gamepad2
  },
  {
    id: 3,
    title: "Cinematic Movie Edit",
    category: "Movie / Beat-sync",
    description: "Edit phim phong cách ngầu, giật giật, cắt chuẩn theo beat nhạc.",
    thumbnail: "/phim(1).png",
    videoUrl: "https://www.tiktok.com/@hoanghuy_2005/video/7570272438563425543?is_from_webapp=1&sender_device=pc&web_id=7567769378817672724",
    icon: Film
  },
  {
    id: 4,
    title: "Cinematic Movie Edit",
    category: "Movie / Beat-sync",
    description: "Edit phim phong cách ngầu, giật giật, cắt chuẩn theo beat nhạc.",
    thumbnail: "/phim(2).png",
    videoUrl: "https://www.tiktok.com/@hoanghuy_2005/video/7545500008825638162?is_from_webapp=1&sender_device=pc&web_id=7567769378817672724",
    icon: Film
  },
  {
    id: 5,
    title: "News",
    category: "Movie / Beat-sync",
    description: "Edit tin tức đang nổi.",
    thumbnail: "/tintuc.png",
    videoUrl: "https://www.tiktok.com/@hoanghuy_2005/video/7530519289070193927?is_from_webapp=1&sender_device=pc&web_id=7567769378817672724",
    icon: Newspaper
  },
  {
    id: 6,
    title: "Cinematic Movie Edit",
    category: "Movie / Beat-sync",
    description: "Edit phim phong cách ngầu, giật giật, cắt chuẩn theo beat nhạc.",
    thumbnail: "/phim.png",
    videoUrl: "https://www.tiktok.com/@hoanghuy_2005/video/7439387122961878290?is_from_webapp=1&sender_device=pc&web_id=7567769378817672724",
    icon: Film
  },
  {
    id: 7,
    title: "Movie Review",
    category: "Review",
    description: "Tóm tắt nội dung phim One Piece Live Action 2025.",
    thumbnail: "/reviewphim.png",
    videoUrl: "https://www.youtube.com/watch?v=EM38H2zv0y0&t=79s",
    icon: Youtube
  },
  {
    id: 8,
    title: "Movie Review",
    category: "Review",
    description: "Tóm tắt nội dung phim I, The Executioner AKA Veteran 2.",
    thumbnail: "/reviewphim(1).png",
    videoUrl: "https://www.youtube.com/watch?v=VYkHclkIE60",
    icon: Youtube
  },
  {
    id: 9,
    title: "Movie Review",
    category: "Review",
    description: "Tóm tắt nội dung phim Agatha All Along.",
    thumbnail: "/reviewphim(2).png",
    videoUrl: "https://www.youtube.com/watch?v=EWDFTU-ETFE&t=76s",
    icon: Youtube
  }
];

const MediaSection = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="media" className="min-h-screen py-20 bg-background">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-4 font-mono media-accent glow-media">
          {'MEDIA - SẢN PHẨM SÁNG TẠO'}
        </h2>
        <p className="text-muted-foreground mb-12 font-mono">
          Các video edit nổi bật trên TikTok & Social Media
        </p>

        {/* Grid hiển thị các video dạng thẻ (Card) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mediaItems.map((item) => (
            <a 
              key={item.id}
              href={item.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/20 block"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {}
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={item.thumbnail} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-75">
                    <Play className="w-6 h-6 text-background fill-current ml-1" />
                  </div>
                </div>

                {}
                <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm border border-border px-3 py-1 rounded-full text-xs font-mono font-bold text-primary">
                  {item.category}
                </div>
              </div>

              {}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>

                {}
                <div className={`h-1 mt-4 rounded-full bg-gradient-to-r from-primary to-transparent transform origin-left transition-all duration-500 ${hoveredId === item.id ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaSection;