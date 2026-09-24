/**
 * The work, as data.
 *
 * Every surface that shows a project reads from here: the featured three on the
 * home page, the archive index, and the project page itself. The shape is the
 * one the project page settled on in the lab — a cover, then an index of facts
 * rather than an essay — so most of what follows is short, true lines rather
 * than prose. The prose that does exist is the tail under the index, and it is
 * two or three paragraphs by design, not by omission.
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

/** The generative compositions the cover knows how to draw. See components/project/kit.tsx. */
export type ArtVariant = "arcs" | "grid" | "wave" | "bars" | "plan";

export interface Project {
    slug: string;
    /** Category line above the title. One or two words — the cover sets it in caps. */
    kicker: string;
    title: string;
    /**
     * The sortable year, and only that: the archive orders on Number(year).
     * Anything a reader should see about span belongs in `period`.
     */
    year: string;
    /** "2022 to 2023", or "2026 to present". Shown in the index; falls back to `year`. */
    period?: string;
    /** True while the work is still running. The cover says so next to the year. */
    ongoing?: boolean;
    role: string;
    client: string;
    /** Length and shape of the engagement, in one line. */
    engagement: string;
    /** One line, for <meta description> and nothing else. */
    description: string;
    /** The standfirst, set large under the cover. Two or three sentences at most. */
    deck: string;
    tags: string[];
    stack: string[];
    stats: Stat[];
    /**
     * The figure the home page leads with, which is NOT always the first stat.
     *
     * The page and the wall want different numbers out of the same project. The
     * index reads top to bottom and can open on scope; a wall with one line per
     * project has to open on the result.
     */
    headline?: Stat;
    /**
     * What is deliberately not on this page.
     *
     * Published rather than quietly omitted. A case study that silently drops
     * its numbers reads as vague; one that states which numbers it is not
     * allowed to print reads as disciplined, and tells a reader exactly how much
     * weight the rest of the page carries.
     */
    withheld?: string[];
    /**
     * The prose tail under the index — two or three paragraphs, never more.
     *
     * The index is the page's argument: eight true lines beat four hundred words
     * with every specific taken out of them. This is what goes underneath once a
     * project has cleared enough to say something, and the length limit is the
     * whole point of it being a tail rather than a body.
     */
    body?: string[];
    hero: { art: ArtVariant; seed: number };
    /** Month and year the write-up was last touched. Sits in the byline. */
    updated: string;
    link?: string;
}

export const AUTHOR = "Robert Kebinger";

/*
 * Curated order, not chronological — the home page features the first three and
 * the archive re-sorts by year. The three at the top are the replatform, the
 * customer-record program and the design system: one shipped, one running, one
 * that everything else is built on.
 */
