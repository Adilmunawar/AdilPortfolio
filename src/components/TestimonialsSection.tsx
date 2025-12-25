'use client';
import { TestimonialsV2 } from '@/components/ui/testimonial-v2';
import { TestimonialsMinimal } from '@/components/ui/minimal-testimonial';

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center">
            <TestimonialsV2 />

            <div className="mt-24 w-full">
              <h3 className="text-4xl font-bold text-center mb-12 text-gradient-slow">Collab</h3>
              <TestimonialsMinimal />
            </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
