export default function About() {
  return (
    <section id="about" className="px-5 md:px-10 lg:px-20 py-32">
      <div className="max-w-4xl">
        <span className="font-mono text-xs uppercase tracking-[0.3em] mb-8 block text-[hsl(0_0%_40%)]">
          About
        </span>
        
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
              Building digital products with precision and purpose.
            </h2>
          </div>
          
          <div className="space-y-6">
            <p className="leading-relaxed text-[hsl(0_0%_40%)]">
              I'm a frontend developer based in Vienna, Austria, with a passion for 
              creating seamless user experiences. I focus on writing clean, 
              maintainable code and building interfaces that feel intuitive.
            </p>
            <p className="leading-relaxed text-[hsl(0_0%_40%)]">
              Currently crafting digital experiences at the intersection of design 
              and technology, with expertise in React, TypeScript, and modern web 
              technologies.
            </p>
            <div className="pt-4">
              <span className="font-mono text-xs uppercase tracking-widest text-[hsl(0_0%_40%)]">
                Vienna, Austria
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
