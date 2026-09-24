import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import ProjectsTransition from "@/components/sections/ProjectsTransition";
import HashScroll from "@/components/HashScroll";

/** Robi's first day. The only input to the years-of-experience count. */
const CAREER_START = new Date("2019-08-05");
const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.25;

/*
 * The two values on this page that depend on what day it is, resolved here
 * rather than inside the sections that show them.
 *
 * Both used to call new Date() in the body of a "use client" component, which
 * runs twice: once on the server, where this page is prerendered at build, and
 * again in the browser at hydration. On any day after an anniversary or a new
 * year the two disagree, so React finds the prerendered "6+" where its own
 * render produced "7+", reports a hydration mismatch, and repaints the number.
 *
 * This is a server component, so here it is computed once — at build — and
 * reaches the client as a serialized prop. The two renders cannot differ,
 * because there is only one of them.
 *
 * They do go stale until the next deploy. That is not a regression: the page is
 * statically prerendered, so every other word on it is exactly as stale, and a
 * year that is briefly wrong is a smaller problem than a year that visibly
 * corrects itself a moment after the page loads.
 */
export default function Home() {
    const now = new Date();
    const yearsOfExperience = Math.floor((now.getTime() - CAREER_START.getTime()) / MS_PER_YEAR);

    return (
        <>
            {/* Arrivals from the nav on another page — /#about and friends */}
            <HashScroll />
            <Hero />
            <About yearsOfExperience={yearsOfExperience} />
            <Experience />
            <ProjectsTransition />
            <Contact year={now.getFullYear()} />
        </>
    );
}
