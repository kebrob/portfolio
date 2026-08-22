import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import ProjectsTransition from "@/components/sections/ProjectsTransition";
import HashScroll from "@/components/HashScroll";

export default function Home() {
    return (
        <>
            {/* Arrivals from the nav on another page — /#about and friends */}
            <HashScroll />
            <Hero />
            <About />
            <Experience />
            <ProjectsTransition />
            <Contact />
        </>
    );
}
