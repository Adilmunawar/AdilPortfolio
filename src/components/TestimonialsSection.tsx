'use client';
import { TestimonialsMinimal } from '@/components/ui/minimal-testimonial';
import { Reveal } from './Reveal';

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="px-5 py-10 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-[1120px]">
        <Reveal className="mx-auto mb-6 max-w-[680px] text-center lg:mb-12">
          <h2 className="text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#f2f4f8] lg:text-[40px]">
            What collaborators say
          </h2>
        </Reveal>
        <Reveal variant="none" delay={60}>
          <TestimonialsMinimal />
        </Reveal>
      </div>
    </section>
  );
};

export default TestimonialsSection;
