/**
 * The work, as data.
 *
 * Every surface that shows a project reads from here: the featured three on the
 * home page, the archive index, and the project page itself.
 *
 * SPLIT BY LANGUAGE. This file holds what is the same in every language —
 * order, years, stack, cover art, links. Everything a visitor reads as a
 * sentence (title, deck, stats, notes) is in messages/<locale>.json under
 * `projectContent.<slug>`, and resolveProjects() joins the two.
 */

/**
 * A figure a project can be summarised by.
 *
 * `value` is set at display size on the home page and at reading size in the
 * index, so keep it short ("0", "32", "8 mo", "AA") and put every
 * qualification in the label. "Down from 21.4%" belongs in the label; a value of
 * "6.1% (from 21.4%)" will set at 5rem and wrap.
 *
 * `method` is how the number was arrived at, and it is close to mandatory. None
 * of this work can show a screenshot of the thing it is describing, so the
 * figures do the job the screenshots would have done — and a figure with no
 * stated method is the weakest line on a page like that, not the strongest.
 */
export interface Stat {
    value: string;
    label: string;
    method?: string;
}

export type ArtVariant = "arcs" | "grid" | "wave" | "bars" | "plan";

interface ProjectMeta {
    slug: string;
    /**
     * The sortable year, and only that: the archive orders on it. Anything a
     * reader should see about span comes from `from` and `to`.
     */
    year: number;
    from: number;
    /** Last year of the work, or null while it is still running. */
    to: number | null;
    stack: string[];
    /**
     * Index into `stats` of the figure the home page leads with, which is NOT
     * always the first one.
     *
     * The page and the wall want different numbers out of the same project. The
     * index reads top to bottom and can open on scope; a wall with one line per
     * project has to open on the result.
     */
    headline?: number;
    hero: { art: ArtVariant; seed: number };
    /** "YYYY-MM" */
    updated: string;
    link?: string;
}

export interface ProjectCopy {
    /** Category line above the title. One or two words — the cover sets it in caps. */
    kicker: string;
    title: string;
    role: string;
    client: string;
    engagement: string;
    description: string;
    deck: string;
    tags: string[];
    stats: Stat[];
    /**
     * What is deliberately not on this page (NDA), published rather than
     * quietly omitted so a reader knows how much weight the rest carries.
     */
    withheld?: string[];
    /** The prose tail under the index — two or three paragraphs, never more. */
    body?: string[];
}

export type Project = ProjectMeta & ProjectCopy;

/*
 * Curated order, not chronological — the home page features the first three and
 * the archive re-sorts by year. The three at the top are the replatform, the
 * customer-record program and the design system: one shipped, one running, one
 * that everything else is built on.
 */
const PROJECTS: ProjectMeta[] = [
    {
        slug: "shop-that-can-be-updated",
        year: 2024,
        from: 2023,
        to: 2024,
        stack: ["Shopware 6", "Twig", "TypeScript", "Nest.js", "RabbitMQ", "PHP"],
        hero: { art: "plan", seed: 12 },
        updated: "2026-08",
    },
    {
        slug: "two-crms-one-customer",
        year: 2026,
        from: 2026,
        to: null,
        stack: [
            "SAP BTP",
            "SAP Customer Data Platform",
            "Service Cloud v2",
            "SAP S/4HANA",
            "Nest.js",
            "TypeScript",
            "RabbitMQ",
        ],
        hero: { art: "arcs", seed: 31 },
        updated: "2026-08",
    },
    {
        slug: "one-source-two-tools",
        year: 2026,
        from: 2026,
        to: null,
        stack: ["GitLab", "Tokens Studio", "Figma", "Storybook", "Twig", "CSS custom properties"],
        hero: { art: "grid", seed: 5 },
        updated: "2026-08",
    },
    {
        slug: "where-did-my-points-go",
        year: 2025,
        from: 2024,
        to: 2025,
        stack: ["SAP Emarsys Loyalty", "Shopware 6", "Twig", "TypeScript", "Caperwhite"],
        headline: 1,
        hero: { art: "wave", seed: 23 },
        updated: "2026-08",
    },
    {
        slug: "connector-that-outlived-the-shop",
        year: 2025,
        from: 2019,
        to: 2025,
        stack: ["Storyblok", "Vue 3", "TypeScript", "Node.js", "Shopware 6", "Magento", "Oxid"],
        hero: { art: "plan", seed: 47 },
        updated: "2026-08",
    },
    {
        slug: "keeping-the-front-end-boring",
        year: 2026,
        from: 2024,
        to: null,
        stack: ["DebugBear", "Web Vitals", "ESLint", "Stylelint", "Prettier", "Twig"],
        hero: { art: "bars", seed: 58 },
        updated: "2026-08",
    },
    {
        slug: "one-design-system-three-shops",
        year: 2021,
        from: 2020,
        to: 2021,
        stack: ["Fractal", "Bootstrap", "TypeScript", "SCSS", "Bitbucket Pipelines", "Azure"],
        hero: { art: "grid", seed: 90 },
        updated: "2026-08",
    },
    {
        slug: "girlfriend-approved-automation",
        year: 2026,
        from: 2024,
        to: null,
        stack: ["Home Assistant", "ZHA", "YAML", "Raspberry Pi"],
        hero: { art: "wave", seed: 71 },
        updated: "2026-08",
    },
];

export const PROJECT_SLUGS = PROJECTS.map((p) => p.slug);

/**
 * Joins the data with its copy for the current language.
 *
 * Takes the `projectContent` object from the messages — `useMessages()` in a
 * client component, `getMessages()` on the server — so both sides resolve
 * projects the same way.
 */
export function resolveProjects(content: unknown): Project[] {
    const copy = content as Record<string, ProjectCopy>;
    return PROJECTS.map((meta) => ({ ...meta, ...copy[meta.slug] }));
}

/** The figure the home page leads with. See `headline`. */
export function headlineStat(project: Project): Stat {
    return project.stats[project.headline ?? 0];
}

export function monthDate(yearMonth: string): Date {
    const [y, m] = yearMonth.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, 1, 12));
}
