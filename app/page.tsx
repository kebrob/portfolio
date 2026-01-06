import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import CustomCursor from "@/components/CustomCursor";

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <CustomCursor />
      
      <div className="dot-pattern">
        <Hero />
        <About />
        <Experience />
      </div>
      
      <Projects />
      <Contact />
    </div>
  );
}
