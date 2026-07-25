# Portfolio Website

A modern portfolio website built with Next.js, Tailwind CSS, and Framer Motion.

## 🚀 Tech Stack

- **Next.js 16** (App Router) - React framework for production
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework, configured CSS-first in `app/globals.css`
- **Framer Motion** - Animation library for React
- **Lenis** - Smooth scrolling
- **Embla Carousel** - Projects carousel (with the auto-scroll plugin)

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
│   ├── layout.tsx              # Root layout — fonts, metadata, providers
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles + Tailwind entry point
│   ├── projects/page.tsx       # /projects — all projects
│   └── project/[slug]/page.tsx # /project/[slug] — project detail
├── components/
│   ├── layout/                 # Header
│   ├── sections/               # Hero, About, Experience, Projects, Contact
│   ├── ui/                     # TextAnimation
│   └── ...                     # CustomCursor, GridBackground, SmoothScroll
├── lib/                        # Project data, header theme context, hooks
├── public/                     # Static assets
├── package.json
└── README.md
```

## 🎨 Customization

- Edit `app/page.tsx` to change which sections appear on the home page
- Edit the section components in `components/sections/` for their content
- Project entries live in `lib/projects.ts`
- Colors and global styles are in `app/globals.css` — Tailwind v4 is
  configured CSS-first, so there is no `tailwind.config.ts`
- Add animations using Framer Motion components

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## 🚀 Deploy

Deploy easily on [Vercel](https://vercel.com/new):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
