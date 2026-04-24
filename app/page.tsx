"use client";

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import ProjectsTransition from "@/components/sections/ProjectsTransition";

export default function Home() {
    return (
        <>
            <Hero />
            <About />
            <Experience />
            <ProjectsTransition />
            <Contact />
        </>
    );
}
