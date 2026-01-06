'use client';

import { useEffect, useState } from 'react';

export default function Header() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        const rect = projectsSection.getBoundingClientRect();
        setIsDark(rect.top < window.innerHeight * 0.5);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div 
        className={`fixed top-6 left-6 z-50 transition-colors duration-500 ${isDark ? 'text-[hsl(45_30%_96%)]' : 'text-[hsl(0_0%_8%)]'}`}
      >
        <span className="font-mono text-xs uppercase tracking-widest">
          Robert Kebinger
        </span>
      </div>

      <nav 
        className={`fixed top-6 right-6 z-50 transition-colors duration-500 ${isDark ? 'text-[hsl(45_30%_96%)]' : 'text-[hsl(0_0%_8%)]'}`}
      >
        <ul className="flex gap-8">
          {['about', 'projects', 'contact'].map((item) => (
            <li key={item}>
              <button
                onClick={() => scrollToSection(item)}
                className="font-mono text-xs uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity duration-300 hoverable"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
