'use client';
import { TestimonialsV2 } from '@/components/ui/testimonial-v2';

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center">
            <TestimonialsV2 />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
