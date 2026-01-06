const experiences = [
  {
    period: '2022 — Present',
    role: 'Senior Frontend Developer',
    company: 'Tech Company',
    description: 'Leading frontend development for enterprise applications',
  },
  {
    period: '2020 — 2022',
    role: 'Frontend Developer',
    company: 'Digital Agency',
    description: 'Built responsive web applications for diverse clients',
  },
  {
    period: '2018 — 2020',
    role: 'Junior Developer',
    company: 'Startup',
    description: 'Developed features and maintained codebase for SaaS product',
  },
];

export default function Experience() {
  return (
    <section className="px-5 md:px-10 lg:px-20 py-32">
      <div className="max-w-4xl">
        <span className="font-mono text-xs uppercase tracking-[0.3em] mb-12 block text-[hsl(0_0%_40%)]">
          Experience
        </span>

        <div className="space-y-0">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="group py-8 border-t border-[hsl(0_0%_80%)] hover:bg-[hsl(45_20%_90%)]/30 transition-colors -mx-6 px-6"
            >
              <div className="grid md:grid-cols-12 gap-4 items-start">
                <div className="md:col-span-3">
                  <span className="font-mono text-xs text-[hsl(0_0%_40%)]">
                    {exp.period}
                  </span>
                </div>
                <div className="md:col-span-9">
                  <h3 className="text-lg font-medium mb-1">
                    {exp.role}
                  </h3>
                  <p className="text-sm mb-2 text-[hsl(0_0%_40%)]">
                    {exp.company}
                  </p>
                  <p className="text-sm text-[hsl(0_0%_40%)]">
                    {exp.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
