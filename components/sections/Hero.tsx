'use client';

import TextWave from '@/components/ui/TextWave';

export default function Hero() {
  const scrollToAbout = () => {
    const element = document.getElementById('about');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex flex-col justify-center px-5 md:px-10 lg:px-20 relative">
      <div className="max-w-4xl">
        <h1 className="text-[clamp(3rem,10vw,9rem)] font-bold leading-[0.9] tracking-tight mb-8 flex flex-col items-start">
          <span>Robert</span>
          <span className="whitespace-nowrap">Kebinger<span className="inline-block w-[0.15em] h-[0.15em] ml-2 align-middle bg-[hsl(0_0%_8%)]" /></span>
        </h1>

        <div className="max-w-xl">
          <p className="font-sans text-sm md:text-base tracking-wide text-[hsl(0_0%_8%)]">
            Frontend Developer crafting clean, purposeful digital experiences
          </p>
          <p className="font-sans text-sm md:text-base tracking-wide text-[hsl(0_0%_8%)] mt-0.5">
            Based in Rosenheim
          </p>
        </div>
      </div>

      <button
        onClick={scrollToAbout}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-xs uppercase  text-[hsl(0_0%_40%)] opacity-70 hover:opacity-100 transition-colors hoverable cursor-pointer"
      >
          [&nbsp;
        <TextWave 
          text="scroll to explore"
          invertBox={{
            backgroundColor: '#000',
            textColor: '#fff'
          }}
          speed={40}
        />
          &nbsp;]
      </button>
    </section>
  );
}
