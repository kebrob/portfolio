"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { ArrowUpRight, GripHorizontal, Pause, Play } from "lucide-react";
import Link from "next/link";
import { projects } from "@/lib/projects";

export default function Projects() {
    const manuallyPaused = useRef(false);
    const isHovering = useRef(false);
    const [isPlaying, setIsPlaying] = useState(true);

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", dragFree: true }, [
        AutoScroll({ speed: 1.2, startDelay: 0, stopOnInteraction: true, stopOnMouseEnter: false }),
    ]);

    // embla-carousel-auto-scroll augments EmblaPluginsType, so this is already
    // typed as AutoScrollType — no cast needed.
    const getAS = useCallback(() => emblaApi?.plugins()?.autoScroll, [emblaApi]);

    // After the carousel settles post-drag, restart only if not hovering and not manually paused
    useEffect(() => {
        if (!emblaApi) return;
        const onSettle = () => {
            if (!isHovering.current && !manuallyPaused.current) {
                getAS()?.play();
                setIsPlaying(true);
            }
        };
        emblaApi.on("settle", onSettle);
        return () => {
            emblaApi.off("settle", onSettle);
        };
    }, [emblaApi, getAS]);

    const togglePlay = useCallback(() => {
        const as = getAS();
        if (!as) return;
        if (isPlaying) {
            as.stop();
            manuallyPaused.current = true;
            setIsPlaying(false);
        } else {
            as.play();
            manuallyPaused.current = false;
            setIsPlaying(true);
        }
    }, [getAS, isPlaying]);

    const handleMouseEnter = useCallback(() => {
        isHovering.current = true;
        getAS()?.stop();
        setIsPlaying(false);
    }, [getAS]);

    const handleMouseLeave = useCallback(() => {
        isHovering.current = false;
        if (manuallyPaused.current) return;
        getAS()?.play();
        setIsPlaying(true);
    }, [getAS]);

    return (
        // This section is rendered inside ProjectsTransition's pinned panel, which is
        // exactly 100vh and clips overflow with no way to scroll it. Every vertical
        // value below therefore has a compact base and a `tall:` variant: base pt-20
        // matches .nav-blur's 80px so the Pause button clears the header, and base
        // pb-14 clears the panel's `absolute bottom-6` scroll hint.
        <section className="pt-20 tall:pt-[15vh] pb-14 tall:pb-16 text-paper">
            {/* Header row: pause/play on right */}
            <div className="px-5 md:px-10 lg:px-20 mb-4 tall:mb-10">
                <div className="flex items-center justify-end">
                    <button
                        onClick={togglePlay}
                        className="hoverable cursor-pointer flex items-center gap-2 border border-grey-40 px-3 py-1.5 text-grey-75 hover:border-paper hover:text-paper transition-colors"
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? (
                            <Pause className="w-3.5 h-3.5" />
                        ) : (
                            <Play className="w-3.5 h-3.5" />
                        )}
                        <span className="font-mono text-[10px] uppercase tracking-wider">
                            {isPlaying ? "Pause" : "Play"}
                        </span>
                    </button>
                </div>
            </div>

            {/* Carousel */}
            <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex">
                        {projects.map((project) => (
                            <Link
                                key={project.slug}
                                href={`/project/${project.slug}`}
                                className="group hoverable flex-shrink-0 w-[360px] md:w-[440px] mr-6"
                            >
                                <div className="relative border border-grey-20 bg-grey-10 p-6 tall:p-8 h-[220px] tall:h-[280px] flex flex-col justify-between transition-all duration-500 group-hover:bg-grey-13 group-hover:border-grey-35 group-hover:scale-[1.02]">
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                        <div className="absolute inset-0 bg-gradient-to-br from-paper-4 to-transparent" />
                                    </div>

                                    <div className="relative z-10">
                                        <span className="font-mono text-[10px] uppercase tracking-widest text-grey-40 mb-3 block">
                                            {project.year}
                                        </span>
                                        <h3 className="text-2xl md:text-3xl font-bold mb-3 transition-transform duration-300 group-hover:translate-x-1 text-paper">
                                            {project.title}
                                        </h3>
                                        <p className="text-grey-55 text-sm leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>

                                    <div className="relative z-10 flex items-end justify-between">
                                        <div className="flex flex-wrap gap-2">
                                            {project.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="font-mono text-[10px] uppercase tracking-wider text-grey-55 border border-grey-25 px-2 py-1"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <ArrowUpRight className="w-5 h-5 text-grey-65 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </div>

                                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-t-paper-8 border-l-[40px] border-l-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Edge fades */}
                <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-grey-6 to-transparent pointer-events-none z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-grey-6 to-transparent pointer-events-none z-10" />

                {/* Drag hint */}
                <div className="flex items-center justify-center gap-2 mt-3 tall:mt-5 text-grey-40">
                    <GripHorizontal className="w-3.5 h-3.5" />
                    <span className="font-mono text-[10px] uppercase tracking-widest">
                        Drag to explore
                    </span>
                </div>
            </div>

            {/* See all projects */}
            <div className="flex justify-center px-5 md:px-10 lg:px-20 mt-6 tall:mt-14">
                <Link
                    href="/projects"
                    className="group hoverable inline-flex items-center gap-3 border border-grey-35 px-8 py-4 transition-all duration-300 hover:border-paper hover:bg-grey-10"
                >
                    <span className="font-mono text-sm uppercase tracking-wider text-paper">
                        See all projects
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-paper transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
            </div>
        </section>
    );
}
