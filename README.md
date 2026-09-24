# Portfolio Website

A modern portfolio website built with Next.js, Tailwind CSS, and Framer Motion.

## 🚀 Tech Stack

- **Next.js 16** (App Router) - React framework for production
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework, configured CSS-first in `app/globals.css`
- **Framer Motion** - Animation library for React
- **Lenis** - Smooth scrolling
- **next-intl** - Translations, locale routing and `Intl` formatting
- **lucide-react** - Icons
- **WebGL2** - The paper-to-ink transition, hand-written in `lib/ink/`

## 📦 Getting Started

### Installation

Install dependencies:

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your portfolio.

### Build

Build for production:

```bash
npm run build
npm start
```

## 📁 Project Structure

```
portfolio/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx          # Root layout — <html lang>, fonts, metadata, providers
│   │   ├── page.tsx            # Home page (+ Person JSON-LD)
│   │   ├── projects/page.tsx   # /projects — the archive
│   │   ├── project/[slug]/     # /project/[slug] — project detail
│   │   ├── imprint/page.tsx    # /imprint — Impressum (§ 5 DDG)
│   │   ├── not-found.tsx       # The 404
│   │   ├── [...rest]/page.tsx  # Sends unknown paths to the 404
│   │   └── lab/                # Scratch design routes — gitignored, never linked
│   ├── globals.css             # Design tokens, global styles, Tailwind entry point
│   ├── sitemap.ts, robots.ts
├── i18n/                       # next-intl: routing, request config, navigation
├── messages/en.json            # Every user-facing string, including project copy
├── proxy.ts                    # next-intl locale routing
├── components/
│   ├── layout/                 # Header, SiteFooter, LegalLinks
│   ├── sections/               # Hero, About, Experience, Projects, Contact
│   ├── project/                # Project page and its parts
│   ├── ui/                     # ScrambleText, TypeText, PaperInkToggle
│   ├── lab/                    # Scratch design candidates — gitignored
│   └── ...                     # CustomCursor, GridBackground, SmoothScroll,
│                               #   ThemeInk, InkTransition, ThemedPage
├── lib/
│   ├── ink/                    # WebGL2 runner + the ink-bleed shader
│   ├── projects.ts             # Language-independent project data
│   ├── site.ts                 # Site URL, name, email, socials, imprint data
│   └── ...                     # Theme contexts, hooks, palette, SEO helpers
├── public/                     # Static assets
├── package.json
└── README.md
```

## 🧪 The lab

`/app/lab/*` and `/components/lab/*` are scratch routes for trying design
directions side by side. They are gitignored on purpose: nothing links to them,
nothing on the site imports them, and a candidate only becomes real by being
moved out into `components/` proper. Delete a lab once its winner has shipped.

## 🎨 Customization

- Edit `app/[locale]/page.tsx` to change which sections appear on the home page
- Text lives in `messages/en.json`; layout and behaviour in `components/sections/`
- Project data is split: `lib/projects.ts` (years, stack, art) and
  `messages/en.json → projectContent.<slug>` (everything a visitor reads)
- Design tokens (colours, fonts, label type, gutter, easing) are in `app/globals.css` —
  Tailwind v4 is configured CSS-first, so there is no `tailwind.config.ts`.
  Restart the dev server after changing anything in `@theme`.
- Set `NEXT_PUBLIC_SITE_URL` in the deployment once the domain is final; it drives
  canonical URLs, hreflang, the sitemap and Open Graph.
- Fill in the imprint placeholders in `lib/site.ts` (`IMPRINT`) before going live.

## 🌍 Adding a language (German, Korean)

1. Copy `messages/en.json` to `messages/de.json` (or `ko.json`) and translate the
   values. Keep every key; the types are generated from `en.json`, and a key missing
   in another locale falls back to an error at runtime.
2. Add the locale to `locales` in `i18n/routing.ts`. Routes (`/de`, `/ko`), `<html lang>`,
   hreflang links and the sitemap follow automatically.
3. Add its Open Graph locale (`de_DE`, `ko_KR`) as `metadata.ogLocale` in the new file.
4. Optional: localized URLs (e.g. `/de/impressum`) via `pathnames` in `i18n/routing.ts`.
5. Korean only: self-host a Hangul font (e.g. Pretendard, woff2 subsets in `public/fonts`)
   with an `@font-face` named `"Pretendard"`, loaded only when `locale === "ko"` (a
   `<link rel="stylesheet">` in the layout's `<head>`). The `:lang(ko)` stack in
   `globals.css` already lists it first. Do not use a Google Fonts/CDN link — loading
   fonts from a third party transfers visitors' IP addresses (GDPR).
6. Add a language switcher: `Link` from `@/i18n/navigation` with the `locale` prop keeps
   the current page, e.g. `<Link href={pathname} locale="de">`.
7. Check long German words in the archive columns and the nav at 320px, and Korean
   line breaks (`word-break: keep-all` is set for `:lang(ko)`).

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## 🚀 Deploy

Deploy easily on [Vercel](https://vercel.com/new):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
