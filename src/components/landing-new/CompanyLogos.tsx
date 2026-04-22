// @ts-nocheck
export function CompanyLogos() {
  const logos = [
    { name: "Airtable" }, { name: "Calendly" }, { name: "ClickUp" },
    { name: "pipedrive" }, { name: "HubSpot" },
  ];
  return (
    <section className="border-y border-border/30 bg-card py-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            Trusted by founders & teams at
          </p>
          <div className="flex items-center justify-center gap-x-10 gap-y-4 md:gap-x-12">
            {logos.map((logo) => (
              <div key={logo.name} className="text-xl font-bold tracking-tight text-muted-foreground/40 transition-colors duration-300 hover:text-muted-foreground">
                {logo.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
