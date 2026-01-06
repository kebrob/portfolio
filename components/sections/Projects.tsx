import { ArrowUpRight } from 'lucide-react';

const projects = [
  {
    title: 'E-Commerce Platform',
    description: 'Full-stack shopping experience with modern UI',
    tags: ['React', 'TypeScript', 'Tailwind'],
  },
  {
    title: 'Dashboard Analytics',
    description: 'Real-time data visualization interface',
    tags: ['Next.js', 'D3.js', 'API'],
  },
  {
    title: 'Portfolio Generator',
    description: 'Dynamic portfolio builder for creatives',
    tags: ['React', 'Node.js', 'MongoDB'],
  },
  {
    title: 'Task Management App',
    description: 'Collaborative project management tool',
    tags: ['TypeScript', 'Redux', 'Firebase'],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="dark-section section-transition px-5 md:px-10 lg:px-20 py-32 bg-[hsl(0_0%_6%)] text-[hsl(45_30%_96%)]">
      <div className="max-w-4xl">
        <span className="font-mono text-xs uppercase tracking-[0.3em] mb-12 block text-[hsl(0_0%_65%)]">
          Selected Work
        </span>

        <div className="space-y-0">
          {projects.map((project, index) => (
            <a
              key={index}
              href="#"
              className="group block py-10 border-t border-[hsl(0_0%_25%)] hover:bg-[hsl(0_0%_15%)]/10 transition-all -mx-6 px-6 hoverable"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:translate-x-2 transition-transform">
                    {project.title}
                  </h3>
                  <p className="mb-4 text-[hsl(0_0%_65%)]">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-xs uppercase tracking-wider text-[hsl(0_0%_65%)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowUpRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-2" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
