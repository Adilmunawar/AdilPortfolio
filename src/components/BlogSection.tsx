'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Rss } from 'lucide-react';
import Image from 'next/image';
import blogData from '@/lib/blog-data.json';

const BlogSection = () => {
  return (
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
          <div className="flex space-x-8 pb-8 overflow-x-auto custom-scrollbar">
            {blogData.map((post, index) => (
              <div key={post.id} className="flex-shrink-0 w-[320px] snap-center">
                <Card 
                  className="group relative h-full glass-card rounded-2xl overflow-hidden transition-all duration-500 hover:border-neon-cyan/80 hover:shadow-2xl hover:shadow-neon-cyan/20 hover:-translate-y-2 flex flex-col"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden h-48">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
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
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center text-neon-cyan font-semibold group-hover:text-frost-white transition-colors"
                    >
                      Read More <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
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
  );
};

export default BlogSection;