export const projects: Project[] = [
    {
        slug: "shop-that-can-be-updated",
        kicker: "Replatform",
        title: "A Shop That Can Be Updated Again",
        year: "2024",
        period: "2023 to 2024",
        role: "Web Developer, product team",
        client: "Calida Group Digital GmbH, in-house",
        engagement: "About a year and a half on the replatform project",
        description:
            "Moving an old Oxid shop to Shopware, and rebuilding the product pages with the team.",
        deck: "Our Oxid license ran out and the shop had become too old to upgrade. We rebuilt it on Shopware and redesigned the frontend at the same time. I worked in the product team on the listing and the detail page, and on the service that feeds them with product data.",
        tags: ["Commerce", "Replatform", "Product data"],
        stack: ["Shopware 6", "Twig", "TypeScript", "Nest.js", "RabbitMQ", "PHP"],
        stats: [
            {
                value: "0",
                label: "changes in the core, so the shop can update",
                method: "We only extend Shopware with plugins and apps, and nobody patches the core. So we can install a new Shopware version without breaking our own code.",
            },
            {
                value: "1",
                label: "product feed for the whole shop",
                method: "Our product system sends the data into Shopware over RabbitMQ. Price, media and stock come in over the same route and in the same format.",
            },
            {
                value: "AA",
                label: "accessibility level on the product pages",
                method: "AA is the WCAG level most shops have to meet. It covers color contrast, using the whole page with a keyboard, and labels a screen reader can read. We checked the listing, the filters and the detail page.",
            },
        ],
        headline: { value: "0", label: "changes in the core, so the shop can update" },
        withheld: [
            "Traffic, revenue and conversion numbers",
            "Screens, design files and copy",
            "Contract details with the vendors",
        ],
        body: [
            "Oxid itself was not the biggest issue. Over the years people had patched the core to fix things quickly, and at some point we could not update the shop without breaking those patches. When the license ran out we decided to start over on Shopware instead of patching again. This time mobile first, and set up so we can stay on the newest version.",
            "My part was the product pages. We rebuilt the listing and the detail page for mobile first and added recommendations and cross selling to both. In the backend I connected our product system to Shopware, so the shop gets its product data from one place and in one format.",
        ],
        hero: { art: "plan", seed: 12 },
        updated: "August 2026",
    },
    {
        slug: "two-crms-one-customer",
        kicker: "Program",
        title: "Two CRMs, One Customer",
        year: "2026",
        period: "2026 to present",
        ongoing: true,
        role: "Frontend Lead, customer domain",
        client: "Calida Group Digital GmbH, in-house",
        engagement: "Ongoing, across four teams",
        description:
            "Moving customer care and the customer data off BSI and Greyhound and onto SAP.",
        deck: "Customer care ran on BSI and Greyhound, two vendor tools that never really fit together. We are moving all of it to SAP. Service Cloud v2 is live and Greyhound is switched off, and right now we are moving the customer data from BSI to SAP CDP. BSI has to keep running until the last system is connected to CDP.",
        tags: ["CRM", "Migration", "Integration"],
        stack: [
            "SAP BTP",
            "SAP Customer Data Platform",
            "Service Cloud v2",
            "SAP S/4HANA",
            "Nest.js",
            "TypeScript",
            "RabbitMQ",
        ],
        stats: [
            {
                value: "6",
                label: "systems that need the same customer",
                method: "Shopware, the POS system, Caperwhite, Emarsys, Service Cloud and S/4HANA. Today they send and read over RabbitMQ or directly to BSI, which is the master. Later CDP is the master, some systems talk to it directly and the rest keeps using RabbitMQ. The data flow stays similar, we mainly change the platform underneath.",
            },
            {
                value: "2",
                label: "CRMs running side by side",
                method: "BSI and CDP run in parallel and stay in sync while we migrate system by system. The deadline is fixed, our BSI license ends in 2026 and everything has to be off it by then.",
            },
            {
                value: "1",
                label: "vendor tool switched off so far",
                method: "Greyhound. Before we switched it off we migrated the old cases into an archive, so customer care can still look them up if they need to.",
            },
        ],
        headline: { value: "6", label: "systems that need the same customer" },
        withheld: [
            "Customer numbers and revenue",
            "Screens from the internal care tools",
            "Vendor prices and contract details",
        ],
        body: [
            "We started with customer care. Greyhound went out and Service Cloud v2 came in, and we extended and configured it together with the care team so it fits the way they work. A lot more is automated now, and we added AI to the workflow as well, so an agent spends less time sorting and typing and more time on the actual case.",
            "The bigger part is the CRM itself. We are moving from BSI to SAP CDP, which is mostly concept and architecture work at the moment. Every system around it has to be able to send data to CDP and read from it: Shopware, the POS, Caperwhite and the rest. Until they are all connected, BSI and CDP run in parallel and stay in sync.",
            "We already run S/4HANA, so when this is done we are on one uniform SAP landscape. For us that means one customer record instead of several, more data we can actually use, and a lot more room to personalize the experience.",
        ],
        hero: { art: "arcs", seed: 31 },
        updated: "August 2026",
    },
    {
        slug: "one-source-two-tools",
        kicker: "Design system",
        title: "One Source, Two Tools",
        year: "2026",
        period: "2026 to present",
        ongoing: true,
        role: "Frontend Lead",
        client: "Calida Group Digital GmbH, in-house",
        engagement: "Ongoing, together with the design team",
        description:
            "A design system where Figma and the shop code use the same tokens and the same components.",
        deck: "Design and code had their own version of the same values, so both were right about half the time. The tokens now live in code in GitLab. From there we generate the CSS custom properties for the shop, and Tokens Studio pulls the same repository into Figma.",
        tags: ["Design systems", "Tokens", "Governance"],
        stack: ["GitLab", "Tokens Studio", "Figma", "Storybook", "Twig", "CSS custom properties"],
        stats: [
            {
                value: "32",
                label: "components in the system",
                method: "Counted as components that exist in Storybook and in Figma. If it only exists in one of them, I do not count it as part of the system yet.",
            },
            {
                value: "1",
                label: "place a token is defined",
                method: "Colours, spacing and typography are defined in code and live in GitLab. From there we generate the CSS custom properties for the shop, and Tokens Studio syncs the same repository into Figma. Both sides read the same file.",
            },
            {
                value: "0",
                label: "mockups built from outdated components",
                method: "UX can build mockups from the real components, in Figma or with AI tools like Figma Make. What they hand over is made of parts that already exist in code.",
            },
        ],
        headline: { value: "32", label: "components in the system" },
        body: [
            "None of the differences were big. A gray that is one step off, a spacing value someone rounded, a button that got an extra hover state in code but never in Figma. On their own they are small, but they cost us a discussion every few days.",
            "So this is more an organizational thing than a tooling thing. The tokens have one owner and one source, and changing a value is a merge request like any other change. For UX it means designs get faster and more accurate, because they build with components that really exist. For me it means I review whether something belongs in the system, not whether the values match.",
        ],
        hero: { art: "grid", seed: 5 },
        updated: "August 2026",
    },
    {
        slug: "where-did-my-points-go",
        kicker: "Case study",
        title: "Where Did My Points Go?",
        year: "2025",
        period: "2024 to 2025",
        role: "Frontend Lead, customer team",
        client: "Calida Group Digital GmbH, in-house",
        engagement: "About ten months, with the order team and Caperwhite",
        description:
            "Replacing an old loyalty program with SAP Emarsys Loyalty and a clearer account area.",
        deck: "The old loyalty program worked, but the design was dated and not easy to understand. We switched to SAP Emarsys Loyalty and rebuilt the account area around the things customers actually look for: their points, their tier and the vouchers they can use.",
        tags: ["Loyalty", "Accounts", "Accessibility"],
        stack: ["SAP Emarsys Loyalty", "Shopware 6", "Twig", "TypeScript", "Caperwhite"],
        stats: [
            {
                value: "1",
                label: "page for points, tiers and vouchers",
                method: "Points, vouchers and tier status are on one account page now, in a design that fits the rest of the shop. We also promote the program in more places so more customers sign up.",
            },
            {
                value: "1",
                label: "points balance, online and in the store",
                method: "Emarsys holds the balance. The website and the POS in the stores read it through Caperwhite, so points from a purchase in a store are visible online right away.",
            },
            {
                value: "AA",
                label: "accessibility level, account and checkout",
                method: "AA is the WCAG level most shops have to meet: color contrast, keyboard support and labels for screen readers. We checked the account page, the voucher redemption and the checkout step that applies a voucher.",
            },
        ],
        headline: { value: "1", label: "points balance, online and in the store" },
        withheld: [
            "Member numbers and redemption rates",
            "Tier rules and voucher economics",
            "Screens from the account area",
        ],
        body: [
            "Nothing was really broken. The program just looked old, customers had to think too much about how it works, and the system behind it was outdated as well. Moving to Emarsys was also a move to SAP, so we replaced the backend and rebuilt the frontend in one go. Everything is on one account page now, and we show the program in more places in the shop to get more sign ups.",
            "I am in the customer team, but a lot of this happens somewhere else. Redemption sits in checkout, so we built that part too and the order team did the QA. The in store part we built together with the developers at Caperwhite. Security, accessibility and mobile were part of the build from the beginning. Points work like money for the customer, and many of them look at the page on their phone while standing in a store.",
        ],
        hero: { art: "wave", seed: 23 },
        updated: "August 2026",
    },
    {
        slug: "connector-that-outlived-the-shop",
        kicker: "Integration",
        title: "A Connector That Outlived the Shop",
        year: "2025",
        period: "2019 to 2025",
        role: "Web Developer, Storyblok lead",
        client: "Calida Group Digital GmbH, in-house",
        engagement: "Six years next to other work, with the content team",
        description:
            "Building and keeping the Storyblok integration running across three shop platforms.",
        deck: "Our content lives in Storyblok and the shop is a separate system, so something has to connect the two. I built the first integration when we started with Storyblok and worked on the connector with the team. Over the years the same content had to run on three shop platforms: Oxid, Magento and Shopware. I also wrote most of the editor plugins the content team uses every day.",
        tags: ["CMS", "Integration", "Editor tooling"],
        stack: ["Storyblok", "Vue 3", "TypeScript", "Node.js", "Shopware 6", "Magento", "Oxid"],
        stats: [
            {
                value: "3",
                label: "shop platforms, one content setup",
                method: "Oxid, Magento and Shopware read the same content. We only rewrote the part that talks to the shop, so the existing landing pages kept working after a platform change.",
            },
            {
                value: "5",
                label: "editor plugins I wrote",
                method: "A WYSIWYG editor, image and video upload that goes to Azure, a dropdown with search that always shows the current shop categories, and a color picker with our brand colors.",
            },
            {
                value: "0",
                label: "developers needed to publish a landing page",
                method: "The content team builds landing pages from our widgets and publishes them. They only need a developer when a widget does not exist yet.",
            },
        ],
        headline: { value: "3", label: "shop platforms, one content setup" },
        body: [
            "I was one of the first here to work with Storyblok, so I ended up being the person people asked about it. The first thing I connected was landing pages, before the shop was involved at all. After that I had the lead for the topic until I changed teams internally.",
            "Most of my own work was on the editor side. Storyblok brings its own fields, but they do not know our media storage or our shop categories, so I wrote plugins for that: a WYSIWYG with the options the shop can actually render, uploads that go to Azure, and a dropdown with search for categories. I built them together with the content managers, based on what they needed for their pages.",
        ],
        hero: { art: "plan", seed: 47 },
        updated: "August 2026",
    },
    {
        slug: "keeping-the-front-end-boring",
        kicker: "Ongoing",
        title: "Keeping the Front End Boring",
        year: "2026",
        period: "2024 to present",
        ongoing: true,
        role: "Frontend Lead",
        client: "Calida Group Digital GmbH, in-house",
        engagement: "The part of the job that never ends",
        description:
            "The standing part of the lead role: rules, reviews, performance, accessibility and dependencies.",
        deck: "This is my daily work as a lead, not one single project. I decide how we build the frontend and write the guidelines for it, review the code against them, watch performance and accessibility, and keep dependencies up to date so we never get stuck on an old version.",
        tags: ["Performance", "Accessibility", "Leadership"],
        stack: ["DebugBear", "Web Vitals", "ESLint", "Stylelint", "Prettier", "Twig"],
        stats: [
            {
                value: "10",
                label: "pages I watch, desktop and mobile",
                method: "Five templates, home, category, product, cart and checkout, each on desktop and mobile. DebugBear collects the numbers and I go through them as part of my week.",
            },
            {
                value: "0",
                label: "linting errors on the main branch",
                method: "CI runs the linting for JavaScript, Twig and CSS. I set that up, including rules that check whether a component uses our custom properties instead of hard coded values.",
            },
            {
                value: "Weekly",
                label: "dependency updates",
                method: "I update in small steps every week instead of once a year. That keeps us close to the current version and security fixes do not sit around waiting for a big release.",
            },
        ],
        headline: { value: "10", label: "pages I watch, desktop and mobile" },
        body: [
            "A lot of this is deciding something once so the team does not have to decide it again: how we build a component, what belongs in the design system, when a library is worth adding, what a review should block on. I write it down, we agree on it, and I follow it in my own pull requests too.",
            "The other part is watching the shop. I check Web Vitals, accessibility and security myself instead of waiting for someone to report it, and if something gets worse I fix it or bring it into the sprint. Most of these improvements start as my own idea and not as a ticket. Nobody sees this work directly, but it is the reason we can still build new features quickly.",
        ],
        hero: { art: "bars", seed: 58 },
        updated: "August 2026",
    },
    {
        slug: "one-design-system-three-shops",
        kicker: "Design system",
        title: "One Design System, Three Shops",
        year: "2021",
        period: "2020 to 2021",
        role: "Working Student, project lead",
        client: "Calida Group Digital GmbH, in-house",
        engagement: "About eight months, with the UX team and an external colleague",
        description: "A multi tenant component library in Fractal for three server rendered shops.",
        deck: "Three shops, one component library. We built it with Fractal and used Bootstrap as a base where it made sense, everything else we wrote ourselves in TypeScript. The shops render on the server, so the components had to work without a JavaScript framework like Vue or React.",
        tags: ["Design systems", "Server-rendered", "Accessibility"],
        stack: ["Fractal", "Bootstrap", "TypeScript", "SCSS", "Bitbucket Pipelines", "Azure"],
        stats: [
            {
                value: "3",
                label: "shops using the same components",
                method: "The library is multi tenant. Each shop brings its own theme, the markup and the behavior stay the same. We ran a lot of custom services back then and any of them could pull the components in.",
            },
            {
                value: "7",
                label: "components in the first release",
                method: "We started with the components we needed most and wanted to add more when a team asked for one. The project was stopped before that happened, see the note below.",
            },
            {
                value: "0",
                label: "components that need a mouse",
                method: "We tested every component for keyboard use, focus order and screen readers before we released it, so accessibility was not something we had to repair later on a finished page.",
            },
            {
                value: "8 mo",
                label: "from start to a system we could deploy",
                method: "That includes the release pipeline, versioning for components and assets, and a notification when a new version was deployed. This part was finished and in use.",
            },
        ],
        headline: { value: "3", label: "shops using the same components" },
        body: [
            "We used Bootstrap for the standard parts like modals. Anything that had to work differently we wrote from scratch, the drawer for example, because the Bootstrap version did not do what the design needed. A component is server rendered markup plus a small TypeScript file, and we kept an eye on the CSS and JS size so the pages stayed fast.",
            "We worked closely with UX the whole time. An external colleague and I had the lead for the project, and the designers were part of it instead of handing us finished screens. We spent as much time on delivery as on the components: versioning for components and assets, a Bitbucket pipeline that deploys to Azure, and notifications when a new version went out. Our platform team helped us with the Kubernetes side.",
            "The project ended when the company moved from custom services to a monorepo. The design system itself was finished at that point, released, deployed and in use. New components would only have come when the demand was there.",
        ],
        hero: { art: "grid", seed: 90 },
        updated: "August 2026",
    },
    {
        slug: "girlfriend-approved-automation",
        kicker: "Personal",
        title: "Girlfriend-Approved Automation",
        year: "2026",
        period: "2024 to present",
        ongoing: true,
        role: "Weekends",
        client: "My apartment",
        engagement: "Ongoing, unpaid, occasionally questioned",
        description: "A local Home Assistant setup that everyone else in the apartment can ignore.",
        deck: "Home Assistant on a Raspberry Pi in a closet, running the lights, the heating and the doorbell. A private project to make the apartment a bit smarter, with one rule: my girlfriend should never have to think about it.",
        tags: ["Home automation", "Local-first", "Side project"],
        stack: ["Home Assistant", "ZHA", "YAML", "Raspberry Pi"],
        stats: [
            {
                value: "36",
                label: "devices, all local",
                method: "Zigbee over ZHA, plus a few Wi-Fi devices that did not want to cooperate. Everything runs locally, so the lights still work when the internet is down.",
            },
            {
                value: "0",
                label: "automations my girlfriend wants removed",
                method: "A few of them needed some tweaking first. The hallway light used to switch off while she was still standing in the hallway.",
            },
            {
                value: "1",
                label: "party cube",
                method: "An Aqara Magic Cube that controls Spotify. Double tap to skip, shake to pause, turn it to change the volume. When friends are over everybody wants to try it, so far my most popular automation.",
            },
        ],
        headline: { value: "36", label: "devices, all local" },
        body: [
            "Same rules as at work, only without stakeholders. Everything runs locally, so nothing breaks when a vendor shuts down a service, and I keep the automations simple enough that I can still explain what happened when a light goes on by itself. Lights react to presence, the heating follows our calendar, and the switch on the wall always wins.",
            "That last part matters more than it sounds. If something only works with the right app on the right phone, nobody else in the apartment will use it. So every device can still be used the normal way, and guests do not need an explanation.",
        ],
        hero: { art: "wave", seed: 71 },
        updated: "August 2026",
    },
];

export function getProjectBySlug(slug: string): Project | undefined {
    return projects.find((p) => p.slug === slug);
}

/**
 * The figure the home page leads with, or the year if none cleared.
 *
 * Lives here rather than in the section so the fallback is part of the data
 * contract: any surface that leads with a number gets the same answer.
 */
export function headlineStat(project: Project): Stat {
    return project.headline ?? project.stats[0] ?? { value: project.year, label: "shipped" };
}
