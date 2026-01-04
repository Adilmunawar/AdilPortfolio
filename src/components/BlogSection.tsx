'use client';
import { useState, useRef, MouseEvent, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ArrowRight, Rss } from 'lucide-react';
import Image from 'next/image';
import blogData from '@/lib/blog-data.json';
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';

type BlogPost = (typeof blogData)[0];

const BlogSection = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for horizontal card list dragging
  const hScrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHDragging, setIsHDragging] = useState(false);
  const [hStartX, setHStartX] = useState(0);
  const [hScrollLeft, setHScrollLeft] = useState(0);

  // State for vertical modal dragging
  const vScrollContainerRef = useRef<HTMLDivElement>(null);
  const [isVDragging, setIsVDragging] = useState(false);
  const [vStartY, setVStartY] = useState(0);
  const [vScrollTop, setVScrollTop] = useState(0);

  useEffect(() => {
    // Cleanup user-select style on component unmount
    return () => {
      document.body.style.userSelect = '';
    };
  }, []);

  const handleReadMore = (post: BlogPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  // Horizontal Drag Handlers
  const onHMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!hScrollContainerRef.current) return;
    setIsHDragging(true);
    document.body.style.userSelect = 'none';
    setHStartX(e.pageX - hScrollContainerRef.current.offsetLeft);
    setHScrollLeft(hScrollContainerRef.current.scrollLeft);
  };

  const onHMouseLeave = () => {
    if (isHDragging) {
      setIsHDragging(false);
      document.body.style.userSelect = '';
    }
  };

  const onHMouseUp = () => {
    setIsHDragging(false);
    document.body.style.userSelect = '';
  };

  const onHMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isHDragging || !hScrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - hScrollContainerRef.current.offsetLeft;
    const walk = (x - hStartX) * 2; // scroll-fast
    hScrollContainerRef.current.scrollLeft = hScrollLeft - walk;
  };

  // Vertical Drag Handlers for Modal
  const onVMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    const scrollAreaViewport = vScrollContainerRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (!scrollAreaViewport) return;
    setIsVDragging(true);
    document.body.style.userSelect = 'none';
    setVStartY(e.pageY - (scrollAreaViewport as HTMLElement).offsetTop);
    setVScrollTop(scrollAreaViewport.scrollTop);
  };

  const onVMouseLeave = () => {
    if (isVDragging) {
      setIsVDragging(false);
      document.body.style.userSelect = '';
    }
  };

  const onVMouseUp = () => {
    setIsVDragging(false);
    document.body.style.userSelect = '';
  };

  const onVMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const scrollAreaViewport = vScrollContainerRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (!isVDragging || !scrollAreaViewport) return;
    e.preventDefault();
    const y = e.pageY - (scrollAreaViewport as HTMLElement).offsetTop;
    const walk = (y - vStartY) * 2; // scroll-fast
    scrollAreaViewport.scrollTop = vScrollTop - walk;
  };


  return (
    <>
      <section id="blog" className="py-20 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-block mb-8">
              <span className="text-frost-cyan text-sm font-semibold tracking-widest uppercase bg-cyber-dark/50 px-6 py-3 rounded-full border border-neon-cyan/30 backdrop-blur-sm">
                <Rss className="inline w-4 h-4 mr-2 text-neon-cyan" />
                From the Desk of a Developer
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold mb-8 text-gradient-slow drop-shadow-2xl">
              My Articles
            </h2>
            <p className="text-xl text-frost-cyan max-w-4xl mx-auto leading-relaxed">
              Sharing insights on web development, cybersecurity, and the art of code.
            </p>
          </div>

          <div className="relative">
            <div 
              ref={hScrollContainerRef}
              className={cn(
                "flex space-x-8 pb-8 overflow-x-auto custom-scrollbar cursor-grab",
                isHDragging && "cursor-grabbing"
              )}
              onMouseDown={onHMouseDown}
              onMouseLeave={onHMouseLeave}
              onMouseUp={onHMouseUp}
              onMouseMove={onHMouseMove}
            >
              {blogData.map((post, index) => (
                <div key={post.id} className="flex-shrink-0 w-[320px] snap-center">
                  <Card
                    onClick={() => handleReadMore(post)}
                    className="group relative h-full glass-card rounded-2xl overflow-hidden transition-all duration-500 hover:border-neon-cyan/80 hover:shadow-2xl hover:shadow-neon-cyan/20 hover:-translate-y-2 flex flex-col cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative overflow-hidden h-48">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                        data-ai-hint="programming abstract"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-cyber-dark/40 to-transparent"></div>
                    </div>
                    <CardContent className="p-6 flex-grow flex flex-col">
                      <div className="flex-grow">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 text-xs rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-xl font-bold text-frost-white mb-2 group-hover:text-white transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-frost-cyan/80 text-sm leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>
                      <button
                        tabIndex={-1}
                        className="mt-6 inline-flex items-center text-neon-cyan font-semibold group-hover:text-frost-white transition-colors"
                      >
                        Read More{' '}
                        <ArrowRight
                          size={16}
                          className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
          </div>
        </div>
      </section>

      {selectedPost && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-3xl h-[90vh] bg-cyber-dark/90 backdrop-blur-lg border-neon-cyan/30 text-frost-white p-0">
             <ScrollArea 
                ref={vScrollContainerRef}
                className={cn(
                  "h-full w-full rounded-lg cursor-grab",
                  isVDragging && "cursor-grabbing"
                )}
                onMouseDown={onVMouseDown}
                onMouseUp={onVMouseUp}
                onMouseLeave={onVMouseLeave}
                onMouseMove={onVMouseMove}
             >
                <div className="p-6">
                    <DialogHeader>
                        <div className="relative w-full h-64 rounded-lg overflow-hidden mb-6">
                            <Image
                                src={selectedPost.image}
                                alt={selectedPost.title}
                                fill
                                className="object-cover pointer-events-none"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-cyber-dark/40 to-transparent"></div>
                        </div>
                        <DialogTitle className="text-3xl font-bold text-gradient-slow mb-2">{selectedPost.title}</DialogTitle>
                        <DialogDescription className="text-frost-cyan/80 flex flex-wrap gap-2 py-2">
                            {selectedPost.tags.map((tag) => (
                                <span
                                key={tag}
                                className="px-3 py-1 text-xs rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan"
                                >
                                {tag}
                                </span>
                            ))}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="prose prose-invert prose-p:text-frost-cyan/90 prose-headings:text-frost-white prose-strong:text-frost-white prose-a:text-neon-cyan max-w-none pt-6">
                        <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
                    </div>
                </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default BlogSection;
