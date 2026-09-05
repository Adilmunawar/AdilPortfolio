'use client';
import { TestimonialsMinimal } from '@/components/ui/minimal-testimonial';
import { Reveal } from './Reveal';

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="px-5 py-10 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-[1120px]">
        <Reveal className="mb-6 max-w-[680px] lg:mb-12">
          <p className="text-[13px] font-medium text-[#a4adbe]">Testimonials</p>
          <h2 className="mt-2 text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#f2f4f8] lg:text-[40px]">
            What collaborators say
          </h2>
          <p className="mt-3 text-[15px] leading-normal text-[#a4adbe] lg:text-[20px]">
            Notes from people I have built and shipped with.
          </p>
        </Reveal>
        <Reveal variant="none" delay={60}>
          <TestimonialsMinimal />
        </Reveal>
      </div>
    </section>
  );
};

export default TestimonialsSection;
