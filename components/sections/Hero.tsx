'use client';

export default function Hero() {
  const scrollToAbout = () => {
    const element = document.getElementById('about');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex flex-col justify-center px-5 md:px-10 lg:px-20 relative">
      <div className="max-w-4xl">
        <h1 className="text-[clamp(3rem,10vw,9rem)] font-bold leading-[0.9] tracking-tight uppercase mb-5">
          Robert Kebinger
          <span className="inline-block w-[0.15em] h-[0.15em] ml-2 align-middle bg-[hsl(0_0%_8%)]" />
        </h1>

        <p className="font-mono text-sm md:text-base uppercase tracking-[0.3em] max-w-xl text-[hsl(0_0%_40%)]">
          Frontend Developer crafting clean, purposeful digital experiences
        </p>
      </div>

      <button
        onClick={scrollToAbout}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-[0.3em] text-[hsl(0_0%_40%)] opacity-70 hover:opacity-100 transition-colors hoverable"
      >
        scroll to explore
      </button>
    </section>
  );
}
