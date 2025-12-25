'use client';
import { TestimonialsMinimal } from '@/components/ui/minimal-testimonial';

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center">
            <div className="mt-12 w-full">
              <h3 className="text-4xl font-bold text-center mb-12 text-gradient-slow">People I've collaborated with</h3>
              <TestimonialsMinimal />
            </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
