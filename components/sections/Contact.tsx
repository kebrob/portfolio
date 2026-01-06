import { Mail, Github, Linkedin, ArrowUpRight } from 'lucide-react';

export default function Contact() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="dark-section section-transition px-5 md:px-10 lg:px-20 py-32 bg-[hsl(0_0%_6%)] text-[hsl(45_30%_96%)] min-h-screen flex flex-col justify-center"
    >
      <div className="max-w-4xl w-full">
        <div className="mb-20">
          <span className="font-mono text-xs uppercase tracking-[0.3em] mb-8 block text-[hsl(0_0%_65%)]">
            Get in touch
          </span>
          
          <h2 className="text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[0.95] tracking-tight mb-8">
            Let's work
            <br />
            together
            <span className="inline-block w-[0.12em] h-[0.12em] ml-3 align-middle bg-[hsl(45_30%_96%)]" />
          </h2>
          
          <p className="text-xl max-w-md mb-12 text-[hsl(0_0%_65%)]">
            I'm always open to discussing new projects, creative ideas, or
            opportunities to be part of your vision.
          </p>

          <a
            href="mailto:hello@robertkebinger.com"
            className="group inline-flex items-center gap-4 text-2xl md:text-3xl font-medium hover:opacity-70 transition-opacity hoverable"
          >
            <span>hello@robertkebinger.com</span>
            <ArrowUpRight className="w-8 h-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>

        <div className="flex flex-wrap gap-8 mb-20">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-[hsl(0_0%_65%)] opacity-70 hover:opacity-100 transition-opacity hoverable"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-[hsl(0_0%_65%)] opacity-70 hover:opacity-100 transition-opacity hoverable"
          >
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn</span>
          </a>
          <a
            href="mailto:hello@robertkebinger.com"
            className="group flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-[hsl(0_0%_65%)] opacity-70 hover:opacity-100 transition-opacity hoverable"
          >
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </a>
        </div>

        <div className="pt-12 border-t border-[hsl(0_0%_25%)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <span className="font-mono text-xs text-[hsl(0_0%_65%)]">
            © {currentYear} Robert Kebinger
          </span>
          <span className="font-mono text-xs text-[hsl(0_0%_65%)]">
            Vienna, Austria
          </span>
        </div>
      </div>
    </footer>
  );
}
