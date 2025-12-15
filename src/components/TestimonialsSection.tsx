'use client';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Sarah L.',
    title: 'Project Manager, Tech Innovators',
    quote: "Adil is an exceptional developer who brings not only technical expertise but also a creative and strategic mindset to the table. His dedication to our project was instrumental in its success.",
    avatar: 'https://picsum.photos/seed/female1/100/100',
  },
  {
    name: 'Michael B.',
    title: 'Startup Founder',
    quote: 'Working with Adil was a fantastic experience. He is a proactive problem-solver and his communication skills are top-notch. He delivered a high-quality product that exceeded our expectations.',
    avatar: 'https://picsum.photos/seed/male1/100/100',
  },
  {
    name: 'Jessica M.',
    title: 'Lead Designer, Digital Horizons',
    quote: "Adil has a remarkable ability to translate complex design concepts into flawless, functional code. His attention to detail and commitment to UI/UX excellence make him a valuable asset to any team.",
    avatar: 'https://picsum.photos/seed/female2/100/100',
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-5xl md:text-7xl font-bold mb-8 text-gradient-slow drop-shadow-2xl">
            Words From My Clients
          </h2>
          <p className="text-xl text-frost-cyan max-w-4xl mx-auto leading-relaxed">
            Discover the impact of my work through the feedback of those I've collaborated with.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className="group relative glass-card rounded-2xl overflow-hidden h-full flex flex-col">
                <CardContent className="p-8 flex-grow flex flex-col">
                  <Quote className="w-10 h-10 text-neon-cyan/50 mb-6 transform -scale-x-100" />
                  <p className="text-frost-cyan mb-8 flex-grow italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-neon-cyan/50">
                        <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        data-ai-hint="person portrait"
                        />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-frost-white">{testimonial.name}</h4>
                      <p className="text-sm text-neon-cyan">{testimonial.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
