'use client';

import { useEffect, useState } from 'react';

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be 12
      const hoursStr = hours.toString().padStart(2, '0');
      setTime(`${hoursStr}:${minutes}_${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

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
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${isDark ? 'text-[hsl(45_30%_96%)]' : 'text-[hsl(0_0%_8%)]'}`}
      >
        <div className="nav-blur">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        
        <div className="flex justify-between items-center px-3 py-3 relative z-10">
          <div className="font-mono text-[11px] uppercase tracking-widest opacity-50">
            ROBERTKEBINGER_{time}_ROSENHEIM
          </div>

          <ul className="flex gap-4">
            {['about', 'projects', 'contact'].map((item) => (
              <li key={item}>
                <button
                  onClick={() => scrollToSection(item)}
                  className="font-mono text-[11px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity duration-300 hoverable"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
