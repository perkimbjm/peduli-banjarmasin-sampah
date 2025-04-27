import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Search, Heart, Bookmark, Share2, Volume2, VolumeX, MessageCircle, ChevronLeft, ChevronRight, Filter, Clock, TrendingUp, Star, ArrowUp, X } from "lucide-react";
import PaperPlaneIcon from "@/icons/PaperPlane";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useInView } from "react-intersection-observer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Skeleton component with shimmer effect
const PostSkeleton = () => (
  <Card className="overflow-hidden">
    <CardHeader className="p-4">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-0">
      <div className="aspect-square bg-gray-200 animate-pulse" />
    </CardContent>
    <CardFooter className="p-4 space-y-4">
      <div className="flex justify-between w-full">
        <div className="flex space-x-4">
          <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
      </div>
    </CardFooter>
  </Card>
);

// MediaCarousel component with aspect ratio support
const MediaCarousel = ({ 
  media, 
  aspectRatio = "1:1",
  onDoubleTap,
  isModal = false
}: { 
  media: string[]; 
  aspectRatio?: "1:1" | "4:5" | "16:9";
  onDoubleTap?: () => void;
  isModal?: boolean;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const lastTapTime = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const aspectRatioClasses = {
    "1:1": "aspect-square",
    "4:5": "aspect-[4/5]",
    "16:9": "aspect-video"
  };

  const handleDoubleTap = (e: React.MouseEvent | React.TouchEvent) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime.current;
    
    if (tapLength < 300 && tapLength > 0) {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 1000);
      onDoubleTap?.();
    }
    
    lastTapTime.current = currentTime;
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setError(true);
    setIsLoading(false);
  };

  // Preload next image
  useEffect(() => {
    if (media.length > 1) {
      const nextIndex = (currentIndex + 1) % media.length;
      const img = new Image();
      img.src = media[nextIndex];
    }
  }, [currentIndex, media]);

  return (
    <div 
      ref={containerRef}
      className={`relative ${aspectRatioClasses[aspectRatio]} group`}
      onClick={handleDoubleTap}
      onTouchEnd={handleDoubleTap}
      role="button"
      tabIndex={0}
      aria-label="Double tap to like"
    >
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      {showHeart && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Heart className="w-24 h-24 text-white fill-current animate-scale-in-out" />
        </div>
      )}
      <div className="relative h-full w-full">
        <img
          src={error ? "/images/default-thumbnail.jpg" : media[currentIndex]}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
      
      {media.length > 1 && (
        <>
          <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
            {currentIndex + 1}/{media.length}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={e => {
              e.stopPropagation();
              prevSlide();
            }}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={e => {
              e.stopPropagation();
              nextSlide();
            }}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {media.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  idx === currentIndex
                    ? 'bg-white shadow-lg scale-125'
                    : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// VideoPlayer component with progress bar
const VideoPlayer = ({ 
  src, 
  isModal = false 
}: { 
  src: string; 
  isModal?: boolean;
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  return (
    <div className={`relative ${isModal ? 'aspect-[4/5]' : 'aspect-square'}`}>
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        controls={false}
        playsInline
        loop
        muted={isMuted}
        autoPlay
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
      />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
        <div 
          className="h-full bg-white transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="absolute bottom-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/20 hover:bg-black/40 text-white rounded-full"
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
        </Button>
      </div>
    </div>
  );
};

// Caption component with Read More
const Caption = ({ 
  text, 
  author 
}: { 
  text: string; 
  author: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseInt(getComputedStyle(textRef.current).lineHeight);
      const maxHeight = lineHeight * 2; // 3 lines
      setShowReadMore(textRef.current.scrollHeight > maxHeight);
    }
  }, [text]);

  return (
    <div className="space-y-1">
      <p 
        ref={textRef}
        className={`text-sm text-justify whitespace-pre-line transition-all duration-300 ${
          !isExpanded ? 'line-clamp-3' : ''
        }`}
      >
        <span className="font-medium">{author}</span>{" "}
        {text}
      </p>
      {showReadMore && (
        <button
          className="text-sm text-gray-500 hover:text-gray-700"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '' : 'selengkapnya'}
        </button>
      )}
    </div>
  );
};

// Tipe data untuk konten edukasi
interface EducationPost {
  id: string;
  type: 'image' | 'video';
  media: string[];
  caption: string;
  timestamp: Date;
  category: string;
  likes: number;
  isLiked: boolean;
  isBookmarked: boolean;
  author: {
    name: string;
    avatar: string;
  };
}

// Data dummy untuk konten edukasi
const dummyEducationContent: EducationPost[] = [
  {
    id: "1",
    type: "image",
    media: [
      "/images/edu/composting-1.jpg",
      "/images/edu/composting-2.jpg",
    ],
    caption: "Mari belajar cara membuat kompos dari sampah dapur! Dengan metode sederhana ini, kita bisa mengubah sampah organik menjadi pupuk berkualitas. Swipe untuk melihat langkah-langkahnya. 🌱♻️ #KomposCerdas #NolSampah #PeduliLingkungan",
    timestamp: new Date(2024, 2, 15, 10, 30),
    category: "composting",
    likes: 245,
    isLiked: false,
    isBookmarked: false,
    author: {
      name: "Tim Peduli Sampah",
      avatar: "/images/avatars/team-1.jpg"
    }
  },
  {
    id: "2",
    type: "video",
    media: ["/videos/recycling-tutorial.mp4"],
    caption: "Tutorial singkat cara mendaur ulang botol plastik menjadi pot tanaman yang cantik! 🌿 #DaurUlang #KreatifRamahLingkungan",
    timestamp: new Date(2024, 2, 14, 15, 45),
    category: "recycling",
    likes: 367,
    isLiked: false,
    isBookmarked: false,
    author: {
      name: "Kreasi Daur Ulang",
      avatar: "/images/avatars/team-2.jpg"
    }
  }
];

// PostModal component for desktop view
const PostModal = ({ 
  post, 
  isOpen, 
  onClose 
}: { 
  post: EducationPost; 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 rounded-full bg-white/90 hover:bg-red-100 text-gray-700 hover:text-red-500 shadow-md p-2 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex">
          <div className="w-2/3">
            {post.type === 'image' ? (
              <MediaCarousel 
                media={post.media} 
                aspectRatio="4:5"
                onDoubleTap={handleLike}
                isModal
              />
            ) : (
              <VideoPlayer src={post.media[0]} isModal />
            )}
          </div>
          <div className="w-1/3 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-medium">{post.author.name}</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Caption text={post.caption} author={post.author.name} />
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLike}
                  className={isLiked ? "text-red-500" : ""}
                >
                  <Heart className={isLiked ? "fill-current" : ""} />
                </Button>
                <Button variant="ghost" size="icon"
                onClick={() => {
                            setSelectedPostId(post.id);
                            setShareModalOpen(true);
                          }}>
                  <PaperPlaneIcon className="w-5 h-5" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className={post.isBookmarked ? "text-yellow-500" : ""}
              >
                <Bookmark className={post.isBookmarked ? "fill-current" : ""} />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ScrollToTop component
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  if (!isVisible) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed bottom-4 right-4 rounded-full bg-white/90 hover:bg-white"
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
  );
};

