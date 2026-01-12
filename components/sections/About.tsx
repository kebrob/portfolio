import Image from "next/image";

export default function About() {
    return (
        <section id="about" className="px-[20px] md:px-[40px] lg:px-[80px] py-32">
            <div className="max-w-6xl mx-auto">
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-16 block">
                    About
                </span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-[1.1] tracking-tight mb-6 lg:mb-8">
                    Building digital products with precision and purpose.
                </h2>
                <div className="grid md:grid-cols-12 gap-8 md:gap-8">
                    {/* Photo - Left side */}
                    <div className="md:col-span-3 me-5">
                        <div className="relative group max-w-50">
                            {/* Main photo container */}
                            <div className="aspect-square md:aspect-3/4 overflow-hidden bg-muted relative">
                                <Image
                                    src="/images/portrait.jpg"
                                    alt="Robert Kebinger"
                                    fill
                                    sizes="200px"
                                    loading="lazy"
                                    quality={85}
                                    className="object-cover object-top"
                                />
                                {/* Subtle overlay */}
                                <div className="absolute inset-0 bg-foreground/5 group-hover:bg-transparent transition-colors duration-500" />
                            </div>
                            {/* Decorative frame */}
                            <div className="absolute -bottom-3 -right-3 w-full h-full border border-foreground/20 -z-10" />
                        </div>
                    </div>

                    {/* Content - Right side */}
                    <div className="md:col-span-9 max-w-xl space-y-8">
                        <div className="space-y-6">
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                I'm a frontend developer based in Rosenheim, Germany, with a passion
                                for creating seamless user experiences. I focus on writing clean,
                                maintainable code and building interfaces that feel intuitive.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                Currently crafting digital experiences at the intersection of design
                                and technology, with expertise in React, TypeScript, and modern web
                                technologies.
                            </p>
                        </div>

                        {/* Stats or highlights */}
                        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
                            <div>
                                <span className="text-3xl font-bold">5+</span>
                                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mt-1">
                                    Years Experience
                                </p>
                            </div>
                            <div>
                                <span className="text-3xl font-bold">50+</span>
                                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mt-1">
                                    Projects
                                </p>
                            </div>
                            <div>
                                <span className="text-3xl font-bold">∞</span>
                                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mt-1">
                                    Water Refills
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
