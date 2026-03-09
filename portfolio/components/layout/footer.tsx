"use client";

import { motion, useMotionValue, useSpring } from 'framer-motion';

const Footer = () => {
  // Motion values для магнитной анимации кнопки без лишних ререндеров
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 150, damping: 15, mass: 0.1 });
  const y = useSpring(rawY, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const factor = 0.35;

    rawX.set((clientX - (left + width / 2)) * factor);
    rawY.set((clientY - (top + height / 2)) * factor);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <footer className="bg-[var(--chrome-surface)] text-white px-10 py-20 font-sans relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="flex items-center gap-6 mb-20">
          <h2 className="text-[8vw] leading-none font-light tracking-tight">
            {"Let's work"} <br /> together
          </h2>
        </div>

        <div className="relative h-px bg-gray-600 w-full mb-20 flex justify-end items-center">
              <motion.a 
              href="/contact"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ x, y }}
              className="absolute right-[15%] w-44 h-44 bg-[#F4F4F4] rounded-full flex items-center justify-center cursor-pointer text-lg font-medium shadow-xl z-10"
            >
              <span className="relative z-10 text-black">Get in touch</span>
            </motion.a>
        </div>

        <div className="flex flex-wrap gap-4 mb-32">
          <a 
            href="mailto:gadimovagunay87@gmail.com" 
            className="border border-gray-600 rounded-full px-8 py-4 hover:bg-white hover:text-black transition-all duration-300"
          >
            gadimovagunay87@gmail.com
          </a>
          <a 
            href="tel:+994501234567" 
            className="border border-gray-600 rounded-full px-8 py-4 hover:bg-white hover:text-black transition-all duration-300"
          >
            +994 50 123 45 67
          </a>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end text-sm text-gray-400 uppercase tracking-widest gap-10">
          <div className="flex gap-10 w-full md:w-auto">
            <div>
              <p className="mb-2 text-gray-500 text-[10px]">Version</p>
              <p className="text-white">2026 © Edition</p>
            </div>
            <div>
              {/* <p className="mb-2 text-gray-500 text-[10px]">Local Time</p>
              <p className="text-white">03:07 PM CET</p> */}
            </div>
          </div>

          <div className="w-full md:w-auto text-right">
            <p className="mb-4 text-gray-500 text-[10px]">Socials</p>
            <div className="flex gap-6 text-white lowercase">
              <a target="_blank" href="https://github.com/GunayGadimova1357" className="hover:opacity-50 transition-opacity">GitHub</a>
              <a target="_blank" href="https://www.linkedin.com/in/gadimovagunay/" className="hover:opacity-50 transition-opacity">LinkedIn</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