const Edukasi = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<EducationPost[]>(dummyEducationContent);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<"all" | "bookmarks" | "images" | "videos">("all");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "loved">("latest");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  
  const eduCategories = [
    { id: "all", name: "Semua" },
    { id: "composting", name: "Komposting" },
    { id: "recycling", name: "Daur Ulang" },
    { id: "reduction", name: "Pengurangan Sampah (Reduce)" },
    { id: "eco-lifestyle", name: "Gaya Hidup Ramah Lingkungan" },
    { id: "reuse", name: "Gunakan Kembali (Reuse)" },
    { id: "recycle", name: "Daur Ulang" },
    { id: "bank", name: "Bank Sampah" },
    { id: "segregation", name: "Pemilahan" },
    { id: "eco-activism", name: "Aksi Sosial"},
    { id: "awareness", name: "Kesadaran" },
    { id: "policy", name: "Kebijakan & Regulasi" },
    { id: "community", name: "Peran Masyarakat" },
    { id: "other", name: "Lainnya" },
  ];
  
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Filter and sort posts
  const filteredAndSortedContent = posts
    .filter(post => {
      const matchesCategory = activeCategory === "all" || post.category === activeCategory;
      const matchesSearch = post.caption.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = 
        activeFilter === "all" ||
        (activeFilter === "bookmarks" && post.isBookmarked) ||
        (activeFilter === "images" && post.type === "image") ||
        (activeFilter === "videos" && post.type === "video");
      return matchesCategory && matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return b.timestamp.getTime() - a.timestamp.getTime();
        case "popular":
          return b.likes - a.likes;
        case "loved":
          return (b.isLiked ? 1 : 0) - (a.isLiked ? 1 : 0);
        default:
          return 0;
      }
    });
  
  // Format timestamp to relative time
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} menit yang lalu`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} jam yang lalu`;
    } else {
      return format(date, "d MMMM yyyy", { locale: id });
    }
  };

  // Handle post actions
  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleBookmark = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const handleShare = (postId: string) => {
    // Implementasi sharing functionality
    console.log("Sharing post:", postId);
  };

  // Helper: apakah infinite scroll diaktifkan?
  const isInfiniteScrollEnabled = activeFilter === "all";

  // Load more posts when scrolling
  useEffect(() => {
    if (!isInfiniteScrollEnabled) return; // hanya aktif jika tanpa filter/bookmark
    if (inView && !loading) {
      setLoading(true);
      // Simulate API call to load more posts
      setTimeout(() => {
        // Jangan ubah tanggal konten
        const newPosts = [...dummyEducationContent].map(post => ({
          ...post,
          id: `${post.id}-${page}`
        }));
        setPosts(prev => [...prev, ...newPosts]);
        setPage(prev => prev + 1);
        setLoading(false);
      }, 1000);
    }
  }, [inView, page, loading, isInfiniteScrollEnabled]);

  const [selectedPost, setSelectedPost] = useState<EducationPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-100 dark:bg-gray-900">
        {/* Hero Section */}
        <section className="bg-peduli-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">Edukasi Pengelolaan Sampah</h1>
              <p className="text-lg text-white/90 mb-8">
                Pelajari cara mengelola sampah dengan benar melalui konten edukatif yang kami sediakan.
              </p>
              <div className="max-w-xl mx-auto relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari materi edukasi..."
                  className="pl-10 bg-white text-gray-900 border-0 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-peduli-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Content Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filter and Sort Bar */}
            <div className="z-10 bg-white dark:bg-gray-900 py-4 mb-8">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <Button
                    variant={activeFilter === "all" ? "default" : "outline"}
                    onClick={() => setActiveFilter("all")}
                    className="whitespace-nowrap"
                  >
                    Semua
                  </Button>
                  <Button
                    variant={activeFilter === "bookmarks" ? "default" : "outline"}
                    onClick={() => setActiveFilter("bookmarks")}
                    className="whitespace-nowrap"
                  >
                    <Bookmark className="w-4 h-4 mr-2" />
                    Bookmarks
                  </Button>
                  <Button
                    variant={activeFilter === "images" ? "default" : "outline"}
                    onClick={() => setActiveFilter("images")}
                    className="whitespace-nowrap"
                  >
                    Gambar
                  </Button>
                  <Button
                    variant={activeFilter === "videos" ? "default" : "outline"}
                    onClick={() => setActiveFilter("videos")}
                    className="whitespace-nowrap"
                  >
                    Video
                  </Button>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Urutkan: {sortBy === "latest" ? "Terbaru" : sortBy === "popular" ? "Populer" : "Favorit"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSortBy("latest")}>
                      <Clock className="w-4 h-4 mr-2" />
                      Terbaru
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("popular")}>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Populer
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("loved")}>
                      <Star className="w-4 h-4 mr-2" />
                      Favorit
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {eduCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  className={activeCategory === category.id ? "bg-peduli-600 hover:bg-peduli-700" : ""}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
            
            {/* Posts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8">
              {filteredAndSortedContent.map((post) => (
                <Card 
                  key={post.id} 
                  className="overflow-hidden cursor-pointer"
                  onClick={() => {
                    if (window.innerWidth >= 1024) {
                      setSelectedPost(post);
                      setIsModalOpen(true);
                    }
                  }}
                >
                  <CardHeader className="p-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full object-cover"
                        loading="lazy"
                      />
                      <div>
                        <CardTitle className="text-sm font-medium">{post.author.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    {post.type === 'image' ? (
                      <MediaCarousel media={post.media} />
                    ) : (
                      <VideoPlayer src={post.media[0]} />
                    )}
                  </CardContent>
                  
                  <CardFooter className="flex flex-col p-4 space-y-4">
                    <div className="flex justify-between w-full">
                      <div className="flex space-x-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(post.id);
                          }}
                          className={post.isLiked ? "text-red-500" : ""}
                        >
                          <Heart className={post.isLiked ? "fill-current" : ""} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPostId(post.id);
                            setShareModalOpen(true);
                          }}
                        >
                          <PaperPlaneIcon className="w-5 h-5" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark(post.id);
                        }}
                        className={post.isBookmarked ? "text-yellow-500" : ""}
                      >
                        <Bookmark className={post.isBookmarked ? "fill-current" : ""} />
                      </Button>
                    </div>
                    
                    <Caption text={post.caption} author={post.author.name} />
                    
                    <div className="flex mt-2 mx-6">
                      <span className="text-xs text-gray-500 mr-3">
                        {formatTimeAgo(post.timestamp)}
                      </span>
                      <Badge variant="secondary">
                        {eduCategories.find(cat => cat.id === post.category)?.name}
                      </Badge>
                      
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Loading indicator */}
            <div ref={ref} className="w-full py-8 text-center">
              {loading && isInfiniteScrollEnabled && <PostSkeleton />}
            </div>

            {/* Share Modal */}
            <ShareModal
              isOpen={shareModalOpen}
              onClose={() => {
                setShareModalOpen(false);
                setSelectedPostId(null);
              }}
              postId={selectedPostId || ""}
            />

            {/* Post Modal */}
            {selectedPost && (
              <PostModal
                post={selectedPost}
                isOpen={isModalOpen}
                onClose={() => {
                  setIsModalOpen(false);
                  setSelectedPost(null);
                }}
              />
            )}

            {/* Scroll to Top */}
            <ScrollToTop />

            {filteredAndSortedContent.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Tidak ada konten yang sesuai dengan filter yang dipilih.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setActiveCategory("all");
                    setSearchQuery("");
                    setActiveFilter("all");
                  }}
                >
                  Reset Filter
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
      
    </div>
  );
};

// ShareModal component
const ShareModal = ({ isOpen, onClose, postId }: { isOpen: boolean; onClose: () => void; postId: string }) => {
  const shareOptions = [
    { name: "Copy Link", icon: "🔗", action: () => navigator.clipboard.writeText(window.location.href + postId) }
  ];

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: "Bagikan Konten Edukasi",
        text: "Lihat konten edukasi pengelolaan sampah ini!",
        url: window.location.href + postId,
      });
    } catch (err) {
      console.log("Native sharing not supported");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bagikan Konten</DialogTitle>
          <DialogDescription>
            Pilih salah satu opsi di bawah untuk membagikan konten ini.
         </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {shareOptions.map((option) => (
            <Button
              key={option.name}
              variant="outline"
              className="flex items-center justify-center gap-2 col-span-2"
              onClick={option.action}
            >
              <span>{option.icon}</span>
              {option.name}
            </Button>
          ))}
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 col-span-2"
            onClick={handleNativeShare}
          >
            <span>📤</span>
            Share via...
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Edukasi;
