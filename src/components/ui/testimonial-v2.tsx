'use client';
import React from 'react';
import { motion } from "framer-motion";

// --- Types ---
interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

// --- Data ---
const testimonials: Testimonial[] = [
  {
    text: "Adil's technical expertise and problem-solving skills are exceptional. He delivered a high-quality solution that exceeded our expectations.",
    image: "https://images.unsplash.com/photo-1599377884021-a4ebf59c1c3f?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Fatima Ahmed",
    role: "Project Manager",
  },
  {
    text: "Working with Adil was a fantastic experience. His communication is clear, and he has a unique talent for turning complex ideas into elegant code.",
    image: "https://images.unsplash.com/photo-1628890920690-9e29d0019b9b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Ayesha Khan",
    role: "Lead Developer",
  },
  {
    text: "His attention to detail and commitment to quality are second to none. I was consistently impressed with his dedication to the project.",
    image: "https://images.unsplash.com/photo-1628890923662-2cb23c2a01a8?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Saman Malik",
    role: "UX Designer",
  },
  {
    text: "Adil is a rare talent who combines strategic thinking with flawless execution. Highly recommended for any ambitious project.",
    image: "https://images.unsplash.com/photo-1521146764736-56c929d59c83?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Hina Riaz",
    role: "CEO",
  },
  {
    text: "He has a deep understanding of modern web technologies and a knack for writing clean, efficient, and maintainable code.",
    image: "https://images.unsplash.com/photo-1594819047050-998a4446c651?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Zainab Hussain",
    role: "Senior Engineer",
  },
  {
    text: "The collaboration was seamless. He integrated perfectly with our team and consistently delivered outstanding results.",
    image: "https://images.unsplash.com/photo-1594819047050-998a4446c651?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Aliza Khan",
    role: "Product Owner",
  },
  {
    text: "His passion for development is evident in the quality of his work. A reliable and highly skilled professional.",
    image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Nida Ali",
    role: "Marketing Director",
  },
  {
    text: "Adil delivered a solution that exceeded our expectations, deeply understanding our needs and enhancing our user experience.",
    image: "https://images.unsplash.com/photo-1610216705422-caa3fcb6d158?q=80&w=487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Sana Sheikh",
    role: "Client",
  },
  {
    text: "His ability to tackle challenging problems and deliver robust solutions was instrumental to our project's success.",
    image: "https://images.unsplash.com/photo-1604004555489-723a93d6ce74?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Iqra Hassan",
    role: "Tech Lead",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

// --- Sub-Components ---
const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.ul
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-transparent list-none m-0 p-0"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <motion.li 
                  key={`${index}-${i}`}
                  aria-hidden={index === 1 ? "true" : "false"}
                  tabIndex={index === 1 ? -1 : 0}
                  whileHover={{ 
                    scale: 1.03,
                    y: -8,
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                  whileFocus={{ 
                    scale: 1.03,
                    y: -8,
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                  className="p-8 rounded-3xl max-w-xs w-full glass-card transition-all duration-300 cursor-default select-none group focus:outline-none focus:ring-2 focus:ring-neon-cyan/50" 
                >
                  <blockquote className="m-0 p-0">
                    <p className="text-frost-cyan/80 leading-relaxed font-normal m-0 transition-colors duration-300">
                      {text}
                    </p>
                    <footer className="flex items-center gap-4 mt-6">
                      <img
                        width={40}
                        height={40}
                        src={image}
                        alt={`Avatar of ${name}`}
                        className="h-10 w-10 rounded-full object-cover border-2 border-neon-cyan/30 group-hover:border-neon-cyan transition-all duration-300 ease-in-out"
                      />
                      <div className="flex flex-col">
                        <cite className="font-semibold not-italic tracking-tight leading-5 text-frost-white transition-colors duration-300">
                          {name}
                        </cite>
                        <span className="text-sm leading-5 tracking-tight text-frost-cyan/70 mt-0.5 transition-colors duration-300">
                          {role}
                        </span>
                      </div>
                    </footer>
                  </blockquote>
                </motion.li>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.ul>
    </div>
  );
};

export const TestimonialsV2 = () => {
  return (
    <section 
      aria-labelledby="testimonials-heading"
      className="bg-transparent py-24 relative overflow-hidden"
    >
      <motion.div 
        initial={{ opacity: 0, y: 50, rotate: -2 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ 
          duration: 1.2, 
          ease: [0.16, 1, 0.3, 1],
          opacity: { duration: 0.8 }
        }}
        className="container px-4 z-10 mx-auto"
      >
        <div className="flex flex-col items-center justify-center max-w-3xl mx-auto mb-16">
          <div className="flex justify-center mb-6">
            <div className="border border-neon-cyan/30 py-2 px-6 rounded-full text-sm font-semibold tracking-wide uppercase text-frost-cyan bg-cyber-dark/50 backdrop-blur-sm">
              Testimonials
            </div>
          </div>
          <p className="text-center mt-5 text-frost-cyan text-lg leading-relaxed max-w-2xl">
            Here's what people I've worked with have to say.
          </p>
        </div>

        <div 
          className="flex justify-center gap-8 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[740px] overflow-hidden"
          role="region"
          aria-label="Scrolling Testimonials"
        >
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </motion.div>
    </section>
  );
};
