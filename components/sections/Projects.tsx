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

    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: "start", dragFree: true },
        [AutoScroll({ speed: 1.2, startDelay: 0, stopOnInteraction: true, stopOnMouseEnter: false })],
    );

    const getAS = useCallback(
        () =>
            emblaApi?.plugins()?.autoScroll as
                | { play: () => void; stop: () => void; isPlaying: () => boolean }
                | undefined,
        [emblaApi],
    );

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
        return () => { emblaApi.off("settle", onSettle); };
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
        <section className="pt-[15vh] pb-16 text-[hsl(45_30%_96%)]">
            {/* Header row: pause/play on right */}
            <div className="px-5 md:px-10 lg:px-20 mb-10">
                <div className="flex items-center justify-end">
                    <button
                        onClick={togglePlay}
                        className="hoverable cursor-pointer flex items-center gap-2 border border-[hsl(0_0%_40%)] px-3 py-1.5 text-[hsl(0_0%_75%)] hover:border-[hsl(45_30%_96%)] hover:text-[hsl(45_30%_96%)] transition-colors"
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
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
                                <div className="relative border border-[hsl(0_0%_20%)] bg-[hsl(0_0%_10%)] p-8 h-[280px] flex flex-col justify-between transition-all duration-500 group-hover:bg-[hsl(0_0%_13%)] group-hover:border-[hsl(0_0%_35%)] group-hover:scale-[1.02]">
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(45_30%_96%/0.04)] to-transparent" />
                                    </div>

                                    <div className="relative z-10">
                                        <span className="font-mono text-[10px] uppercase tracking-widest text-[hsl(0_0%_40%)] mb-3 block">
                                            {project.year}
                                        </span>
                                        <h3 className="text-2xl md:text-3xl font-bold mb-3 transition-transform duration-300 group-hover:translate-x-1 text-[hsl(45_30%_96%)]">
                                            {project.title}
                                        </h3>
                                        <p className="text-[hsl(0_0%_55%)] text-sm leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>

                                    <div className="relative z-10 flex items-end justify-between">
                                        <div className="flex flex-wrap gap-2">
                                            {project.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="font-mono text-[10px] uppercase tracking-wider text-[hsl(0_0%_55%)] border border-[hsl(0_0%_25%)] px-2 py-1"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <ArrowUpRight className="w-5 h-5 text-[hsl(0_0%_65%)] opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </div>

                                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-t-[hsl(45_30%_96%/0.08)] border-l-[40px] border-l-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Edge fades */}
                <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-[hsl(0_0%_6%)] to-transparent pointer-events-none z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-[hsl(0_0%_6%)] to-transparent pointer-events-none z-10" />

                {/* Drag hint */}
                <div className="flex items-center justify-center gap-2 mt-5 text-[hsl(0_0%_40%)]">
                    <GripHorizontal className="w-3.5 h-3.5" />
                    <span className="font-mono text-[10px] uppercase tracking-widest">Drag to explore</span>
                </div>
            </div>

            {/* See all projects */}
            <div className="flex justify-center px-5 md:px-10 lg:px-20 mt-14">
                <Link
                    href="/projects"
                    className="group hoverable inline-flex items-center gap-3 border border-[hsl(0_0%_35%)] px-8 py-4 transition-all duration-300 hover:border-[hsl(45_30%_96%)] hover:bg-[hsl(0_0%_10%)]"
                >
                    <span className="font-mono text-sm uppercase tracking-wider text-[hsl(45_30%_96%)]">
                        See all projects
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-[hsl(45_30%_96%)] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
            </div>
        </section>
    );
}


