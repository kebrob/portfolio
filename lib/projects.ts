export interface Project {
    slug: string;
    title: string;
    year: string;
    role: string;
    description: string;
    longDescription: string;
    tags: string[];
    tech: string[];
    link?: string;
}

export const projects: Project[] = [
    {
        slug: "e-commerce-platform",
        title: "E-Commerce Platform",
        year: "2024",
        role: "Lead Frontend Developer",
        description: "Full-stack shopping experience with modern UI",
        longDescription:
            "A high-performance e-commerce platform built for scale. Features real-time inventory management, a custom checkout flow optimised for conversion, and a fully responsive design. Integrated with Stripe for payments and Algolia for search.",
        tags: ["React", "TypeScript", "Tailwind"],
        tech: ["Next.js", "TypeScript", "Tailwind CSS", "Stripe", "Algolia", "PostgreSQL"],
        link: "https://example.com",
    },
    {
        slug: "dashboard-analytics",
        title: "Dashboard Analytics",
        year: "2024",
        role: "Frontend Developer",
        description: "Real-time data visualisation interface",
        longDescription:
            "An analytics dashboard serving over 10k daily active users. Built with D3.js for custom visualisations and WebSockets for live data updates. Reduced page load time by 40% through aggressive code-splitting and caching strategies.",
        tags: ["Next.js", "D3.js", "API"],
        tech: ["Next.js", "D3.js", "WebSockets", "Redis", "Node.js", "Prisma"],
        link: "https://example.com",
    },
    {
        slug: "portfolio-generator",
        title: "Portfolio Generator",
        year: "2023",
        role: "Fullstack Developer",
        description: "Dynamic portfolio builder for creatives",
        longDescription:
            "A drag-and-drop portfolio builder that lets creatives go from zero to published in minutes. Supports custom domains, theming, and a markdown-based content editor. Over 2k portfolios created since launch.",
        tags: ["React", "Node.js", "MongoDB"],
        tech: ["React", "Node.js", "MongoDB", "AWS S3", "Cloudflare", "Express"],
        link: "https://example.com",
    },
    {
        slug: "task-management-app",
        title: "Task Management App",
        year: "2023",
        role: "Frontend Developer",
        description: "Collaborative project management tool",
        longDescription:
            "A Notion-inspired task manager with real-time collaboration, rich text editing, and nested task hierarchies. Built with a conflict-free replicated data type (CRDT) approach for offline-first sync across devices.",
        tags: ["TypeScript", "Redux", "Firebase"],
        tech: ["TypeScript", "React", "Redux Toolkit", "Firebase", "Yjs", "TipTap"],
        link: "https://example.com",
    },
    {
        slug: "design-system",
        title: "Design System",
        year: "2023",
        role: "Design Engineer",
        description: "Scalable component library for product teams",
        longDescription:
            "A comprehensive design system spanning 80+ components, with full accessibility support (WCAG 2.1 AA) and dark mode. Fully documented in Storybook and published as an internal npm package used by 5 product teams.",
        tags: ["React", "Storybook", "Radix UI"],
        tech: ["React", "TypeScript", "Radix UI", "Storybook", "Chromatic", "Figma Tokens"],
        link: "https://example.com",
    },
    {
        slug: "ai-writing-tool",
        title: "AI Writing Tool",
        year: "2024",
        role: "Fullstack Developer",
        description: "LLM-powered content creation assistant",
        longDescription:
            "An AI-powered writing assistant that helps teams produce on-brand content at scale. Features a streaming markdown editor, style guide enforcement via embeddings, and a custom tone analyser built on top of the OpenAI API.",
        tags: ["Next.js", "OpenAI", "Vercel AI SDK"],
        tech: ["Next.js", "TypeScript", "OpenAI API", "Vercel AI SDK", "Supabase", "pgvector"],
        link: "https://example.com",
    },
];

export function getProjectBySlug(slug: string): Project | undefined {
    return projects.find((p) => p.slug === slug);
}
