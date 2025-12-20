'use client';
import { TestimonialsMinimal } from '@/components/ui/minimal-testimonial';

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-5xl md:text-7xl font-bold mb-8 text-gradient-slow drop-shadow-2xl">
            Words From My Clients
          </h2>
          <p className="text-xl text-frost-cyan max-w-4xl mx-auto leading-relaxed">
            Discover the impact of my work through the feedback of those I've collaborated with.
          </p>
        </div>
        <div className="flex justify-center">
            <TestimonialsMinimal />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
